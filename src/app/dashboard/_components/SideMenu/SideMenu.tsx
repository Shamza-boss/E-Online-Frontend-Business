'use client';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuContent from '../MenuContent';
import OptionsMenu from '../OptionsMenu';
import { useSession } from 'next-auth/react';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { drawerClasses } from '@mui/material/Drawer';
import { Drawer, InstitutionHeader, ProfileStack, ProfileDetails } from './elements';

export default function SideMenu() {
  const { data: session } = useSession();
  const userProfileName = session?.user?.name as string;
  const userProfileRole = session?.user?.role as number;
  const institutionName = session?.user?.institutionName as string;

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <InstitutionHeader>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500 }}>
          {institutionName}
        </Typography>
      </InstitutionHeader>
      <Divider />
      <MenuContent />

      <ProfileStack>
        <ProfileDetails spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }} noWrap>
            {userProfileName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            <RoleChip role={userProfileRole} />
          </Typography>
        </ProfileDetails>
        <OptionsMenu />
      </ProfileStack>
    </Drawer>
  );
}
