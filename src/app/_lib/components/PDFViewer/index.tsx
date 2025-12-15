'use client';

import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';

const PDFViewerComponent = lazy(() => import('./PDFViewer'));

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

export default function PDFViewerLazy(props: React.ComponentProps<typeof PDFViewerComponent>) {
    return (
        <Suspense fallback={<PDFViewerLoader />}>
            <PDFViewerComponent {...props} />
        </Suspense>
    );
}
