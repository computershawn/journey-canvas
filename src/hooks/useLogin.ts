'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase';
import useAuthStore from '../store/authStore';
import { saveToLocalStorage } from '../utils/storageOps';

export const useLogin = () => {
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
    // @ts-expect-error 'state' is of type 'unknown'
  const loginUser = useAuthStore((state) => state.login);

  // @ts-expect-error Parameter 'inputs' implicitly has an 'any' type
  const login = async (inputs, onErrorCallback) => {
    if (!inputs.email || !inputs.password) {
      console.log('Please fill all fields');
    }

    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (userCred) {
        const docRef = doc(firestore, 'users', userCred.user.uid);
        const docSnap = await getDoc(docRef);
        saveToLocalStorage('antsigarm_user', docSnap.data());
        loginUser(docSnap.data());
      }
    } catch (error) {
      // @ts-expect-error 'error' is of type 'unknown'
      onErrorCallback(error.message);
    }
  };

  return {
    loading,
    error,
    login,
  };
};
