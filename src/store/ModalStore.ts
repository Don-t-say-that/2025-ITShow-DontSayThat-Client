import { create } from 'zustand';

interface ModalState {
  showModal: boolean;
  setShowModal: (show: boolean) => void;

  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
}

const useModalStore = create<ModalState>((set) => ({
  showModal: false,
  setShowModal: (show) => set({ showModal: show }),

  showSuccessModal: false,
  setShowSuccessModal: (show) => set({ showSuccessModal: show }),
}));

export default useModalStore;
