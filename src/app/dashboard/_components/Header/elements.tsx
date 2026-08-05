import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';

export const HeaderContainer = styled(Box)({
  flexShrink: 0,
  width: '100%',
  paddingTop: 16,
  paddingBottom: 8,
  paddingLeft: 16,
  paddingRight: 16,
});

export const HeaderStack = styled(Stack)({
  display: 'none',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  '@media (min-width: 900px)': {
    display: 'flex',
  },
});

export const ActionsStack = styled(Stack)({
  flexDirection: 'row',
  gap: 8,
});
