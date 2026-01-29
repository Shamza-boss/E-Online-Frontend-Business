import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export default function AOLaunchpadLogo(
  props: React.ComponentProps<typeof Box>
) {
  return (
    <Box display="flex" alignItems="center" mr={2} gap={1} {...props}>
      <Image
        src="/assets/absolute-rocket.webp"
        alt="AO Launchpad"
        width={28}
        height={28}
        style={{ objectFit: 'contain' }}
      />
      <Typography
        variant="subtitle1"
        component="span"
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700, 
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          fontSize: '1.05rem',
        }}
      >
        AO Launchpad
      </Typography>
    </Box>
  );
}
