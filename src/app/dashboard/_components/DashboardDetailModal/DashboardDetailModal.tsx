'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';
import { dashboardPagePadding } from '@/app/_lib/layout/dashboardPageLayout';
import type { DashboardDetailModalProps } from './types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DashboardDetailModal({
  open,
  onClose,
  title,
  subtitle,
  loading,
  error,
  children,
}: DashboardDetailModalProps) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{ transition: Transition }}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      <AppBar elevation={0} color="default" position="sticky" sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }} noWrap>
            {title}
          </Typography>
          <IconButton edge="end" onClick={onClose} aria-label="Close detail">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          p: dashboardPagePadding,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexShrink: 0 }}>
            {subtitle}
          </Typography>
        ) : null}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          children
        )}
      </Box>
    </Dialog>
  );
}
