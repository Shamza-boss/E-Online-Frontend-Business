'use client';

import { Suspense, lazy } from 'react';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import type { EditorProps } from './Editor';

const EditorComponent = lazy(() => import('./Editor'));

const EditorLoader = () => (
    <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} />
    </Box>
);

export default function TipTapEditorLazy(props: EditorProps) {
    return (
        <Suspense fallback={<EditorLoader />}>
            <EditorComponent {...props} />
        </Suspense>
    );
}
