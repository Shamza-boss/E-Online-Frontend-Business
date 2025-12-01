'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SaveIcon from '@mui/icons-material/Save';
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { TransitionProps } from '@mui/material/transitions';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((m) => m.Excalidraw),
  { ssr: false }
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
  initialElements: any[]; // or ExcalidrawElement[]
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
  const [elements, setElements] =
    useState<readonly ExcalidrawElement[]>(initialElements);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    if (open) {
      setElements(initialElements);
    }
  }, [open, initialElements]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slotProps={{ transition: Transition }}
      keepMounted
      title="Excalidraw Editor"
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
          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
            Excalidraw Editor
          </Typography>
          {!readonly && (
            <Tooltip title="Save">
              <Button
                color="inherit"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={() => {
                  onSave([...elements]);
                  onClose();
                }}
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
          initialData={{ elements }}
          viewModeEnabled={readonly}
          onChange={(upd: readonly ExcalidrawElement[]) => setElements(upd)}
          theme={isDark ? 'dark' : 'light'}
        />
      </Box>
    </Dialog>
  );
}
