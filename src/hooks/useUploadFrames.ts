import { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

import { useControls } from '../hooks/useControls';
import { mapTo } from '../utils/helpers';
import NullElement from '../utils/nullElement';

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
      console.error('No HTML canvas present');
      return;
    }

    const startFrame = 0;
    const limit = 120;
    const uploadPromises: Promise<void>[] = [];

    for (let i = startFrame; i < startFrame + limit; i++) {
      updateForRender(i);
      draw();
      const paddedIndex = String(i + 1).padStart(4, '0');
      const imagePath = `frames/frame-${paddedIndex}.jpg`;
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

    setIsUploading(true);

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading frames:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFrames, isUploading };
};
