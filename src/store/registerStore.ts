import { create } from 'zustand';

interface RegisterState {
  name: string;
  password: string;
  setName: (name: string) => void;
  setPassword: (password: string) => void;
}


const useRegisterStore = create<RegisterState>((set) => ({
  name: '',
  password: '',
  showModal: false,
  setName: (name) => set({ name }),
  setPassword: (password) => set({ password })
}));

export default useRegisterStore;
