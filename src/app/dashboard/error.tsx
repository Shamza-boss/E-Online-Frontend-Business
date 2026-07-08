'use client';

import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <Box sx={{ p: 3 }}>
      <ErrorLayout
        icon={
          <Typography variant="h1" component="span">
            !
          </Typography>
        }
        title="Something went wrong"
        description="We could not load this dashboard page. Please try again."
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
