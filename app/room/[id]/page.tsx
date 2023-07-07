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
  const { mediaRef, peerMediaRef } = useRoom(params.id);
  return (
    <div>
      <audio autoPlay ref={mediaRef} muted />
      <audio autoPlay ref={peerMediaRef} />
    </div>
  );
};

export default Room;
