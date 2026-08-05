import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const SummaryCardRoot = styled(Paper)(({ theme }) => ({
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5, 1.75),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(165deg, rgba(255,255,255,0.04), transparent 55%)'
      : 'linear-gradient(165deg, rgba(0,0,0,0.02), transparent 55%)',
  '&:hover, &:focus-visible': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)',
    outline: 'none',
  },
}));

export const ValueBlock = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: theme.spacing(1),
  minWidth: 0,
  marginBottom: theme.spacing(0.5),
}));

export const ChartSlot = styled(Box)({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  pointerEvents: 'none',
  '& svg': {
    pointerEvents: 'none',
  },
});

export const OpenCue = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  fontSize: 16,
  opacity: 0.7,
}));
