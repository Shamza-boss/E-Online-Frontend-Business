'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box } from '@mui/material';

export default function ErrorRefClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  if (!ref) return null;

  return (
    <Box mb={2}>
      <Typography variant="body2" color="text.secondary">
        Error Reference: <code>{ref}</code>
      </Typography>
    </Box>
  );
}
