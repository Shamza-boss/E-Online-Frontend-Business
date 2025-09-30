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
import EducationOnlineLogo from './EducationOnlineIcon';
import ColorModeIconDropdown from '../../shared-theme/ColorModelIconDropdown';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useAuthActions from '../../../hooks/useAuthActions';

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
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <EducationOnlineLogo />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="/#features">
                <Button variant="text" color="info" size="small">
                  Features
                </Button>
              </Link>
              <Link href="/#testimonials">
                <Button variant="text" color="info" size="small">
                  Testimonials
                </Button>
              </Link>
              <Link href="/#highlights">
                <Button variant="text" color="info" size="small">
                  Highlights
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button variant="text" color="info" size="small">
                  Pricing
                </Button>
              </Link>
              <Link href="/#faq">
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{ minWidth: 0 }}
                >
                  FAQ
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{ minWidth: 0 }}
                >
                  Blog
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
                <Link href="/signin">
                  <Button color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </Link>
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
                  <MenuItem>Features</MenuItem>
                </Link>
                <Link href="/#testimonials">
                  <MenuItem>Testimonials</MenuItem>
                </Link>
                <Link href="/#highlights">
                  <MenuItem>Highlights</MenuItem>
                </Link>
                <Link href="/#pricing">
                  <MenuItem>Pricing</MenuItem>
                </Link>
                <Link href="/#faq">
                  <MenuItem>FAQ</MenuItem>
                </Link>
                <Link href="/blog">
                  <MenuItem>Blog</MenuItem>
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
