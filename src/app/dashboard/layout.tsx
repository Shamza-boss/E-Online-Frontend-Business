'use client';

/**
 * Dashboard Layout
 *
 * Provides the main dashboard shell with:
 * - Navigation sidebar
 * - MathJax for mathematical expressions
 * - Date picker localization
 */

import { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MathJaxContext } from 'better-react-mathjax';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DashboardComponent from './_components/Dashboard';
import { AUTH_NOTICE_QUERY_KEY } from '@/app/_lib/utils/alreadySignedInNotice';

// MathJax configuration for LaTeX-style math rendering
const MATHJAX_CONFIG = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  loader: { load: ['input/tex', 'output/chtml'] },
} as const;

// Layout styles - extracted for maintainability
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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const noticeParam = searchParams.get(AUTH_NOTICE_QUERY_KEY);
  const searchParamString = searchParams.toString();

  useEffect(() => {
    if (!noticeParam) return;
    setAuthNotice(noticeParam);
    const params = new URLSearchParams(searchParamString);
    params.delete(AUTH_NOTICE_QUERY_KEY);
    const query = params.toString();
    const target = query ? `${pathname}?${query}` : pathname || '/dashboard';
    router.replace(target, { scroll: false });
  }, [noticeParam, pathname, router, searchParamString]);

  const handleDismissNotice = useCallback(() => setAuthNotice(null), []);

  return (
    <DashboardComponent
      noticeMessage={authNotice}
      onDismissNotice={handleDismissNotice}
    >
      <MathJaxContext version={3} config={MATHJAX_CONFIG}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={layoutStyles.container}>
            <Box sx={layoutStyles.content}>{children}</Box>
          </Box>
        </LocalizationProvider>
      </MathJaxContext>
    </DashboardComponent>
  );
}
