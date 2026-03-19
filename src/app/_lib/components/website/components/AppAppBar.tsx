'use client';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AOLaunchpadLogo from './EducationOnlineIcon';
import ColorModeIconDropdown from '../../shared-theme/ColorModelIconDropdown';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthActions from '../../../hooks/useAuthActions';
import { useWarp } from '../../shared-theme/WarpTransition';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const { handleSignOut } = useAuthActions();
  const { warpTo } = useWarp();
  const pathname = usePathname();
  const [activeHash, setActiveHash] = React.useState('');

  React.useEffect(() => {
    const handleHashChange = () => setActiveHash(globalThis.location.hash);
    setActiveHash(globalThis.location.hash);
    globalThis.addEventListener('hashchange', handleHashChange);
    return () => globalThis.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return pathname === '/' && activeHash === href.slice(1);
    return pathname === href;
  };

  const navSx = (href: string) => ({
    borderBottom: isActive(href) ? '2px solid' : '2px solid transparent',
    borderRadius: '4px 4px 0 0',
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        border: 'none',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <AOLaunchpadLogo />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="/#features">
                <Button variant="text" color={isActive('/#features') ? 'primary' : 'info'} size="small" sx={navSx('/#features')}>
                  Features
                </Button>
              </Link>
              <Link href="/#tech-stack">
                <Button variant="text" color={isActive('/#tech-stack') ? 'primary' : 'info'} size="small" sx={navSx('/#tech-stack')}>
                  Tech Stack
                </Button>
              </Link>
              <Link href="/#highlights">
                <Button variant="text" color={isActive('/#highlights') ? 'primary' : 'info'} size="small" sx={navSx('/#highlights')}>
                  Highlights
                </Button>
              </Link>
              <Link href="/#faq">
                <Button variant="text" color={isActive('/#faq') ? 'primary' : 'info'} size="small" sx={{ minWidth: 0, ...navSx('/#faq') }}>
                  FAQ
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="text" color={isActive('/about') ? 'primary' : 'info'} size="small" sx={{ minWidth: 0, ...navSx('/about') }}>
                  About
                </Button>
              </Link>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {!session ? (
              <>
                <Button color="primary" variant="text" size="small" onClick={() => warpTo('/signin', { direction: 'right' })}>
                  Sign in
                </Button>
                <Button color="primary" variant="contained" size="small" onClick={() => warpTo('/signup')}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => handleSignOut()}
                  color="primary"
                  variant="text"
                  size="small"
                >
                  Sign out
                </Button>
                <Link href="/dashboard">
                  <Button color="primary" variant="contained" size="small">
                    Dashboard
                  </Button>
                </Link>
              </>
            )}

            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Link href="/#features">
                  <MenuItem selected={isActive('/#features')}>Features</MenuItem>
                </Link>
                <Link href="/#tech-stack">
                  <MenuItem selected={isActive('/#tech-stack')}>Tech Stack</MenuItem>
                </Link>
                <Link href="/#highlights">
                  <MenuItem selected={isActive('/#highlights')}>Highlights</MenuItem>
                </Link>
                <Link href="/#faq">
                  <MenuItem selected={isActive('/#faq')}>FAQ</MenuItem>
                </Link>
                <Link href="/about">
                  <MenuItem selected={isActive('/about')}>About</MenuItem>
                </Link>
                <Divider sx={{ my: 3 }} />
                {!session ? (
                  <>
                    <MenuItem>
                      <Link href="/signin">
                        <Button color="primary" variant="outlined" fullWidth>
                          Sign in
                        </Button>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/signup">
                        <Button
                          href="/signup"
                          color="primary"
                          variant="contained"
                          fullWidth
                        >
                          Sign up
                        </Button>
                      </Link>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        onClick={() => handleSignOut}
                        color="primary"
                        variant="outlined"
                        fullWidth
                      >
                        Sign out
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/dashboard">
                        <Button color="primary" variant="contained" fullWidth>
                          Dashboard
                        </Button>
                      </Link>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
