import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import { loggy } from '../utils/helpers';

const cloudFunctionUrl = import.meta.env.VITE_PUBLIC_CLOUD_FUNCTION_URL;

export const useProcessVideo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the useAuthState hook to get the current user and auth state
  const [authUser, authLoading, authError] = useAuthState(auth);

  const processVideo = async (jobId: string) => {
    if (loading) return;
    
    setLoading(true);
    setError('');

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

    try {
      const token = await authUser.getIdToken();
      const response = await fetch(cloudFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cloud function failed with status ${response.status}: ${errorText}`,
        );
      }

      const data = await response.json();
      if (data.downloadUrl) {
        return data.downloadUrl;
      }
      if (data.message) {
        loggy.info(data.message);
      }
    } catch (err) {
      loggy.error('Error calling function:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while processing the video',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    processVideo,
    isRendering: loading,
    videoCreateError: error,
  };
};
