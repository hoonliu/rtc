import React, { useEffect, useRef } from 'react';
import useSocket from './useSocket';
import type { ClientSocket } from './types';

const useRoom = (roomName: string) => {
  const { socketRef } = useSocket();
  const streamRef = useRef<MediaStream | null>();
  const videoRef = useRef<HTMLVideoElement>();

  const joinRoom = () => {
    socketRef.current.emit('join', roomName);
  };

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 500,
        height: 500,
      },
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play;
      };
    } else {
      throw new Error('The video element is not ready');
    }
  };

  const handleRoomCreated = () => {
    getUserMedia();
  };
  const handleRoomJoined = () => {
    getUserMedia();
    socketRef.current.emit('ready', roomName);
  };
  const initiateCall = () => {};
  const onPeerLeave = () => {};
  const handleRoomFull = () => {};

  const handleReceivedOffer = () => {};
  const handleAnswer = () => {};
  const handlerNewIceCandidateMsg = () => {};

  const bindSocketEvent = (socket: ClientSocket) => {
    socket.on('created', handleRoomCreated);
    socket.on('joined', handleRoomJoined);
    socket.on('ready', initiateCall);
    socket.on('leave', onPeerLeave);
    socket.on('full', handleRoomFull);

    // WebRTC
    socket.on('offer', handleReceivedOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handlerNewIceCandidateMsg);
  };

  useEffect(() => {
    const socket = socketRef.current;
    bindSocketEvent(socket);
    joinRoom();
  }, []);

  return {
    videoRef,
    streamRef,
  };
};

export default useRoom;
