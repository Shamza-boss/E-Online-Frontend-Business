import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const LoadingContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40vh',
});

export const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
}));
