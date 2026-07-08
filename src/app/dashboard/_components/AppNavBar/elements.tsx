import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';

export const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 1.5),
  minHeight: 56,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: theme.spacing(1),
    p: theme.spacing(1),
    pb: 0,
  },
}));

export const BrandIcon = styled(Box)({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '999px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  backgroundImage:
    'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
  color: 'hsla(210, 100%, 95%, 0.9)',
  border: '1px solid',
  borderColor: 'hsl(210, 100%, 55%)',
  boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
});

export const MobileAppBar = styled(AppBar)(({ theme }) => ({
  display: 'block',
  boxShadow: 'none',
  backgroundImage: 'none',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  top: 'var(--template-frame-height, 0px)',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));
