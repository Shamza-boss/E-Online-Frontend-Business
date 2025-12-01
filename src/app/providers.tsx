'use client';

/**
 * Root Providers Component
 *
 * Wraps the app with all necessary providers:
 * - Session management (NextAuth)
 * - UI theming (MUI)
 * - Alert notifications
 *
 * @note Order matters - providers are nested from outermost to innermost
 */

import React, { memo, useMemo, useEffect, useRef } from 'react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SessionProvider, useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import AppTheme from './_lib/components/shared-theme/AppTheme';
import { AlertProvider } from './_lib/components/alert/AlertProvider';
import { PDF_NOTE_SENTINEL_ATTRIBUTE } from './_lib/utils/pdfNoteLinks';

// Session configuration - extracted for clarity
const SESSION_CONFIG = {
  refetchOnWindowFocus: true,
  refetchInterval: 60, // seconds
  refetchWhenOffline: false,
} as const;

// Global styles for PDF note handling
const pdfNoteStyles = {
  [`[${PDF_NOTE_SENTINEL_ATTRIBUTE}="true"]`]: {
    display: 'none !important',
    visibility: 'hidden',
    pointerEvents: 'none',
    opacity: 0,
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
} as const;

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
}

/**
 * Session invalidation handler
 *
 * Redirects to sign-in when session becomes invalid after being authenticated
 */
const SessionInvalidRedirect = memo(function SessionInvalidRedirect() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hadSessionRef = useRef(false);

  useEffect(() => {
    if (status === 'authenticated') {
      hadSessionRef.current = true;
      return;
    }

    if (status === 'unauthenticated' && hadSessionRef.current) {
      hadSessionRef.current = false;
      // Don't redirect if already on signin page
      if (!pathname || pathname.startsWith('/signin')) return;
      router.replace('/signin');
    }
  }, [pathname, router, status]);

  return null;
});

/**
 * Root providers component
 */
export default function Providers({ children, session }: ProvidersProps) {
  // Memoize config to prevent unnecessary re-renders
  const sessionConfig = useMemo(() => SESSION_CONFIG, []);

  return (
    <SessionProvider session={session} {...sessionConfig}>
      <SessionInvalidRedirect />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <GlobalStyles styles={pdfNoteStyles} />
          <AlertProvider>{children}</AlertProvider>
        </AppTheme>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
