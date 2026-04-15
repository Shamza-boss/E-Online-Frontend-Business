import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export const RootContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflow: 'hidden',
});

export const MainArea = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxHeight: '100vh',
  backgroundColor: alpha(theme.palette.background.default, 1),
  overflow: 'hidden',
}));

export const ContentStack = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  alignItems: 'stretch',
  overflow: 'hidden',
  marginTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
  },
}));

export const ChildrenContainer = styled(Box)({
  flexGrow: 1,
  width: '100%',
  minHeight: 0,
  overflow: 'auto',
});
