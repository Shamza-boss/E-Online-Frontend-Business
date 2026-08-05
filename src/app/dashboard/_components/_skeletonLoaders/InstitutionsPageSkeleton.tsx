'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import DataGridSkeleton from './primitives/DataGridSkeleton';

export default function InstitutionsPageSkeleton() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 3,
      }}
    >
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={150} height={36} />
        </Stack>
      </Box>

      <Box sx={{ flex: '1 1 0%', display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <OutlinedWrapper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <DataGridSkeleton
            rows={10}
            columns={[22, 20, 18, 16, 14, 10]}
            showToolbar
            minHeight={520}
          />
        </OutlinedWrapper>
      </Box>
    </Box>
  );
}
