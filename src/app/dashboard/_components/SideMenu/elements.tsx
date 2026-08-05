import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DRAWER_WIDTH } from './constants';

export const Drawer = styled(MuiDrawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  boxSizing: 'border-box',
  marginTop: 10,
  [`& .${drawerClasses.paper}`]: {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
});

export const InstitutionHeader = styled(Box)({
  display: 'flex',
  padding: 20,
});

export const ProfileStack = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  padding: 16,
  gap: 8,
  alignItems: 'center',
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
  marginTop: 'auto',
}));

export const ProfileDetails = styled(Stack)({
  marginRight: 'auto',
  maxWidth: 200,
});
