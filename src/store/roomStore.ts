import { create } from 'zustand';

interface Room {
  id: number;
  name: string;
  userCount: number;
}

interface RoomState {
  roomName: string;
  setRoomName: (name: string) => void;

  rooms: Room[];
  setRooms: (rooms: Room[]) => void;

  teamId: number | null;
  setTeamId: (id: number) => void;
}

const useRoomStore = create<RoomState>((set) => ({
  roomName: '',
  setRoomName: (name) => set({ roomName: name }),

  rooms: [],
  setRooms: (rooms) => set({ rooms }),

  teamId: null,
  setTeamId: (id) => set({ teamId: id }),
}));

export default useRoomStore;
