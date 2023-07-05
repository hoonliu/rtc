import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import MainNav from '@/components/main-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Real-Time Communication',
  description: 'a real-time communication app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <MainNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
