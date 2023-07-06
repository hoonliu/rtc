'use client';
import useRoom from '@/hooks/useRoom';
import React from 'react';

const Room = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { videoRef, peerVideoRef, streamRef } = useRoom(params.id);
  return (
    <div>
      <video autoPlay ref={videoRef} />
      <video autoPlay ref={peerVideoRef} />
    </div>
  );
};

export default Room;
