import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className='flex items-center justify-center h-screen w-screen'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Join a room</CardTitle>
        </CardHeader>
        <CardContent>
          <Input id='roomId' placeholder='Enter Room ID...' />
        </CardContent>
        <CardFooter>
          <Button>Join</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
