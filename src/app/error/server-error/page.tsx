import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Suspense } from 'react';
import ErrorRefClient from '@/app/dashboard/_components/ErrorRefClient';
import ErrorLayout from '@/app/dashboard/_components/ErrorLayout';

export default function ServerErrorPage() {
  return (
    <ErrorLayout
      icon={<ErrorOutlineIcon fontSize="large" color="error" />}
      title="500 – Server Error"
      description="Something went wrong on our end. Please try again later."
    >
      <Suspense
        fallback={
          <Box mt={2}>
            <Typography variant="body2" color="text.disabled">
              Loading error reference...
            </Typography>
          </Box>
        }
      >
        <ErrorRefClient />
      </Suspense>
    </ErrorLayout>
  );
}
