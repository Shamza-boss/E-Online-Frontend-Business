'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from '../SideMenuMobile';
import MenuButton from '../MenuButton';
import ColorModeIconDropdown from '../../../_lib/components/shared-theme/ColorModelIconDropdown';
import { NAVBAR_TITLE } from './constants';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { Toolbar, MobileAppBar, BrandIcon } from './elements';

export function NavBrandIcon() {
  return (
    <BrandIcon>
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: '1rem' }} />
    </BrandIcon>
  );
}

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <MobileAppBar
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        borderColor: 'divider',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mr: 'auto' }}>
            <NavBrandIcon />
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{
                color: 'text.primary',
                fontSize: { xs: '1rem', sm: '1.125rem' },
                fontWeight: 600,
              }}
            >
              {NAVBAR_TITLE}
            </Typography>
          </Stack>
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </MobileAppBar>
  );
}

