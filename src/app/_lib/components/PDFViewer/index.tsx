'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import type { ComponentProps } from 'react';

const PDFViewerLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="100%"
    height="400px"
    sx={{ backgroundColor: 'background.paper' }}
  >
    <CircularProgress size="2rem" />
  </Box>
);

const PDFViewerComponent = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => <PDFViewerLoader />,
});

export type { PdfNoteLinkOptions, PdfNoteLinkSummary, PdfNoteLinkRequest } from './types';

export default function PDFViewerLazy(
  props: ComponentProps<typeof PDFViewerComponent>,
) {
  return <PDFViewerComponent {...props} />;
}
