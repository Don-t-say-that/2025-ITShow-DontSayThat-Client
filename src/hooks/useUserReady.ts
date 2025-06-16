import { useCallback } from 'react';
import useWaitingRoomStore from '../store/waitingStore';
import useSocket from './useSocket';
import useRoomStore from '../store/roomStore';

// 사용자 타입 정의
type WaitingRoomUser = {
  id: number;
  name: string;
  character: string;
  characterId: number;
  isLeader: boolean;
  isReady: boolean;
};

const useUserReady = (userId: number | null | undefined) => {
    // 타입을 명시적으로 지정
    const { users, setUsers } = useWaitingRoomStore() as {
        users: WaitingRoomUser[];
        setUsers: (users: WaitingRoomUser[] | ((prevUsers: WaitingRoomUser[]) => WaitingRoomUser[])) => void;
    };
    const socket = useSocket();
    const teamId = useRoomStore((state) => state.teamId);

    const toggleReady = useCallback(async () => {
        console.log('🎯 toggleReady 호출 시작');
        console.log('- userId:', userId);
        console.log('- teamId:', teamId);
        console.log('- socket 존재:', !!socket);

        // 유효성 검사
        if (!userId || userId <= 0) {
            console.log('⚠️ 유효하지 않은 userId:', userId);
            return Promise.reject(new Error('Invalid userId'));
        }

        if (!socket) {
            console.log('⚠️ 소켓이 없어서 함수 종료');
            return Promise.reject(new Error('Socket not available'));
        }

        if (!teamId) {
            console.log('⚠️ teamId가 없어서 함수 종료');
            return Promise.reject(new Error('TeamId not available'));
        }

        // 소켓 연결 상태 확인
        if (!socket.connected) {
            console.log('⚠️ 소켓이 연결되어 있지 않음');
            return Promise.reject(new Error('Socket not connected'));
        }

        // 현재 사용자의 ready 상태를 직접 찾기
        const currentUser = users.find(user => user.id === Number(userId));
        
        if (!currentUser) {
            console.log('⚠️ 현재 사용자를 찾을 수 없음:', userId);
            console.log('- 전체 사용자 목록:', users);
            return Promise.reject(new Error('Current user not found'));
        }

        const currentReadyState = currentUser.isReady ?? false;
        const newReadyState = !currentReadyState;
        
        console.log('- 현재 사용자:', currentUser);
        console.log('- 현재 준비 상태:', currentReadyState);
        console.log('- 새로운 준비 상태:', newReadyState);

        return new Promise<void>((resolve, reject) => {
            try {
                console.log('📡 서버에 toggleReady 이벤트 전송 시작');
                
                // 🔥 즉시 로컬 상태 업데이트 (Optimistic Update)
                // 서버 응답을 기다리지 않고 바로 UI를 업데이트하여 반응성 개선
                setUsers((prevUsers: WaitingRoomUser[]) => {
                    const updatedUsers = prevUsers.map(user =>
                        user.id === Number(userId)
                            ? { ...user, isReady: newReadyState }
                            : user
                    );
                    console.log('🔄 로컬 상태 즉시 업데이트:', updatedUsers);
                    return updatedUsers;
                });

                // 서버에 이벤트 전송
                socket.emit('toggleReady', {
                    teamId,
                    userId: Number(userId),
                    isReady: newReadyState,
                });

                console.log('📡 서버에 toggleReady 이벤트 전송 완료');
                console.log('✅ toggleReady 함수 완료');
                resolve();
                
            } catch (error) {
                console.error('❌ toggleReady 이벤트 전송 중 에러:', error);
                
                // 에러 발생 시 상태 롤백
                setUsers((prevUsers: WaitingRoomUser[]) => {
                    const rolledBackUsers = prevUsers.map(user =>
                        user.id === Number(userId)
                            ? { ...user, isReady: currentReadyState }
                            : user
                    );
                    console.log('🔄 에러로 인한 상태 롤백:', rolledBackUsers);
                    return rolledBackUsers;
                });
                
                reject(error);
            }
        });
    }, [userId, teamId, socket, users, setUsers]);

    return { toggleReady };
};

export default useUserReady;