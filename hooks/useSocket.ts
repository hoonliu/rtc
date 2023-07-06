import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ClientSocket } from './types';

const socketInitializer = async () => {
  await fetch('/api/socket');
};

const useSocket = () => {
  const socketCreated = useRef(false);
  const socketRef = useRef<ClientSocket>(io());

  const initializeSocket = () => {
    if (!socketCreated.current) {
      try {
        socketInitializer();
        socketCreated.current = true;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    initializeSocket();
    const socket = socketRef.current;
    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socketRef,
  };
};

export default useSocket;
