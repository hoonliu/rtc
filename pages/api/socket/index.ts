import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const GET = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket?.server?.io) {
    console.log('Socket is already attached');
    res.end();
    return;
  }

  const io = new IOServer(res.socket.server, {
    path: '/api/socket_io',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(`User Connected :${socket.id}`);

    // Triggered when a peer hits the join room button.
    socket.on('join', (roomName) => {
      console.log('on join');
      const { rooms } = io.sockets.adapter;
      const room = rooms.get(roomName);

      // room == undefined when no such room exists.
      if (room === undefined) {
        socket.join(roomName);
        console.log('emit created');
        socket.emit('created');
      } else if (room.size === 1) {
        // room.size == 1 when one person is inside the room.
        socket.join(roomName);
        console.log('emit joined');
        socket.emit('joined');
      } else {
        // when there are already two people inside the room.
        console.log('emit full');
        socket.emit('full');
      }
      console.log(rooms);
    });

    // Triggered when the person who joined the room is ready to communicate.
    socket.on('ready', (roomName) => {
      socket.broadcast.to(roomName).emit('ready'); // Informs the other peer in the room.
    });

    // Triggered when server gets an icecandidate from a peer in the room.
    socket.on(
      'ice-candidate',
      (candidate: RTCIceCandidate, roomName: string) => {
        // console.log({ candidate });
        socket.broadcast.to(roomName).emit('ice-candidate', candidate); // Sends Candidate to the other peer in the room.
      }
    );

    // Triggered when server gets an offer from a peer in the room.
    socket.on('offer', (offer, roomName) => {
      socket.broadcast.to(roomName).emit('offer', offer); // Sends Offer to the other peer in the room.
    });

    // Triggered when server gets an answer from a peer in the room.
    socket.on('answer', (answer, roomName) => {
      socket.broadcast.to(roomName).emit('answer', answer); // Sends Answer to the other peer in the room.
    });

    socket.on('leave', (roomName) => {
      socket.leave(roomName);
      socket.broadcast.to(roomName).emit('leave');
    });
  });
  res.end();
  return;
};

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default GET;
