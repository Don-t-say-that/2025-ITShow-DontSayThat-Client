import { create } from 'zustand';

interface CharacterState {
  x: number;
  y: number;
  imgUrl: string;
  setPosition: (x: number, y: number) => void;
  setImage: (url: string) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  x: 100,
  y: 100,
  imgUrl: '',
  setPosition: (x, y) => set({ x, y }),
  setImage: (url) => set({ imgUrl: url }),
}));
