'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
  Tooltip,
  Button,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SaveIcon from '@mui/icons-material/Save';
import { TransitionProps } from '@mui/material/transitions';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((m) => m.Excalidraw),
  { 
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    ),
  }
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ExcalidrawModalProps {
  open: boolean;
  onClose: () => void;
  initialElements: any[];
  onSave: (elements: any[]) => void;
  readonly: boolean;
}

export default function ExcalidrawModal({
  open,
  onClose,
  initialElements,
  onSave,
  readonly,
}: ExcalidrawModalProps) {
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSave = useCallback(() => {
    if (excalidrawAPIRef.current) {
      const elements = excalidrawAPIRef.current.getSceneElements();
      onSave([...elements]);
    }
    onClose();
  }, [onSave, onClose]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{ transition: Transition }}
      aria-labelledby="excalidraw-editor-title"
    >
      <AppBar
        position="static"
        sx={{
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Tooltip title="Close">
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <FullscreenExitIcon />
            </IconButton>
          </Tooltip>
          <Typography
            id="excalidraw-editor-title"
            variant="h6"
            sx={{ ml: 2, flex: 1 }}
          >
            Excalidraw Editor
          </Typography>
          {!readonly && (
            <Tooltip title="Save">
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.background.default, 1),
        }}
      >
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
            excalidrawAPIRef.current = api;
          }}
          initialData={{ elements: initialElements }}
          viewModeEnabled={readonly}
          theme={isDark ? 'dark' : 'light'}
        />
      </Box>
    </Dialog>
  );
}
