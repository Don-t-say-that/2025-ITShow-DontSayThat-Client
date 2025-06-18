import { create } from 'zustand';

interface CharacterState {
  x: number;
  y: number;
  imgUrl: string;
  
  setPosition: (x: number, y: number) => void;
  setImage: (url: string) => void;
}

// 화면 중앙 계산
const screenWidth = 1920;
const screenHeight = 1080;
const characterWidth = 200;
const characterHeight = 200;

const centerX = (screenWidth - characterWidth) / 2;
const centerY = (screenHeight - characterHeight) / 2;

export const useCharacterStore = create<CharacterState>((set) => ({
  x: centerX,
  y: centerY,
  imgUrl: '',
  setPosition: (x, y) => set({ x, y }),
  setImage: (url) => set({ imgUrl: url }),
}));