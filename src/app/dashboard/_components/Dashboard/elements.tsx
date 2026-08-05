import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const RootContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  minHeight: '100dvh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  minWidth: 0,
});

export const MainArea = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  maxHeight: '100dvh',
  minWidth: 0,
  backgroundColor: alpha(theme.palette.background.default, 1),
  overflow: 'hidden',
}));

export const ContentStack = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  alignItems: 'stretch',
  overflow: 'hidden',
  minWidth: 0,
  marginTop: theme.spacing(7),
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(7.5),
  },
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
    gap: theme.spacing(1.5),
  },
}));

export const ChildrenContainer = styled(Box)({
  flexGrow: 1,
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
});
