import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import { loggy } from '../utils/helpers';

const cloudFunctionUrl = import.meta.env.VITE_PUBLIC_CLOUD_FUNCTION_URL;

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

    const token = await authUser.getIdToken();
    await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: authUser.uid, // Add the UID here
      }),
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
        loggy.error('Failed to generate video');
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
