'use client';

import React, { memo, useMemo } from 'react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { SessionProviderProps } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import AppTheme from './_lib/components/shared-theme/AppTheme';
import { AlertProvider } from './_lib/components/alert/AlertProvider';
import { PDF_NOTE_SENTINEL_ATTRIBUTE } from './_lib/utils/pdfNoteLinks';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  const sessionConfig = useMemo<
    Pick<
      SessionProviderProps,
      'refetchOnWindowFocus' | 'refetchInterval' | 'refetchWhenOffline'
    >
  >(
    () => ({
      refetchOnWindowFocus: true,
      refetchInterval: 60,
      refetchWhenOffline: false,
    }),
    []
  );

  return (
    <SessionProvider session={session} {...sessionConfig}>
      <SessionInvalidRedirect />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <GlobalStyles
            styles={{
              [`[${PDF_NOTE_SENTINEL_ATTRIBUTE}="true"]`]: {
                display: 'none !important',
                visibility: 'hidden',
                pointerEvents: 'none',
                opacity: 0,
                width: 0,
                height: 0,
                overflow: 'hidden',
              },
            }}
          />
          <AlertProvider>{children}</AlertProvider>
        </AppTheme>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}

const SessionInvalidRedirect = memo(function SessionInvalidRedirect() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hadSessionRef = React.useRef(false);

  React.useEffect(() => {
    if (status === 'authenticated') {
      hadSessionRef.current = true;
      return;
    }

    if (status === 'unauthenticated' && hadSessionRef.current) {
      hadSessionRef.current = false;
      if (!pathname || pathname.startsWith('/signin')) return;
      router.replace('/signin');
    }
  }, [pathname, router, status]);

  return null;
});
