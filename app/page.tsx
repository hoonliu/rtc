'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { nanoid } from 'nanoid';

export default function Home() {
  const [roomId, setRoomId] = useState<string>('');
  const router = useRouter();

  const joinRoom = () => router.push(`/room/${roomId || nanoid(10)}`);

  return (
    <main className='flex items-center justify-center h-screen w-screen'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Join a room</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id='roomId'
            placeholder='Enter Room ID...'
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={joinRoom}>Join</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
