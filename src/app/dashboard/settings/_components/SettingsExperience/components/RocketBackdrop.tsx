'use client';

import React from 'react';
import Box from '@mui/material/Box';

export default function RocketBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: { xs: '70%', md: '45%' },
          height: '55%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(79,70,229,0.12) 0%, rgba(14,165,233,0.06) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </Box>
  );
}
