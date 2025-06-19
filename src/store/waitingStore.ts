
import { create } from 'zustand';

type WaitingRoomUser = {
  id: number;
  name: string;
  character: string;
  characterId: number;
  isLeader: boolean;
  isReady: boolean;
};


interface WaitingRoomState {
  users: WaitingRoomUser[];
  setUsers: (users: WaitingRoomUser[]) => void;
  updateUserReady: (userId: number, isReady: boolean) => void;
}

const useWaitingRoomStore = create<WaitingRoomState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  updateUserReady: (userId, isReady) => set((state) => {
    const updatedUsers = state.users.map(user =>
      user.id === userId ? { ...user, isReady } : user
    );
    return { users: updatedUsers };
  }),
}));

export default useWaitingRoomStore;
