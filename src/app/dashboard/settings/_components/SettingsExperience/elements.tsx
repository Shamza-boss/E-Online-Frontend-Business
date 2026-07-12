'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  getDashboardPagePadding,
} from '@/app/_lib/layout/dashboardPageLayout';

export const SettingsPageRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxSizing: 'border-box',
  minWidth: 0,
  ...getDashboardPagePadding(theme),
}));

export const SettingsHeaderBox = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
}));

export const SettingsBody = styled(Box)({
  flex: '1 1 0%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  minHeight: 0,
  minWidth: 0,
  width: '100%',
});

export const TabContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  paddingTop: theme.spacing(2),
  paddingRight: theme.spacing(0.5),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(2.5),
  },
}));
