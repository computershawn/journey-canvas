import { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useControls } from '../hooks/useControls';
import { loggy, mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';
import { DURATION_FRAMES } from '../constants';
import { auth } from '../firebase';

export const useUploadFrames = ({
  canvas,
  draw,
  nullElements,
  updateFanBlades,
}: {
  canvas: HTMLCanvasElement | null;
  draw: () => void;
  nullElements: NullElement[];
  updateFanBlades: () => void;
}) => {
  const { balance, diff } = useControls();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [authUser, authLoading, authError] = useAuthState(auth);

  const storage = getStorage();

  const updateForRender = (frame: number) => {
    // Update all positions of our references
    const difference = mapTo(diff, 0, 100, 1, 8);

    nullElements.forEach((nE) => {
      nE.update(frame, balance / 100, difference);
    });

    updateFanBlades();
  };

  const uploadFrames = async () => {
    if (!canvas) {
      loggy.error("Can't upload frames: No HTML canvas present");
      setUploadError("Can't upload frames: No HTML canvas present");
      return;
    }

    // Check if user is loaded and authenticated
    if (authLoading) {
      setUploadError(
        "Can't upload frames: Authentication state is still loading. Please wait.",
      );
      return;
    }

    if (authError) {
      setUploadError(
        `Can't upload frames upload frames: Authentication error: ${authError.message}`,
      );
      return;
    }

    if (!authUser) {
      setUploadError(
        "Can't upload frames: You must be logged in to generate a video.",
      );
      return;
    }

    setIsUploading(true);
    setUploadError('');
    const startFrame = 0;
    const limit = DURATION_FRAMES;
    const batchSize = 12; // Process 12 frames at a time

    try {
      // Process frames in batches
      for (let i = startFrame; i < startFrame + limit; i += batchSize) {
        const batchPromises: Promise<void>[] = [];

        // Create a batch of promises
        for (let j = i; j < Math.min(i + batchSize, startFrame + limit); j++) {
          updateForRender(j);
          draw();
          const paddedIndex = String(j + 1).padStart(4, '0');
          const imagePath = `users/${authUser.uid}/frames/frame-${paddedIndex}.jpg`;
          const storageRef = ref(storage, imagePath);

          const uploadPromise = new Promise<void>((resolve, reject) => {
            canvas.toBlob(
              async (blob) => {
                if (blob) {
                  try {
                    await uploadBytes(storageRef, blob);
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                } else {
                  reject(new Error('Failed to create blob'));
                }
              },
              'image/jpeg',
              0.8,
            );
          });

          batchPromises.push(uploadPromise);
        }

        // Wait for the current batch to complete before moving to the next
        await Promise.all(batchPromises);
      }
    } catch (error) {
      loggy.error('Error uploading frames:', error);
      setUploadError('Error uploading frames: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFrames, isUploading, uploadError };
};
