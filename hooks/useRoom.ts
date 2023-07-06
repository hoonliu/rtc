import React, { useEffect, useRef, useState } from 'react';
import useSocket from './useSocket';
import type { ClientSocket } from './types';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
  ],
};

const useRoom = (roomName: string) => {
  const { socketRef } = useSocket();
  const [isHost, setIsHost] = useState(false);
  const streamRef = useRef<MediaStream | null>();
  const videoRef = useRef<HTMLVideoElement>();
  const rtcConnectionRef = useRef<RTCPeerConnection | null>();

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

  const handleICECandidateEvent = () => {};
  const handleTrackEvent = () => {};
  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    connection.ontrack = handleTrackEvent;
    return connection;
  };

  const handleRoomCreated = () => {
    setIsHost(true);
    getUserMedia();
  };
  const handleRoomJoined = () => {
    getUserMedia();
    socketRef.current.emit('ready', roomName);
  };
  const initiateCall = () => {
    if (isHost) {
      rtcConnectionRef.current = createPeerConnection();
      if (streamRef.current) {
        rtcConnectionRef.current.addTrack(
          streamRef.current.getTracks()[0],
          streamRef.current
        );
        rtcConnectionRef.current.addTrack(
          streamRef.current.getTracks()[1],
          streamRef.current
        );
        rtcConnectionRef.current.createOffer().then((offer) => {
          rtcConnectionRef.current?.setLocalDescription(offer),
            socketRef.current.emit('offer', offer, roomName);
        });
      } else {
        throw new Error('stream is not ready');
      }
    }
  };
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
