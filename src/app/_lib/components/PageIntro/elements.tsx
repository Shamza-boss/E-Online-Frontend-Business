'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { PageIntroCollapseBreakpoint } from './types';

export const IntroRoot = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(1),
  },
}));

export const DesktopIntro = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$collapseBelow',
})<{ $collapseBelow: PageIntroCollapseBreakpoint }>(
  ({ theme, $collapseBelow }) => ({
    display: 'block',
    [theme.breakpoints.down($collapseBelow)]: {
      display: 'none',
    },
  }),
);

export const CompactBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$collapseBelow',
})<{ $collapseBelow: PageIntroCollapseBreakpoint }>(
  ({ theme, $collapseBelow }) => ({
    display: 'none',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
    minWidth: 0,
    [theme.breakpoints.down($collapseBelow)]: {
      display: 'flex',
    },
  }),
);

export const InfoBody = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
}));
