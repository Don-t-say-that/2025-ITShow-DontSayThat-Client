import { create } from 'zustand';

interface UserState {
  id: number | null;
  isReady: boolean;
  setUserId: (id: number) => void;
  setIsReady: (userId: number, isReady: boolean) => void;
  resetUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: null,
  isReady: false,
  setUserId: (id) => set({ id }),
  setIsReady: (userId, isReady) => set({ isReady }),
  resetUser: () => set({ id: null, isReady: false }),
}));

export default useUserStore;