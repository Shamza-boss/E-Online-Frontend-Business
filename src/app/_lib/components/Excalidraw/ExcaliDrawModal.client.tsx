'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { type TransitionProps } from '@mui/material/transitions';
import { type ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import { type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

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

export type ExcalidrawModalProps = {
  open: boolean;
  onClose: () => void;
  initialElements: ExcalidrawElement[];
  onSave: (elements: ExcalidrawElement[]) => void;
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
  const [shouldRender, setShouldRender] = useState(false);

  // Fix for issue #7312: Delay Excalidraw rendering and trigger resize event
  // to force canvas size recalculation after modal finishes animating
  useEffect(() => {
    if (open) {
      // Delay rendering to allow modal animation to complete
      const renderTimer = setTimeout(() => {
        setShouldRender(true);
      }, 200);

      return () => {
        clearTimeout(renderTimer);
        setShouldRender(false);
      };
    } else {
      setShouldRender(false);
    }
    return undefined;
  }, [open]);

  // Fire resize event to recalculate Excalidraw canvas dimensions
  useEffect(() => {
    if (shouldRender) {
      const resizeTimer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 150);

      return () => clearTimeout(resizeTimer);
    }
    return undefined;
  }, [shouldRender]);

  const handleSave = useCallback(() => {
    if (excalidrawAPIRef.current) {
      const elements = excalidrawAPIRef.current.getSceneElements();
      onSave([...elements]);
      onClose();
    }
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
        {shouldRender ? (
          <Excalidraw
            excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
              excalidrawAPIRef.current = api;
            }}
            initialData={{
              elements: initialElements,
            }}
            viewModeEnabled={readonly}
            theme={isDark ? 'dark' : 'light'}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
