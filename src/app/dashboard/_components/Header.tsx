import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadCrumbs';
import ColorModeIconDropdown from '../../_lib/components/shared-theme/ColorModelIconDropdown';

import Search from './Search';
import { Box } from '@mui/system';

export default function Header() {
  return (

    <Box sx={{ flexShrink: 0, width: '100%', pt: 2, pb: 1, pl: 2, pr: 2, }}>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
        }}
        spacing={1}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Search />
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
    </Box>
  );
}
