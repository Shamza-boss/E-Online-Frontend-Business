'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import {
  LibraryRoot,
  LibraryHeaderSection,
  LibraryContentSection,
  LibraryCardsScrollArea,
  LibraryPaginationBar,
} from '@/app/dashboard/library/_components/LibraryView/elements';
import {
  StyledCard,
  StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';

function LibraryCardSkeletonItem() {
  return (
    <StyledCard variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderBottom: 1,
          borderColor: 'divider',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
        <Skeleton
          variant="circular"
          width={56}
          height={56}
          sx={{ position: 'absolute' }}
          animation="wave"
        />
      </Box>
      <StyledCardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Skeleton variant="rounded" width={72} height={22} sx={{ borderRadius: 12 }} />
          <Skeleton variant="rounded" width={56} height={22} sx={{ borderRadius: 12 }} />
        </Stack>
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="55%" height={18} sx={{ mt: 0.5 }} />
        <Skeleton variant="text" width="40%" height={18} />
        <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2, borderRadius: 2 }} />
      </StyledCardContent>
    </StyledCard>
  );
}

export default function LibraryPageSkeleton() {
  return (
    <LibraryRoot>
      <LibraryHeaderSection>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={180} height={40} />
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="rounded" width={130} height={36} />
          </Stack>
        </Stack>

        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2, maxWidth: 640 }} />
        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={56} height={24} sx={{ borderRadius: 12 }} />
            <Skeleton variant="text" width={120} height={16} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="rounded" width={56} height={24} sx={{ borderRadius: 12 }} />
            <Skeleton variant="text" width={120} height={16} />
          </Stack>
        </Stack>
      </LibraryHeaderSection>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ mb: 3 }}
      >
        <Skeleton variant="rounded" height={40} sx={{ flex: 1 }} />
        <Skeleton variant="rounded" width={180} height={40} />
        <Skeleton variant="rounded" width={40} height={40} />
        <Skeleton variant="rounded" width={88} height={36} />
      </Stack>

      <LibraryContentSection>
        <LibraryCardsScrollArea>
          <Grid container spacing={2} columns={12}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <LibraryCardSkeletonItem />
              </Grid>
            ))}
          </Grid>
        </LibraryCardsScrollArea>

        <LibraryPaginationBar>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Skeleton variant="rounded" width={180} height={32} />
            <Skeleton variant="rounded" width={280} height={32} />
            <Skeleton variant="text" width={100} height={16} />
          </Stack>
        </LibraryPaginationBar>
      </LibraryContentSection>
    </LibraryRoot>
  );
}
