import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase';

export const useUserVideos = () => {
  const [authUser] = useAuthState(auth);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authUser) {
      setVideoIds([]);
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
          setVideoIds(data.videoIDs || []);
        } else {
          setVideoIds([]);
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

  return { videoIds, loading, error };
};
