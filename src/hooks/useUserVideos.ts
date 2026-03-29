import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase';

export const useUserVideos = () => {
  const [authUser] = useAuthState(auth);
  const [videoIDs, setVideoIDs] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authUser) {
      setVideoIDs([]);
      setIsRendering(false);
      setLoading(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', authUser.uid);
    
    setLoading(true);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Assume videos is an array of strings in the format the user described
          setVideoIDs(data.videoIDs || []);
          setIsRendering(data.isRendering || false);
        } else {
          setVideoIDs([]);
          setIsRendering(false);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user videos:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser]);

  return { videoIDs, loading, error, isRendering };
};
