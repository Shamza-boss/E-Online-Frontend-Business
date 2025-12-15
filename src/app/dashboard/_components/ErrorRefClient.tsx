'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useState, useCallback } from 'react';

export default function ErrorRefClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (ref) {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [ref]);

  if (!ref) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        mb: 2,
        p: 1.5,
        bgcolor: 'action.hover',
        borderRadius: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Reference:
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 600,
          bgcolor: 'background.paper',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
        }}
      >
        {ref}
      </Typography>
      <Tooltip title={copied ? 'Copied!' : 'Copy reference'}>
        <IconButton size="small" onClick={handleCopy}>
          {copied ? (
            <CheckIcon fontSize="small" color="success" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
