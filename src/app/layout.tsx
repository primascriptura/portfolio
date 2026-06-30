import type { Metadata } from 'next';
import { Libre_Baskerville, Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Dock } from '@/design-system/components';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
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
      <body className={`${libreBaskerville.variable} ${inter.variable}`}>
        <Providers>
          {children}
          <Dock />
        </Providers>
      </body>
    </html>
  );
}
