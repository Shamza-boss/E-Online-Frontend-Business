import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

export const PageHeader = styled(Box)({
  width: '100%',
  minWidth: 0,
  flexShrink: 0,
});

export const HeroStrip = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  width: '100%',
  minWidth: 0,
  flexShrink: 0,
}));

export const HeroMetric = styled(Paper)(({ theme }) => ({
  flex: '1 1 140px',
  minWidth: 0,
  padding: theme.spacing(1.75, 2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(160deg, rgba(255,255,255,0.04), transparent)'
      : 'linear-gradient(160deg, rgba(0,0,0,0.02), transparent)',
}));

export const ChartPanel = styled(Paper)(({ theme }) => ({
  flex: '1 1 280px',
  minWidth: 0,
  width: '100%',
  padding: theme.spacing(2, 2.25),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ChartRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  width: '100%',
  minWidth: 0,
}));

/** Exactly two visual rows that fill remaining height. */
export const BentoBoard = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridTemplateRows: '1fr 1fr',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'none',
    gridAutoRows: 'minmax(160px, auto)',
  },
  '& > *': {
    minWidth: 0,
    minHeight: 0,
    height: '100%',
  },
}));
