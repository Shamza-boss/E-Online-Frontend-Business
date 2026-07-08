import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { DRAWER_MAX_WIDTH } from './constants';

export const MobileDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  '& .MuiDrawer-paper': {
    backgroundImage: 'none',
    backgroundColor: theme.palette.background.paper,
  },
}));

export const DrawerStack = styled(Stack)({
  maxWidth: DRAWER_MAX_WIDTH,
  height: '100%',
});

export const ProfileHeader = styled(Stack)({
  flexDirection: 'row',
  padding: 16,
  paddingBottom: 0,
  gap: 8,
});

export const ProfileInfo = styled(Stack)({
  flexDirection: 'row',
  gap: 8,
  alignItems: 'center',
  flexGrow: 1,
  padding: 8,
});

export const LogoutStack = styled(Stack)({
  padding: 16,
});
