import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { AreaGradientProps } from './types';

export const StatCardRoot = styled(Card)({
  height: '100%',
  flexGrow: 1,
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
});

export const CardColumnStack = styled(Stack)({
  justifyContent: 'space-between',
  flexGrow: 1,
  gap: 8,
});

export const CardRowStack = styled(Stack)({
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const SparklineContainer = styled(Box)({
  width: '100%',
  height: 50,
});

export const IntervalText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const skeletonBase = (theme: any) => ({
  backgroundColor: theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius,
  animation: 'pulse 1.5s ease-in-out infinite',
});

export const SkeletonValueBox = styled(Box)(({ theme }) => ({
  ...skeletonBase(theme),
  width: '60%',
  height: 32,
}));

export const SkeletonChipBox = styled(Box)(({ theme }) => ({
  ...skeletonBase(theme),
  width: 60,
  height: 24,
  borderRadius: 12,
}));

export const SkeletonIntervalBox = styled(Box)(({ theme }) => ({
  ...skeletonBase(theme),
  width: '40%',
  height: 16,
  marginTop: theme.spacing(1),
}));

export const SkeletonChartBox = styled(Box)(({ theme }) => ({
  ...skeletonBase(theme),
  width: '100%',
  height: 50,
}));

export function AreaGradient({ color, id }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}
