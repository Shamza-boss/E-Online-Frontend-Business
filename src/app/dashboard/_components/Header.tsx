import * as React from 'react';
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadCrumbs';
import ColorModeIconDropdown from '../../_lib/components/shared-theme/ColorModelIconDropdown';

import Search from './Search';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        pb: 1,
      }}
      spacing={1}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
