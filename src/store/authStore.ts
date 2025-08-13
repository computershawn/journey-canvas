import { create } from 'zustand';

import { getFromLocalStorage } from '../utils/storageOps';

const useAuthStore = create((set) => ({
  user: getFromLocalStorage('antsigarm_user'),
  // @ts-expect-error Parameter 'user' implicitly has 'any' type
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  // @ts-expect-error Parameter 'user' implicitly has 'any' type
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
