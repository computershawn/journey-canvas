import { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import { useControls } from '../hooks/useControls';
import { loggy, mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
// import { DURATION_FRAMES } from '../constants';

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
    setIsUploading(true);
    setUploadError('');

    if (!canvas) {
      loggy.error("Can't upload frames: No HTML canvas present");
      setUploadError("Can't upload frames: No HTML canvas present");
      setIsUploading(false);
      return;
    }

    // Check if user is loaded and authenticated
    if (authLoading) {
      loggy.error(
        "Can't upload frames: Authentication state is still loading. Please wait.",
      );
      setUploadError(
        "Can't upload frames: Authentication state is still loading. Please wait.",
      );
      setIsUploading(false);
      return;
    }

    if (authError) {
      loggy.error(
        `Can't upload frames upload frames: Authentication error: ${authError.message}`,
      );
      setUploadError(
        `Can't upload frames upload frames: Authentication error: ${authError.message}`,
      );
      setIsUploading(false);
      return;
    }

    if (!authUser) {
      loggy.error(
        "Can't upload frames: You must be logged in to generate a video.",
      );
      setUploadError(
        "Can't upload frames: You must be logged in to generate a video.",
      );
      setIsUploading(false);
      return;
    }

    const startFrame = 0;
    const limit = 24; // DURATION_FRAMES;
    const uploadPromises: Promise<void>[] = [];

    for (let i = startFrame; i < startFrame + limit; i++) {
      updateForRender(i);
      draw();
      const paddedIndex = String(i + 1).padStart(4, '0');
      const imagePath = `users/${authUser.uid}/frames/frame-${paddedIndex}.jpg`;
      const storageRef = ref(storage, imagePath);

      // Wrap toBlob in a Promise so you can await it
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

      uploadPromises.push(uploadPromise);
    }

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      loggy.error('Error uploading frames:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFrames, isUploading, uploadError };
};
