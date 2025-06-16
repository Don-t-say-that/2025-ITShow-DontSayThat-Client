// 사용자 타입 정의
type WaitingRoomUser = {
  id: number;
  name: string;
  character: string; // character를 string | undefined로 수정
  characterId: number;
  isLeader: boolean;
  isReady: boolean;
};

// 상태 관리 코드
import { create } from 'zustand';

interface WaitingRoomState {
  users: WaitingRoomUser[];
  setUsers: (users: WaitingRoomUser[]) => void;
  updateUserReady: (userId: number, isReady: boolean) => void;
}

const useWaitingRoomStore = create<WaitingRoomState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }), // setUsers 함수에서 타입을 정확히 맞춰줍니다.
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
