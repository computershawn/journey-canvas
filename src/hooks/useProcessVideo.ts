import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { useHttpsCallable } from 'react-firebase-hooks/functions';

import { auth } from '../firebase';
import { loggy } from '../utils/helpers';

// const FIREBASE_FUNCTION_NAME = 'videoGen';
// const CLOUD_RUN_SERVICE_URL = 'https://video-processor-service-ohvvwjkf6q-uc.a.run.app';
// const CLOUD_FUNCTION_URL =
//   'https://us-central1-sequence-to-video.cloudfunctions.net/doAllOfTheThings'
// const CLOUD_FUNCTION_URL =
//   'http://localhost:5001/sequence-to-video/us-central1/doAllOfTheThings';
const CLOUD_FUNCTION_URL = 'https://doallofthethings-ohvvwjkf6q-uc.a.run.app';

// export const useProcessVideoORIG = () => {
//   const [executeCallable, executing, error] = useHttpsCallable(
//     fireFunctions,
//     FIREBASE_FUNCTION_NAME,
//   );

//   return {
//     processVideo: () =>
//       executeCallable({
//         imagePrefix: 'frames/frame-',
//         imageCount: 24,
//         frameRate: 24,
//         outputFilename: 'output-video.mp4',
//       }),
//     videoIsProcessing: executing,
//     videoCreateError: error,
//   };
// };

export const useProcessVideo = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the useAuthState hook to get the current user and auth state
  const [authUser, authLoading, authError] = useAuthState(auth);

  const processVideo = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');

    // Check if user is loaded and authenticated
    if (authLoading) {
      loggy.error(
        "Can't process video: Authentication state is still loading. Please wait.",
      );
      setError(
        "Can't process video: Authentication state is still loading. Please wait.",
      );
      setLoading(false);
      return;
    }

    if (authError) {
      loggy.error(
        `Can't process video: Authentication error: ${authError.message}`,
      );
      setError(
        `Can't process video: Authentication error: ${authError.message}`,
      );
      setLoading(false);
      return;
    }

    if (!authUser) {
      loggy.error(
        "Can't process video: You must be logged in to generate a video.",
      );
      setError(
        "Can't process video: You must be logged in to generate a video.",
      );
      setLoading(false);
      return;
    }

    // TODO: We need to send the user's ID (authUser.uid) to the backend so the cloud function
    //       knows which folder to download frames from, and which folder to save the video to.
    await fetch(CLOUD_FUNCTION_URL, {
      method: 'GET', // or 'POST' if your function expects POST
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${idToken}`, // Send the ID token for authentication
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.downloadUrl) {
          setVideoUrl(data.downloadUrl);
        }

        // if (data.message) {
        //   loggy.info(data.message);
        // }
      })
      .catch(() => {
        setError('Failed to generate video');
        // if (error instanceof Error) {
        //   setError(`Failed to generate video: ${error.message}`);
        // } else {
        //   setError('Failed to generate video');
        // }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    processVideo,
    isRendering: loading,
    videoCreateError: error,
    videoUrl,
  };
};
