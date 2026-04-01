// Upload a JSON file containing TBD

import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { loggy } from '../utils/helpers';
import { auth } from '../firebase';

import type { StorageReference } from 'firebase/storage';

export const useUploadAnimationData = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [authUser, authLoading, authError] = useAuthState(auth);

  const storage = getStorage();

  const uploadAnimationData = async (
    backgroundColor: string,
    polygons: number[][][],
    polygonColors: string[],
    polygonTickmarks: {
      color: string;
      tickSpacing: number;
    }[],
    jobId: string,
  ) => {
    // Check if user is loaded and authenticated
    if (authLoading) {
      setUploadError(
        "Can't upload animation data: Authentication state is still loading. Please wait.",
      );
      console.log(
        "Can't upload animation data: Authentication state is still loading. Please wait.",
      );
      return;
    }

    if (authError) {
      setUploadError(
        `Can't upload animation data: Authentication error: ${authError.message}`,
      );
      console.log(
        `Can't upload animation data: Authentication error: ${authError.message}`,
      );
      return;
    }

    if (!authUser) {
      setUploadError(
        "Can't upload animation data: You must be logged in to generate a video.",
      );
      console.log(
        "Can't upload animation data: You must be logged in to generate a video.",
      );
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Create a unique folder for this animation upload
      const animationFolder = `users/${authUser.uid}/animations`;

      // Prepare meta.json
      const meta = {
        polygonColors,
        polygonTickmarks,
        backgroundColor,
      };
      const metaBlob = new Blob([JSON.stringify(meta)], {
        type: 'application/json',
      });

      const metaRef = ref(storage, `${animationFolder}/meta-${jobId}.json`);

      // Prepare polygons.json
      const polygonsBlob = new Blob([JSON.stringify(polygons)], {
        type: 'application/json',
      });
      const polygonsRef = ref(
        storage,
        `${animationFolder}/polygons-${jobId}.json`,
      );

      // Helper to upload a blob and return a promise
      const uploadBlob = (storageRef: StorageReference, blob: Blob) => {
        return new Promise<void>((resolve, reject) => {
          const uploadTask = uploadBytesResumable(storageRef, blob);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              if (snapshot.bytesTransferred === snapshot.totalBytes) {
                console.info(
                  `${snapshot.bytesTransferred} of ${snapshot.totalBytes} bytes uploaded.`,
                );
              }
            },
            (error) => {
              setUploadError('Upload failed: ' + error.message);
              reject(error);
            },
            () => {
              resolve();
            },
          );
        });
      };

      // Upload both files in parallel
      await Promise.all([
        uploadBlob(metaRef, metaBlob),
        uploadBlob(polygonsRef, polygonsBlob),
      ]);
      // loggy.info('Successfully uploaded meta.json and polygons.json.');
    } catch (error) {
      loggy.error('Error uploading animation data:', error);
      setUploadError(
        'Error uploading animation data: ' + (error as Error).message,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAnimationData, isUploading, uploadError };
};
