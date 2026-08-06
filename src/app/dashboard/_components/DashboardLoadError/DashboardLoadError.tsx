'use client';

import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

type DashboardLoadErrorProps = {
  message: string;
};

export default function DashboardLoadError({ message }: DashboardLoadErrorProps) {
  const router = useRouter();

  return (
    <Box sx={{ p: 3 }}>
      <ErrorLayout
        icon={
          <Typography variant="h1" component="span">
            !
          </Typography>
        }
        title="Dashboard unavailable"
        description={message}
        actionLabel=""
        actionHref=""
        tone="error"
      >
        <Button
          variant="outlined"
          onClick={() => router.refresh()}
          sx={{ mt: 2 }}
        >
          Try again
        </Button>
      </ErrorLayout>
    </Box>
  );
}
