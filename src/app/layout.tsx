'use client';
import AppTheme from './_lib/components/shared-theme/AppTheme';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider } from 'next-auth/react';
import { AlertProvider } from './_lib/components/alert/AlertProvider';
import React from 'react';
import IdleSessionManager from './_lib/components/session/IdleSessionManager';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body>
          <SessionProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <AppTheme>
                <CssBaseline enableColorScheme />
                <IdleSessionManager />
                <AlertProvider>{children}</AlertProvider>
              </AppTheme>
            </AppRouterCacheProvider>
          </SessionProvider>
        </body>
      </html>
    </>
  );
}

//toolpad provider

{
  /* <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <React.Suspense fallback={<LinearProgress />}>
        <NextAppProvider navigation={NAVIGATION} branding={BRANDING}>
            {children}
        </NextAppProvider>
    </React.Suspense>
</AppRouterCacheProvider> */
}
