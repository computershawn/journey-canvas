'use client';

import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import { loggy } from '../utils/helpers';

// This useLogin custom hook is a simplified version of useLogin from
// https://github.com/computershawn/antsigarm/blob/main/src/hooks/useLogin.ts
// In that project, we save information to local storage and store additional
// user data in a 'users' Firestore collection. If it turns out that we need
// to store additional user data, that project can be used as a reference.
export const useLogin = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signInWithEmailAndPassword, loggedInUser, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // @ts-expect-error Parameter 'inputs' implicitly has an 'any' type
  const login = async (inputs) => {
    if (!inputs.email || !inputs.password) {
      loggy.error('Please fill all fields');
    }

    try {
      await signInWithEmailAndPassword(inputs.email, inputs.password);
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
