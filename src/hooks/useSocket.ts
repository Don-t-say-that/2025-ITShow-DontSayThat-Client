import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const useSocket = () => {
    useEffect(() => {
        return () => {
            socket.off('userReadyToggled');
        };
    }, []);

    return socket;
};

export default useSocket;
