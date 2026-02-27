import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WeatherApp — PM Accelerator',
  description: 'Full Stack Weather Application — AI Engineer Intern Technical Assessment by Ekamnoor Singh Pannu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col transition-colors duration-300`}>
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
