import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ChartCard = styled(Card)({
  width: '100%',
});

export const ChartCardLoading = styled(Card)({
  width: '100%',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
});

export const HeaderStack = styled(Stack)({
  justifyContent: 'space-between',
});

export const ChipRow = styled(Stack)({
  alignItems: 'center',
  gap: 8,
});

export const CaptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const skeletonBase = (theme: any) => ({
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius,
  animation: 'pulse 1.5s ease-in-out infinite',
});

export const SkeletonTotalBox = styled(Box)(({ theme }) => ({
  ...skeletonBase(theme),
  width: 80,
  height: 32,
}));

export const SkeletonChipBox = styled(Stack)(({ theme }) => ({
  ...skeletonBase(theme),
  width: 100,
  height: 24,
  borderRadius: 12,
}));

export const SkeletonDescriptionBox = styled(Stack)(({ theme }) => ({
  ...skeletonBase(theme),
  width: '60%',
  height: 16,
  marginTop: theme.spacing(1),
}));

export const SkeletonChartArea = styled(Stack)(({ theme }) => ({
  ...skeletonBase(theme),
  width: '100%',
  height: 250,
  marginTop: theme.spacing(2),
}));
