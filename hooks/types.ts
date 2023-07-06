import type { Socket } from 'socket.io-client';

export type ClientSocketEvents =
  | 'join'
  | 'created'
  | 'joined'
  | 'ready'
  | 'leave'
  | 'full'
  | 'offer'
  | 'answer'
  | 'ice-candidate';
export type ClientSocketEventsMap = {
  [event in ClientSocketEvents]: (...args: any[]) => void;
};
export type ClientSocket = Socket<ClientSocketEventsMap>;
