import { create } from 'zustand';

interface RoomState {
  roomName: string;
  setRoomName: (name: string) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  roomName: '',
  setRoomName: (name) => set({ roomName: name }),
}));

export default useRoomStore;
