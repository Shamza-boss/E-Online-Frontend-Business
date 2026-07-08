import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const HeaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const HelpText = styled(Typography)({
  maxWidth: 'fit-content',
});
