import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';
import NavBar from '@/components/NavBar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rubbish - Sistem Pelaporan & Pengelolaan Sampah',
  description: 'Aplikasi pelaporan sampah dan penukaran reward berbasis poin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <ToastProvider />
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
