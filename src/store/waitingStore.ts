import { create } from 'zustand';

type WaitingRoomUser = {
  id: number;
  name: string;
  character: string;
  characterId: number;
  isLeader: boolean;
};


interface WaitingRoomState {
  users: WaitingRoomUser[];
  setUsers: (users: WaitingRoomUser[] | ((prevUsers: WaitingRoomUser[]) => WaitingRoomUser[])) => void;
}

const useWaitingRoomStore = create<WaitingRoomState>((set) => ({
  users: [],
  setUsers: (users) => set((state) => ({
    users: typeof users === 'function' ? users(state.users) : users
  })),
}));

export default useWaitingRoomStore;