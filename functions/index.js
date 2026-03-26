/* eslint-disable operator-linebreak */
/* eslint-disable require-jsdoc */
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: [
    'https://www.geometrybureau.cloud',
    'https://geometrybureau.cloud',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
const fs = require('fs');
const fsPromises = require('fs').promises;
const { onRequest } = require('firebase-functions/v2/https');
const os = require('os');
const path = require('path');

const { createCanvas } = require('@napi-rs/canvas');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const JSONStream = require('JSONStream');
const { PassThrough } = require('stream');
const { FPS, HEIGHT, WIDTH } = require('./constants');

// Initialize Firebase Admin once globally
admin.initializeApp();

exports.doAllOfTheThings = onRequest(
  { memory: '2GiB', timeoutSeconds: 540 },
  (req, res) => {
    cors(req, res, async () => {
      // 1. SECURITY: Verify Firebase Auth ID Token instead of trusting req.body.uid
      const authHeader = req.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: Missing or invalid token.' });
      }

      let uid;
      try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
      } catch (error) {
        console.error('Auth Error:', error);
        return res
          .status(403)
          .json({ error: 'Unauthorized: Token verification failed.' });
      }

      const jobId = req.body.jobId;
      if (!jobId) {
        return res.status(400).json({ error: 'Bad Request: Missing jobId.' });
      }

      const bucket = admin.storage().bucket();
      const metaStoragePath = `users/${uid}/animations/meta-${jobId}.json`;
      // eslint-disable-next-line max-len
      const polygonsStoragePath = `users/${uid}/animations/polygons-${jobId}.json`;

      // File paths in the /tmp directory
      const metaTmpPath = path.join(os.tmpdir(), `meta-${jobId}.json`);
      const polygonsTmpPath = path.join(os.tmpdir(), `polygons-${jobId}.json`);
      const outputVideo = path.join(os.tmpdir(), `output-${jobId}.mp4`);

      // 2. CONCURRENCY FIX: Instantiate Canvas and Stream inside the request handler
      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');
      const inputStream = new PassThrough();

      try {
        // 3. Download JSON files from Storage to /tmp
        console.log('Downloading meta and polygon files...');
        await Promise.all([
          bucket.file(metaStoragePath).download({ destination: metaTmpPath }),
          bucket
            .file(polygonsStoragePath)
            .download({ destination: polygonsTmpPath }),
        ]);

        // 4. Read metadata using Promises to avoid crashing the Node process on error
        const metaDataRaw = await fsPromises.readFile(metaTmpPath, 'utf8');
        const meta = JSON.parse(metaDataRaw);

        // 5. Set up FFmpeg as a Promise so we can await its completion
        const ffmpegPromise = new Promise((resolve, reject) => {
          ffmpeg(inputStream)
            .inputFormat('image2pipe')
            .inputFPS(FPS)
            .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-crf 18'])
            .output(outputVideo)
            .on('start', () => console.log('FFmpeg rendering started...'))
            .on('error', (err) => {
              console.error('FFmpeg Error:', err);
              reject(err);
            })
            .on('end', () => {
              console.log('FFmpeg rendering finished!');
              resolve();
            })
            .run();
        });

        // 6. STREAMING FIX: Use Event Listeners with manual pause/resume wrapped in a Promise
        console.log('Starting frame generation...');
        await new Promise((resolve, reject) => {
          const fileStream = fs.createReadStream(polygonsTmpPath);
          const parser = JSONStream.parse([true]);

          parser.on('end', () => {
            console.log('Finished parsing polygons. Closing input stream.');
            inputStream.end(); // Tell FFmpeg no more frames are coming
            resolve(); // Resolve this promise so the code can move on
          });

          parser.on('error', (err) => {
            console.error('JSONStream parsing error:', err);
            inputStream.end();
            reject(err);
          });

          parser.on('data', (polygonFrame) => {
            // Draw background
            ctx.fillStyle = meta.backgroundColor || 'black';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            // Draw polygons
            for (let j = 0; j < polygonFrame.length; j++) {
              const poly = polygonFrame[j];
              const coco =
                meta.polygonColors && meta.polygonColors[j]
                  ? meta.polygonColors[j]
                  : '#ffffff';

              ctx.fillStyle = coco;
              ctx.strokeStyle = '#000000';
              ctx.beginPath();
              ctx.moveTo(poly[0] / 100, poly[1] / 100);
              ctx.lineTo(poly[2] / 100, poly[3] / 100);
              ctx.lineTo(poly[4] / 100, poly[5] / 100);
              ctx.lineTo(poly[6] / 100, poly[7] / 100);
              ctx.closePath();
              ctx.stroke();
              ctx.fill();
            }

            const buffer = canvas.toBuffer('image/jpeg');

            // Write to stream and handle backpressure manually
            const canContinue = inputStream.write(buffer);

            // If FFmpeg is falling behind, pause the JSON reader!
            if (!canContinue) {
              parser.pause();

              // Wait for FFmpeg to drain its buffer, then resume reading
              inputStream.once('drain', () => {
                parser.resume();
              });
            }
          });

          // Start piping the file into the JSON parser
          fileStream.pipe(parser);
        });

        // Wait for the video file to finish rendering (from Step 5)
        await ffmpegPromise;

        // 7. Upload the finished video back to Firebase Storage
        console.log('Uploading video to Firebase Storage...');
        const destFileName = `users/${uid}/videos/video-${jobId}.mp4`;
        const [uploadedFile] = await bucket.upload(outputVideo, {
          destination: destFileName,
        });

        console.log('Generating signed URL...');
        const LIFESPAN_HOURS = 8;
        const [url] = await uploadedFile.getSignedUrl({
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000 * LIFESPAN_HOURS,
        });

        // Send success response
        res.status(200).json({
          message: `Video created and uploaded successfully.`,
          downloadUrl: url,
        });
      } catch (error) {
        console.error('Process Failed:', error);
        res
          .status(500)
          .json({ error: 'An error occurred while rendering the video.' });
      } finally {
        // 8. STORAGE LEAK FIX: Ensure all /tmp files are deleted, even if errors occurred
        console.log('Cleaning up /tmp directory...');
        const filesToClean = [metaTmpPath, polygonsTmpPath, outputVideo];

        for (const file of filesToClean) {
          try {
            if (fs.existsSync(file)) {
              await fsPromises.unlink(file);
            }
          } catch (cleanupError) {
            console.error(`Failed to delete temp file ${file}:`, cleanupError);
          }
        }
      }
    });
  },
);
