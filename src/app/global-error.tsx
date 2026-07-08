'use client';

import { Box, Button, Typography } from '@mui/material';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1">
            Application error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            An unexpected error occurred. Please try again.
          </Typography>
          <Button variant="contained" onClick={reset}>
            Try again
          </Button>
        </Box>
      </body>
    </html>
  );
}
