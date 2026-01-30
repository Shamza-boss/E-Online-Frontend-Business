import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {
  StyledCard,
  StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';

interface StudentClassCardSkeletonProps {
  count?: number;
}

export default function StudentClassCardSkeleton({
  count = 4,
}: StudentClassCardSkeletonProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {[...Array(count)].map((_, idx) => (
        <Box key={idx} sx={{ width: '100%' }}>
          <StyledCard variant="outlined" tabIndex={-1} sx={{ borderRadius: 3 }}>
            {/* Image area - glass skeleton effect matching the gradient header */}
            <Box
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Skeleton
                variant="rectangular"
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                animation="wave"
              />
              {/* Floating icon skeleton */}
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                }}
                animation="wave"
              />
            </Box>

            {/* Content area - matching ClassCard structure */}
            <StyledCardContent sx={{ padding: 2 }}>
              {/* Academic level caption */}
              <Skeleton variant="text" width="30%" height={18} />

              {/* Class name (h6) */}
              <Skeleton variant="text" width="70%" height={28} sx={{ mt: 0.5 }} />

              {/* Description text (2 lines) */}
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="85%" height={20} />
            </StyledCardContent>

            {/* Footer area - avatar, teacher name, subject */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={60} height={18} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width={60} height={18} />
              </Box>
            </Box>
          </StyledCard>
        </Box>
      ))}
    </Box>
  );
}
