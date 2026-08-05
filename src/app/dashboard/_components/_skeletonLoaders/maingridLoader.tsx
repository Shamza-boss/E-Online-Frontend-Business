'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import {
  dashboardPageRootSx,
  dashboardSectionSpacing,
  getDashboardPagePadding,
} from '@/app/_lib/layout/dashboardPageLayout';
import HeroMetricSkeleton from './primitives/HeroMetricSkeleton';
import InsightSummaryCardSkeleton from './primitives/InsightSummaryCardSkeleton';

const INSIGHT_TILE_COUNT = 6;

export default function MainGridSkeleton() {
  return (
    <Box
      sx={(theme) => ({
        ...dashboardPageRootSx,
        ...getDashboardPagePadding(theme),
        overflow: 'auto',
      })}
    >
      <Stack
        spacing={dashboardSectionSpacing}
        sx={{
          width: '100%',
          minWidth: 0,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ width: '100%', minWidth: 0, flexShrink: 0 }}>
          <Skeleton variant="text" width={260} height={36} />
          <Skeleton
            variant="text"
            width="55%"
            height={22}
            sx={{ mt: 0.75, maxWidth: 520 }}
          />
        </Box>

        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          sx={{ width: '100%', minWidth: 0, flexShrink: 0, gap: 1.5 }}
        >
          <HeroMetricSkeleton valueWidth="48%" />
          <HeroMetricSkeleton valueWidth="36%" />
        </Stack>

        <Box
          sx={(theme) => ({
            flex: 1,
            minHeight: { xs: 'auto', sm: 420 },
            minWidth: 0,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gridTemplateRows: { xs: 'none', md: '1fr 1fr' },
            gridAutoRows: { xs: 'minmax(160px, auto)', md: undefined },
            gap: theme.spacing(2),
            '& > *': {
              minWidth: 0,
              minHeight: 0,
              height: '100%',
            },
          })}
        >
          {Array.from({ length: INSIGHT_TILE_COUNT }).map((_, index) => (
            <InsightSummaryCardSkeleton key={`insight-${index}`} />
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
