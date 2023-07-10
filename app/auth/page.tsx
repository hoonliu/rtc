import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { AuthForm } from './components/auth-form';

const Login = () => {
  return (
    <div className='grid grid-cols-2 h-screen px-0'>
      <div className='p-8'>
        <div className='flex flex-col space-y-6 justify-center items-center h-full w-full sm:w-[350px] mx-auto'>
          <AuthForm />
        </div>
      </div>
      <div className='bg-black' />
    </div>
  );
};

export default Login;
