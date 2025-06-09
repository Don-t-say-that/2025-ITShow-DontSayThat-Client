import { create } from 'zustand';

interface UserState {
  id: number | null;
  setUserId: (id: number) => void;
  resetUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: null,
  setUserId: (id) => set({ id }),
  resetUser: () => set({ id: null }),
}));

export default useUserStore;
