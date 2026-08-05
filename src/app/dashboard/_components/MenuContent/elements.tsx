import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ListItemButton from '@mui/material/ListItemButton';

export const MenuStack = styled(Stack)({
  flexGrow: 1,
  padding: 8,
  justifyContent: 'space-between',
});

export const ListItemWrapper = styled('div')(({ theme }) => ({
  display: 'block',
  // Tiny gap so selected pills never sit flush against neighbors.
  marginBottom: theme.spacing(0.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

/** Hover uses text/icon color only — no background pill that touches the active item. */
export const NavListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['color', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'transparent',
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      // Keep the active surface; neighboring items never paint a hover pill.
      backgroundColor: theme.palette.action.selected,
    },
  },
}));
