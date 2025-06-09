import { create } from 'zustand';

interface RegisterState {
  name: string;
  password: string;
  showModal: boolean;
  setName: (name: string) => void;
  setPassword: (password: string) => void;
  setShowModal: (show: boolean) => void;
}

const useRegisterStore = create<RegisterState>((set) => ({
  name: '',
  password: '',
  showModal: false,
  setName: (name) => set({ name }),
  setPassword: (password) => set({ password }),
  setShowModal: (show) => set({ showModal: show }),
}));

export default useRegisterStore;
