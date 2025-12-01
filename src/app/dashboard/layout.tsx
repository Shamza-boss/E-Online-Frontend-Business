'use client';

/**
 * Dashboard Layout
 *
 * Provides the main dashboard shell with:
 * - Navigation sidebar
 * - MathJax for mathematical expressions
 * - Date picker localization
 */

import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MathJaxContext } from 'better-react-mathjax';
import DashboardComponent from './_components/Dashboard';

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
  return (
    <DashboardComponent>
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
