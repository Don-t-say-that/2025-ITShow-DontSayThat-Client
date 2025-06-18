import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BASE_URL}`, {
  withCredentials: true,
});

const useSocket = () => {
    useEffect(() => {
        return () => {
            socket.off('userReadyToggled');
        };
    }, []);

    return socket;
};

export default useSocket;
