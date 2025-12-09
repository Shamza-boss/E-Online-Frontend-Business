import '@excalidraw/excalidraw/index.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Manrope } from 'next/font/google';
import { auth } from '@/auth';
import Providers from './providers';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: 'E-Online',
    template: '%s | E-Online',
  },
  description:
    'E-Online delivers a modern classroom experience for administrators, instructors, and learners.',
  keywords: ['education', 'online learning', 'classroom', 'LMS'],
  authors: [{ name: 'E-Online' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'E-Online',
    description: 'E-Online delivers a modern classroom experience for administrators, instructors, and learners.',
    siteName: 'E-Online',
  },
};

export const viewport: Viewport = {
  themeColor: '#1976d2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body style={{ fontFamily: manrope.style.fontFamily }}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
