import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const FormLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: '1fr',
  alignItems: 'stretch',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '5fr 7fr',
  },
}));

export const FullHeightCard = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});
