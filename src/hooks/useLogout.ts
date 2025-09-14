'use client';

import { useSignOut } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';
import useAuthStore from '../store/authStore';
import { removeFromLocalStorage } from '../utils/storageOps';

export const useLogout = (onErrorCallback: (s: string) => void) => {
  const [signOut, loading, error] = useSignOut(auth);
  // @ts-expect-error 'state' is of type 'unknown'
  const logoutUser = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await signOut();
      removeFromLocalStorage('journey_user');
      logoutUser();
    } catch (error) {
      // @ts-expect-error 'error' is of type 'unknown'
      onErrorCallback(error.message);
    }
  };

  return {
    isLoggingOut: loading,
    handleLogout,
    error,
  };
};
