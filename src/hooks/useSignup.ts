'use client';

import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import useAuthStore from '../store/authStore';
import { saveToLocalStorage } from '../utils/storageOps';
import { loggy } from '../utils/helpers';

export const useSignup = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createUserWithEmailAndPassword, registeredUser, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  // @ts-expect-error 'state' is of type 'unknown'
  const loginUser = useAuthStore((state) => state.login);

  // @ts-expect-error 'inputs' implicitly has 'any' type
  const signUp = async (inputs) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    ) {
      loggy.error('Please fill all fields');
    }

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', inputs.username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      loggy.error('Username already exists');
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password,
      );
      if (!newUser && error) {
        loggy.error('Signup failed');
        return;
      }
      if (newUser) {
        const newUserDoc = {
          uid: newUser.user.uid,
          email: inputs.email,
          username: inputs.username,
          fullName: inputs.fullName,
          bio: '',
          profilePicUrl: '',
          followers: [],
          following: [],
          posts: [],
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(firestore, 'users', newUser.user.uid), newUserDoc);
        saveToLocalStorage('journey_user', newUserDoc);
        loginUser(newUserDoc);
      }
    } catch (error) {
      // @ts-expect-error 'error' is of type 'unknown'
      onErrorCallback(error.message);
    }
  };

  return {
    loading,
    error,
    signUp,
  };
};
