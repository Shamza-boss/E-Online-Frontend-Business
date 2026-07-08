import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const TabPanelContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  minHeight: 0,
});

export const TabListContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
