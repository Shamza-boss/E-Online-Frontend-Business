import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { auth } from '@/auth';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'E-Online',
    template: '%s | E-Online',
  },
  description:
    'E-Online delivers a modern classroom experience for administrators, instructors, and learners.',
};

export const viewport: Viewport = {
  themeColor: '#1976d2',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
