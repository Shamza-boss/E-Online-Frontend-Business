import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import type { ErrorTone } from './types';

export const PageContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  paddingLeft: 16,
  paddingRight: 16,
});

export const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$tone',
})<{ $tone: ErrorTone }>(({ theme, $tone }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.palette[$tone].main,
  marginBottom: theme.spacing(2),
}));
