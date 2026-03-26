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

/**
 * Authentication Verification
 */
async function verifyAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Unauthorized: Missing or invalid token.');
    err.status = 401;
    throw err;
  }
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (e) {
    const err = new Error('Unauthorized: Token verification failed.');
    err.status = 403;
    throw err;
  }
}

/**
 * Parse polygons JSON stream, render frames to a Canvas, and pipe to FFmpeg
 */
function processFramesToStream(meta, polygonsTmpPath, inputStream) {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const fileStream = fs.createReadStream(polygonsTmpPath);
    const parser = JSONStream.parse([true]);

    parser.on('end', () => {
      console.log('Finished parsing polygons. Closing input stream.');
      inputStream.end();
      resolve();
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

      if (!canContinue) {
        parser.pause();
        inputStream.once('drain', () => {
          parser.resume();
        });
      }
    });

    fileStream.pipe(parser);
  });
}

/**
 * Upload video file to Firebase Storage and generate a signed URL
 */
async function uploadAndSignUrl(bucket, localFilePath, destinationPath) {
  const [uploadedFile] = await bucket.upload(localFilePath, {
    destination: destinationPath,
  });

  const LIFESPAN_HOURS = 8;
  const [url] = await uploadedFile.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000 * LIFESPAN_HOURS,
  });

  return url;
}

exports.generateVideo = onRequest(
  { memory: '2GiB', timeoutSeconds: 540 },
  (req, res) => {
    cors(req, res, async () => {
      // 1. Authenticate user
      let uid;
      try {
        uid = await verifyAuth(req.get('Authorization'));
      } catch (error) {
        return res.status(error.status || 500).json({ error: error.message });
      }

      const jobId = req.body.jobId;
      if (!jobId) {
        return res.status(400).json({ error: 'Bad Request: Missing jobId.' });
      }

      const bucket = admin.storage().bucket();
      const metaStoragePath = `users/${uid}/animations/meta-${jobId}.json`;
      const polygonsStoragePath = `users/${uid}/animations/polygons-${jobId}.json`;

      // File paths in the /tmp directory
      const metaTmpPath = path.join(os.tmpdir(), `meta-${jobId}.json`);
      const polygonsTmpPath = path.join(os.tmpdir(), `polygons-${jobId}.json`);
      const outputVideo = path.join(os.tmpdir(), `output-${jobId}.mp4`);

      try {
        // 2. Download files to /tmp
        console.log('Downloading meta and polygon files...');
        await Promise.all([
          bucket.file(metaStoragePath).download({ destination: metaTmpPath }),
          bucket
            .file(polygonsStoragePath)
            .download({ destination: polygonsTmpPath }),
        ]);

        const metaDataRaw = await fsPromises.readFile(metaTmpPath, 'utf8');
        const meta = JSON.parse(metaDataRaw);

        // 3. Prepare FFmpeg pipeline
        const inputStream = new PassThrough();

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

        // 4. Start streaming canvas frames
        console.log('Starting frame generation...');
        await processFramesToStream(meta, polygonsTmpPath, inputStream);

        // Wait for the video file to finish rendering
        await ffmpegPromise;

        // 5. Upload video and send signed URL back
        console.log('Uploading video to Firebase Storage...');
        const destFileName = `users/${uid}/videos/video-${jobId}.mp4`;
        const url = await uploadAndSignUrl(bucket, outputVideo, destFileName);

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
        // 6. Cleanup completely
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
