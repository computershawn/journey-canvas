import { create } from 'zustand';

const useUserProfileStore = create((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  // addPost: (post) =>
}));

export default useUserProfileStore;
