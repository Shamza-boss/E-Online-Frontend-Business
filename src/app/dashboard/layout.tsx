'use client';

/**
 * Dashboard Layout
 *
 * Shell + auth-notice handling. Heavy providers (MathJax, date pickers)
 * live on the routes/components that need them.
 */

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import DashboardComponent from './_components/Dashboard';
import { AUTH_NOTICE_QUERY_KEY } from '@/app/_lib/utils/alreadySignedInNotice';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { useAuthHeartbeat } from '@/app/_lib/hooks/useAuthHeartbeat';

const layoutStyles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
  },
} as const;

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const noticeParam = searchParams.get(AUTH_NOTICE_QUERY_KEY);
  const searchParamString = searchParams.toString();
  useAuthHeartbeat();

  useEffect(() => {
    if (!noticeParam) return;
    showAlert({ type: 'info', message: noticeParam });
    const params = new URLSearchParams(searchParamString);
    params.delete(AUTH_NOTICE_QUERY_KEY);
    const query = params.toString();
    const target = (query ? `${pathname}?${query}` : pathname || '/dashboard') as Route;
    router.replace(target, { scroll: false });
  }, [noticeParam, pathname, router, searchParamString, showAlert]);

  return (
    <DashboardComponent>
      <Box sx={layoutStyles.container}>
        <Box sx={layoutStyles.content}>{children}</Box>
      </Box>
    </DashboardComponent>
  );
}
