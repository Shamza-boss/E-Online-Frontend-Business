import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

export const MenuStack = styled(Stack)({
  flexGrow: 1,
  padding: 8,
  justifyContent: 'space-between',
});

export const ListItemWrapper = styled('div')({
  display: 'block',
  marginBottom: 2.4,
  '&:last-child': {
    marginBottom: 0,
  },
});
