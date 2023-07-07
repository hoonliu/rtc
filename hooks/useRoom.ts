'use client';
import { useEffect, useRef, useState } from 'react';
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
  // const [isHost, setIsHost] = useState(false);
  const hostRef = useRef<boolean>(false);
  const streamRef = useRef<MediaStream | null>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);

  const rtcConnectionRef = useRef<RTCPeerConnection | null>();

  const joinRoom = () => {
    socketRef.current.emit('join', roomName);
  };

  const getUserMedia = async () => {
    console.log('getting stream...');
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 500,
        height: 500,
      },
    });
    console.log('setting stream to video ref and stream ref...');
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
      console.log('video object setup complete');
    } else {
      throw new Error('The video element is not ready');
    }
  };

  const handleICECandidateEvent: RTCPeerConnection['onicecandidate'] = (
    event
  ) => {
    // console.log('handleICECandidateEvent', { event });
    if (event.candidate) {
      socketRef.current.emit('ice-candidate', event.candidate, roomName);
    }
  };
  const handleTrackEvent: RTCPeerConnection['ontrack'] = (event) => {
    // console.log('handleTrackEvent', { event });
    if (peerVideoRef.current) peerVideoRef.current.srcObject = event.streams[0];
  };
  const createPeerConnection = () => {
    console.log('creating peer connection...');
    try {
      const connection = new RTCPeerConnection(ICE_SERVERS);
      connection.onicecandidate = handleICECandidateEvent;
      connection.ontrack = handleTrackEvent;
      console.log('create peer connection successfully!');
      return connection;
    } catch (error) {
      console.log('create peer connection failed', error);
    }
  };

  const handleRoomCreated = async () => {
    console.log('room created. getting user media...');
    hostRef.current = true;
    await getUserMedia();
  };
  const handleRoomJoined = async () => {
    console.log('room joined. getting user media...');
    await getUserMedia();
    console.log('emitting ready event...', { roomName });
    socketRef.current.emit('ready', roomName);
    console.log('emit ready event successfully');
  };
  const initiateCall = () => {
    console.log({ host: hostRef.current }, 'initiating call');
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      if (streamRef.current && rtcConnectionRef.current) {
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
        throw new Error('stream or rtc connection is not ready');
      }
    }
  };
  const onPeerLeave = () => {};
  const handleRoomFull = () => {};

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    console.log({ host: hostRef.current }, 'handling offer');
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection();
      if (streamRef.current && rtcConnectionRef.current) {
        rtcConnectionRef.current.addTrack(
          streamRef.current.getTracks()[0],
          streamRef.current
        );
        rtcConnectionRef.current.addTrack(
          streamRef.current.getTracks()[1],
          streamRef.current
        );
      } else {
        throw new Error('stream or rtc connection is not ready');
      }
      rtcConnectionRef.current.setRemoteDescription(offer);

      rtcConnectionRef.current.createAnswer().then((answer) => {
        rtcConnectionRef.current?.setLocalDescription(answer);
        socketRef.current.emit('answer', answer, roomName);
      });
    }
  };
  const handleAnswer = (answer: RTCSessionDescriptionInit) => {
    rtcConnectionRef.current?.setRemoteDescription(answer);
  };
  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    const candidate = new RTCIceCandidate(incoming);
    rtcConnectionRef.current
      ?.addIceCandidate(candidate)
      .catch((e) => console.log(e));
  };

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
    peerVideoRef,
    streamRef,
  };
};

export default useRoom;
