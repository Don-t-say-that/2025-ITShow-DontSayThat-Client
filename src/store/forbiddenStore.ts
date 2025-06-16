import { create } from 'zustand';

interface ForbbidenState {
  forbbiden: string;
  setForbbiden: (word: string) => void;
}

const forbbidenStore = create<ForbbidenState>((set) => ({
  forbbiden: '',
  setForbbiden: (word) => set({ forbbiden: word }),

}));

export default forbbidenStore;
