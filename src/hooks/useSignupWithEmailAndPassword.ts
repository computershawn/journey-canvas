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

export const useSignupWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  // @ts-expect-error 'state' is of type 'unknown'
  const loginUser = useAuthStore((state) => state.login);
  
  
  // @ts-expect-error 'inputs' implicitly has 'any' type
  const signUp = async (inputs, onErrorCallback) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    ) {
      console.log('Please fill all fields');
    }

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('username', '==', inputs.username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      onErrorCallback('Username already exists');
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser && error) {
        // @ts-expect-error Property 'message' does not exist on 'true'
        onErrorCallback(error.message);

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
        saveToLocalStorage('antsigarm_user', newUserDoc);
        loginUser(newUserDoc);
      }
    } catch (error) {
      // @ts-expect-error 'error' is of type 'unknown'
      onErrorCallback(error.message);
    }
  };

  return {
    loading: Boolean(loading),
    error,
    signUp,
  };
};
