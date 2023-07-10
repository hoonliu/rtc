'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { redirect, usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import MainNav from '@/components/main-nav';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Real-Time Communication',
  description: 'a real-time communication app',
};

export default async function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  // const session = useSession();
  const pathname = usePathname();

  if (!session && !pathname?.includes('auth')) {
    redirect('/auth');
  }
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {!pathname?.includes('auth') && <MainNav />}
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
