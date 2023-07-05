import React from 'react';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';

const MainNav = () => {
  return (
    <div className='w-screen h-16 flex items-center px-12 border-b'>
      <nav className='flex items-center space-x-4'>
        <Link
          className='text-sm font-medium transition-colors hover:text-primary'
          href={'/'}
        >
          Home
        </Link>
      </nav>
      <div className='ml-auto flex items-center space-x-4'>
        <ModeToggle />
      </div>
    </div>
  );
};

export default MainNav;
