'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface TabBarSkeletonProps {
  tabs?: number;
  showIcons?: boolean;
}

export default function TabBarSkeleton({ tabs = 2, showIcons = true }: TabBarSkeletonProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 0.5 }}>
      <Stack direction="row" spacing={3} sx={{ px: 1 }}>
        {Array.from({ length: tabs }).map((_, index) => (
          <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
            {showIcons ? <Skeleton variant="circular" width={20} height={20} /> : null}
            <Skeleton variant="text" width={index === 0 ? 100 : 88} height={24} />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
