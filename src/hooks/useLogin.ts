'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase';
import useAuthStore from '../store/authStore';
import { saveToLocalStorage } from '../utils/storageOps';
import { loggy } from '../utils/helpers';

export const useLogin = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithEmailAndPassword, loggedInUser, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // @ts-expect-error 'state' is of type 'unknown'
  const loginUser = useAuthStore((state) => state.login);

  // @ts-expect-error Parameter 'inputs' implicitly has an 'any' type
  const login = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      loggy.error('Please fill all fields');
    }

    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password,
      );
      if (userCred) {
        const docRef = doc(firestore, 'users', userCred.user.uid);
        const docSnap = await getDoc(docRef);
        saveToLocalStorage('journey_user', docSnap.data());
        loginUser(docSnap.data());
      }
    } catch (error) {
      loggy.error('Login failed', error);
    }
  };

  return {
    loading,
    error,
    login,
  };
};
