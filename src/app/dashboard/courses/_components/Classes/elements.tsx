'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';

/** Outlined shell — fills remaining page height; scroll lives inside. */
export const ClassesContentPanel = styled(OutlinedWrapper)({
  flex: 1,
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
});

export const ClassesScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(3),
}));

export const ClassesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

export const CardWrapper = styled(Box)({
  width: '100%',
});
