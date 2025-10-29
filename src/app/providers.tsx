'use client';

import React from 'react';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import AppTheme from './_lib/components/shared-theme/AppTheme';
import { AlertProvider } from './_lib/components/alert/AlertProvider';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AlertProvider>{children}</AlertProvider>
        </AppTheme>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
