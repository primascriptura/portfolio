import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Ihor Chivrich — Product Designer',
  description:
    'Product designer for fintech, SaaS, and AI startups. I design and ship — research, UX, UI, and increasingly the code itself.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
