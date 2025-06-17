import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  backgroundImage: string;
  setBackgroundImage: (bg: string) => void;
}

const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomName: "",
      setRoomName: (name) => set({ roomName: name }),

      rooms: [],
      setRooms: (rooms) => set({ rooms }),

      teamId: null,
      setTeamId: (id) => set({ teamId: id }),

      backgroundImage: "",
      setBackgroundImage: (bg) => set({ backgroundImage: bg }),
    }),
    {
      name: "room-storage", // localStorage에 저장될 키 이름
    }
  )
);

export default useRoomStore;
