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
    default: 'AO Launchpad',
    template: '%s | AO Launchpad',
  },
  description:
    'AO Launchpad is a private internal Learning Management System by Absolute Online. Empower your organization to train employees with your own proprietary content.',
  keywords: ['private internal training', 'LMS', 'employee training', 'enterprise learning', 'Absolute Online', 'workforce development'],
  authors: [{ name: 'Absolute Online' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/absolute-rocket.webp',
    shortcut: '/assets/absolute-rocket.webp',
    apple: '/assets/absolute-rocket.webp',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'AO Launchpad',
    description: 'AO Launchpad is a private internal Learning Management System by Absolute Online. Empower your organization to train employees with your own proprietary content.',
    siteName: 'AO Launchpad',
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

  const antiAssistAttrs = {
    'data-gramm': 'false',
    'data-gramm_editor': 'false',
    'data-enable-grammarly': 'false',
    'data-grammarly': 'false',
    'data-lt-active': 'false',
  } as const;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={manrope.variable}
      {...antiAssistAttrs}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body suppressHydrationWarning style={{ fontFamily: manrope.style.fontFamily }} {...antiAssistAttrs}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
