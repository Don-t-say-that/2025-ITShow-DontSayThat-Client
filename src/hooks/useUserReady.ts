import { useEffect } from 'react';
import useWaitingRoomStore from '../store/waitingStore';
import useSocket from './useSocket';

interface UserReadyToggleData {
    userId: number;
    isReady: boolean;
}

const useUserReady = (userId: number, initialReadyState: boolean) => {
    const { updateUserReady } = useWaitingRoomStore();
    const socket = useSocket();

    const toggleReady = () => {
        console.log('toggleReady 호출:', { userId, initialReadyState });

        if (userId === -1) {
            console.log('userId가 -1이므로 함수 종료');
            return;
        }

        const newReadyState = !initialReadyState;
        console.log('새로운 준비 상태:', newReadyState);

        updateUserReady(userId, newReadyState);

        socket.emit('toggleReady', {    // 서버에 변경사항 전송하는 거
            userId,
            isReady: newReadyState,
        });
    };

    useEffect(() => {
        const handleUserReadyToggled = ({ userId, isReady }: UserReadyToggleData) => {
            console.log('소켓에서 userReadyToggled 수신:', { userId, isReady });
            updateUserReady(userId, isReady);
        };

        socket.on('userReadyToggled', handleUserReadyToggled);

        return () => {
            socket.off('userReadyToggled', handleUserReadyToggled);
        };
    }, [socket, updateUserReady]);

    return { toggleReady };
};

export default useUserReady;