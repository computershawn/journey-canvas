import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { auth, fireFunctions } from '../firebase';

const FIREBASE_FUNCTION_NAME = 'videoGen';
const CLOUD_RUN_SERVICE_URL =
  'https://video-processor-service-ohvvwjkf6q-uc.a.run.app';

export const useProcessVideoORIG = () => {
  const [executeCallable, executing, error] = useHttpsCallable(
    fireFunctions,
    FIREBASE_FUNCTION_NAME,
  );

  return {
    processVideo: () =>
      executeCallable({
        imagePrefix: 'frames/frame-',
        imageCount: 24,
        frameRate: 24,
        outputFilename: 'output-video.mp4',
      }),
    videoIsProcessing: executing,
    videoCreateError: error,
  };
};

export const useProcessVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the useAuthState hook to get the current user and auth state
  const [user, authLoading, authError] = useAuthState(auth);

  const processVideo = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');

    // Check if user is loaded and authenticated
    if (authLoading) {
      setError('Authentication state is still loading. Please wait.');
      setLoading(false);
      return;
    }

    if (authError) {
      setError(`Authentication error: ${authError.message}`);
      setLoading(false);
      return;
    }

    if (!user) {
      setError('You must be logged in to generate a video.');
      setLoading(false);
      return;
    }

    try {
      // Get the ID token from the authenticated user
      const idToken = await user?.getIdToken();

      const response = await fetch(CLOUD_RUN_SERVICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`, // Send the ID token for authentication
        },
        body: JSON.stringify({
          imagePrefix: 'frames/frame-',
          imageCount: 24,
          frameRate: 24,
          outputFilename: 'output-video.mp4',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${errorText}`,
        );
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error('Error generating video:', err);
      if (err instanceof Error) {
        setError(`Failed to generate video: ${err.message}`);
      } else {
        setError('Failed to generate video');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    processVideo,
    videoIsProcessing: loading,
    videoCreateError: error,
    videoUrl,
  };
};
