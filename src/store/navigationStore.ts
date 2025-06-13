import { create } from 'zustand';

interface NavigationState {
  mode: 'create' | 'join' | null;
  setMode: (mode: 'create' | 'join') => void;
}

const useNavigationStore = create<NavigationState>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
}));

export default useNavigationStore;