/* eslint-disable operator-linebreak */
/* eslint-disable require-jsdoc */
const { onMessagePublished } = require('firebase-functions/v2/pubsub');
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
const { FPS, MAX_TICKS, HEIGHT, WIDTH } = require('./constants');

function mapTo(value, fromMin, fromMax, toMin, toMax) {
  const amount = value / (fromMax - fromMin);
  return toMin + amount * (toMax - toMin);
}

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

function drawTickmarks(ctx, poly, color, spacing) {
  const pt0 = { x: poly[0] / 100, y: poly[1] / 100 };
  const pt1 = { x: poly[2] / 100, y: poly[3] / 100 };
  const pt2 = { x: poly[4] / 100, y: poly[5] / 100 };
  const pt3 = { x: poly[6] / 100, y: poly[7] / 100 };
  const dx1 = pt0.x - pt1.x;
  const dy1 = pt0.y - pt1.y;
  const dx2 = pt2.x - pt3.x;
  const dy2 = pt2.y - pt3.y;
  const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

  const longSide = Math.max(dist1, dist2);
  let len = longSide;
  if (longSide < 1) {
    len = 1;
  } else if (longSide > 200) {
    len = 200;
  }

  const numTicks = Math.round(mapTo(len, 1, 200, 1, MAX_TICKS));

  ctx.strokeStyle = color;
  for (let j = 1; j < numTicks; j++) {
    const b = j / numTicks;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      pt0.x + b * spacing * (pt1.x - pt0.x),
      pt0.y + b * spacing * (pt1.y - pt0.y),
    );
    ctx.lineTo(
      pt3.x + b * spacing * (pt2.x - pt3.x),
      pt3.y + b * spacing * (pt2.y - pt3.y),
    );
  }
}

/**
 * Parse polygons JSON stream, render frames to a Canvas, and pipe to FFmpeg
 */
function processFramesToStream(
  meta,
  polygonsTmpPath,
  inputStream,
  thumbTmpPath = null,
) {
  return new Promise((resolve, reject) => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const fileStream = fs.createReadStream(polygonsTmpPath);
    const parser = JSONStream.parse([true]);

    let frameCount = 0;

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

        // Render tick marks
        const tickData = meta.polygonTickmarks[j];
        drawTickmarks(ctx, poly, tickData.color, tickData.tickSpacing);
      }

      if (frameCount === 0 && thumbTmpPath) {
        const thumbWidth = 160;
        const thumbHeight = Math.round(HEIGHT * (thumbWidth / WIDTH));
        const thumbCanvas = createCanvas(thumbWidth, thumbHeight);
        const thumbCtx = thumbCanvas.getContext('2d');
        thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);
        const thumbBuffer = thumbCanvas.toBuffer('image/png');
        try {
          fs.writeFileSync(thumbTmpPath, thumbBuffer);
          console.log('Thumbnail successfully extracted to', thumbTmpPath);
        } catch (err) {
          console.error('Failed to write thumbnail:', err);
        }
      }
      frameCount++;

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
    // Ensure Firebase Admin is initialized
    if (!admin.apps.length) {
      admin.initializeApp();
    }

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
      const thumbTmpPath = path.join(os.tmpdir(), `th-${jobId}.png`);

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
        await processFramesToStream(
          meta,
          polygonsTmpPath,
          inputStream,
          thumbTmpPath,
        );

        // Wait for the video file to finish rendering
        await ffmpegPromise;

        // Delete meta and polygons files from Firebase Storage - no longer needed
        await bucket.file(metaStoragePath).delete().catch(() => {});
        await bucket.file(polygonsStoragePath).delete().catch(() => {});

        // 5. Upload video and send signed URL back
        console.log('Uploading video and thumbnail to Firebase Storage...');
        const destFileName = `users/${uid}/videos/video-${jobId}.mp4`;
        const destThumbName = `users/${uid}/thumbnails/th-${jobId}.png`;

        if (fs.existsSync(thumbTmpPath)) {
          await bucket.upload(thumbTmpPath, {
            destination: destThumbName,
            metadata: { contentType: 'image/png' },
          });
          console.log('Thumbnail uploaded to', destThumbName);
        }

        const url = await uploadAndSignUrl(bucket, outputVideo, destFileName);

        // Update the user's videoIDs array in the 'facts' database
        console.log("Updating user's videoIDs array in facts database...");
        const {
          getFirestore,
          FieldValue,
        } = require('firebase-admin/firestore');
        const db = getFirestore(admin.app(), 'facts');

        await db
          .collection('users')
          .doc(uid)
          .set(
            {
              videoIDs: FieldValue.arrayUnion(jobId),
              isRendering: false,
            },
            { merge: true },
          );

        res.status(200).json({
          message: `Video and thumbnail created and uploaded successfully.`,
          downloadUrl: url,
        });
      } catch (error) {
        console.error('Process Failed:', error);
        try {
          const { getFirestore } = require('firebase-admin/firestore');
          const db = getFirestore(admin.app(), 'facts');
          await db
            .collection('users')
            .doc(uid)
            .set({ isRendering: false }, { merge: true });
        } catch (dbErr) {
          console.error('Failed to clear isRendering flag:', dbErr);
        }

        res
          .status(500)
          .json({ error: 'An error occurred while rendering the video.' });
      } finally {
        // 6. Cleanup completely
        console.log('Cleaning up /tmp directory...');
        const filesToClean = [
          metaTmpPath,
          polygonsTmpPath,
          outputVideo,
          thumbTmpPath,
        ];

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

// Use parseFloat to ensure we are working with a number
const BUDGET_THRESHOLD = 0.95;

exports.budgetKillSwitch = onMessagePublished(
  'budget-alerts',
  async (event) => {
    // Ensure Firebase Admin is initialized
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    try {
      // FIX: .json is a property, not a function call ()
      const data = event.data.message.json;

      if (
        !data ||
        typeof data.costAmount !== 'number' ||
        typeof data.budgetAmount !== 'number'
      ) {
        console.error('Invalid budget data received:', data);
        return;
      }

      const { costAmount, budgetAmount } = data;
      console.log(`Current spend: $${costAmount} of $${budgetAmount}`);

      if (costAmount >= budgetAmount * BUDGET_THRESHOLD) {
        console.log(
          `⚠️ Budget threshold (${
            BUDGET_THRESHOLD * 100
          }%) reached. Locking Firestore...`,
        );

        const lockedRules = `
          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              match /{document=**} {
                allow read, write: if false;
              }
            }
          }
        `;

        try {
          const rules = admin.securityRules();
          const rulesFile = rules.createRulesFileFromSource(
            'firestore.rules',
            lockedRules,
          );
          const ruleset = await rules.createRuleset(rulesFile);
          await rules.releaseRuleset(ruleset, 'cloud.firestore/facts');

          console.log('Firestore has been locked to prevent further costs.');
        } catch (error) {
          console.error('Failed to lock Firestore:', error);
        }
      }
    } catch (functionError) {
      console.error('Budget kill switch function failed:', functionError);
    }
  },
);
