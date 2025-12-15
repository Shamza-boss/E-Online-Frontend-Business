import { Suspense } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ErrorRefClient from '@/app/dashboard/_components/ErrorRefClient';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

export default function ServerErrorPage() {
  return (
    <ErrorLayout
      icon={<ErrorOutlineIcon sx={{ fontSize: 80 }} />}
      title="Something Went Wrong"
      description="We encountered an unexpected error while processing your request. Our team has been notified and is working to fix it."
      actionLabel="Back to Dashboard"
      actionHref="/dashboard"
    >
      <Stack spacing={2} alignItems="center">
        <Suspense
          fallback={
            <Box mt={2}>
              <Typography variant="body2" color="text.disabled">
                Loading error details...
              </Typography>
            </Box>
          }
        >
          <ErrorRefClient />
        </Suspense>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Chip
            label="Server Error"
            size="small"
            color="error"
            variant="outlined"
          />
          <Chip
            label="ERR_5001"
            size="small"
            variant="outlined"
            sx={{ fontFamily: 'monospace' }}
          />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ maxWidth: 400, textAlign: 'center' }}
        >
          If this problem persists, please contact support with the reference
          code shown above.
        </Typography>
      </Stack>
    </ErrorLayout>
  );
}
