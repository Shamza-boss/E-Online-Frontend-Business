import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const DashboardGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
}));

export const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const DescriptionText = styled(Typography)({
  maxWidth: 'max-content',
});

export const GrowGridItem = styled(Grid)({
  flexGrow: 1,
});
