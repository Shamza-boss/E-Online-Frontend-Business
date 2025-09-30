import React from 'react';
import { Box, Skeleton } from '@mui/material';

const TextFragmentLoader = () => {
  return (
    <Box sx={{ p: 2, width: '100%' }}>
      {/* Title-like text */}
      <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2, width: '70%' }} />

      {/* Paragraph blocks */}
      {[...Array(3)].map((_, idx) => (
        <Box key={idx} sx={{ mb: 3 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
        </Box>
      ))}

      {/* Short paragraph */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
      </Box>

      {/* List-like structure */}
      <Box sx={{ pl: 2, mb: 3 }}>
        {[...Array(3)].map((_, idx) => (
          <Box
            key={`list-${idx}`}
            sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
          >
            <Skeleton variant="circular" width={6} height={6} sx={{ mr: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TextFragmentLoader;
