'use client';

import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

type SegmentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
};

export default function SegmentError({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We could not load this page. Please try again.',
}: SegmentErrorProps) {
  useEffect(() => {
    console.error('[Segment Error]', error);
  }, [error]);

  return (
    <Box sx={{ p: 3 }}>
      <ErrorLayout
        icon={
          <Typography variant="h1" component="span">
            !
          </Typography>
        }
        title={title}
        description={description}
        actionLabel=""
        actionHref=""
        tone="error"
      >
        <Button variant="outlined" onClick={reset} sx={{ mt: 2 }}>
          Try again
        </Button>
      </ErrorLayout>
    </Box>
  );
}
