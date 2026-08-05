'use client';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from '../MenuContent';
import { useSession } from 'next-auth/react';
import useAuthActions from '@/app/_lib/hooks/useAuthActions';
import type { SideMenuMobileProps } from './types';
import { LOGOUT_LABEL } from './constants';
import {
  MobileDrawer,
  DrawerStack,
  ProfileHeader,
  ProfileInfo,
  LogoutStack,
} from './elements';

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const { data: session } = useSession();
  const { handleSignOut } = useAuthActions();
  const userProfileName = session?.user?.name as string;

  return (
    <MobileDrawer anchor="right" open={open} onClose={toggleDrawer(false)}>
      <DrawerStack>
        <ProfileHeader>
          <ProfileInfo>
            <Avatar sizes="small" alt={userProfileName} sx={{ width: 24, height: 24 }} />
            <Typography component="p" variant="h6">
              {userProfileName}
            </Typography>
          </ProfileInfo>
        </ProfileHeader>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        <LogoutStack>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRoundedIcon />}
            onClick={() => void handleSignOut()}
          >
            {LOGOUT_LABEL}
          </Button>
        </LogoutStack>
      </DrawerStack>
    </MobileDrawer>
  );
}
