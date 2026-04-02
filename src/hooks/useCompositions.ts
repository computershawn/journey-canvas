import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase';

export const useCompositions = () => {
  const [authUser, authLoading] = useAuthState(auth);
  // We use `any[]` here to smoothly accept the UI's composition object schema
  const [dbComps, setDbComps] = useState<any[]>([]);
  const [loadingComps, setLoadingComps] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setDbComps([]);
      setLoadingComps(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', authUser.uid);
    setLoadingComps(true);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDbComps(data.compositions || []);
        } else {
          setDbComps([]);
        }
        setLoadingComps(false);
      },
      (err) => {
        console.error('Error fetching user compositions:', err);
        setLoadingComps(false);
      }
    );

    return () => unsubscribe();
  }, [authUser, authLoading]);

  const saveCompositions = async (newComps: any[]) => {
    if (!authUser) return;
    const userDocRef = doc(firestore, 'users', authUser.uid);
    await updateDoc(userDocRef, { compositions: newComps });
  };

  return { dbComps, loadingComps, saveCompositions };
};
