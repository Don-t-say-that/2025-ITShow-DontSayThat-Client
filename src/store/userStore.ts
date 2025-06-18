import { create } from "zustand";

interface UserState {
  id: number | null;
  isReady: boolean;
  score: number;
  setScore: (score: number) => void;
  setUserId: (id: number) => void;
  setIsReady: (userId: number, isReady: boolean) => void;
  resetUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: null,
  isReady: false,
  score: 0,
  setUserId: (id) => set({ id }),
  setScore: (score) => set({ score }),
  setIsReady: (userId, isReady) => set({ isReady }),
  resetUser: () => set({ id: null, isReady: false }),
}));

export default useUserStore;
