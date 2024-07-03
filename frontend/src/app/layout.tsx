import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const font = Poppins({ weight: ['400'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Board',
  description: 'Interactive collaboration board with chat, based on websockets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pl'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
