import { create } from 'zustand';

interface WaitingRoomUser {
    id: number;
    name: string;
    character?: string;
    isLeader: boolean;
    isReady: boolean;
}

interface WaitingRoomState {
    users: WaitingRoomUser[];
    setUsers: (users: WaitingRoomUser[]) => void;
    updateUserReady: (userId: number, isReady: boolean) => void;
}

const useWaitingRoomStore = create<WaitingRoomState>((set) => ({
    users: [],

    setUsers: (users) => set({ users }),

    updateUserReady: (userId, isReady) => set((state) => {
        console.log('updateUserReady 호출 전 users:', state.users);
        const updatedUsers = state.users.map(user =>
            user.id === userId ? { ...user, isReady } : user
        );
        console.log('updateUserReady 호출 후 users:', updatedUsers);
        return { users: updatedUsers };
    }),
}));

export default useWaitingRoomStore;