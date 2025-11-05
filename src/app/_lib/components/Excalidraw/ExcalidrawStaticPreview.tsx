'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import ExcalidrawModal from './ExcaliDrawModal.client';
import { sanitizeExcalidrawElements } from './sanitizeElements';

interface ExcalidrawStaticPreviewProps {
  data?: string | null;
  height?: number;
  showModalTrigger?: boolean;
  ariaLabel?: string;
  allowEditing?: boolean;
}

const ExcalidrawStaticPreview: React.FC<ExcalidrawStaticPreviewProps> = ({
  data,
  height = 220,
  showModalTrigger = true,
  ariaLabel = 'View drawing',
  allowEditing = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);

  const parsedElements = useMemo(() => {
    try {
      const parsed = JSON.parse(data ?? '[]');
      return sanitizeExcalidrawElements(parsed);
    } catch (error) {
      console.error('Failed to parse Excalidraw payload', error);
      return [] as ExcalidrawElement[];
    }
  }, [data]);

  useEffect(() => {
    setElements(parsedElements);
  }, [parsedElements]);

  useEffect(() => {
    let active = true;

    if (elements.length === 0) {
      setSvgMarkup(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);

    (async () => {
      try {
        const { exportToSvg } = await import('@excalidraw/utils');
        const svgElement = await exportToSvg({
          elements,
          appState: {
            viewBackgroundColor: 'transparent',
            exportBackground: true,
            exportWithDarkMode: isDark,
          },
          exportPadding: 0,
          files: {},
        });

        if (!active) return;
        const xml = new XMLSerializer().serializeToString(svgElement);
        setSvgMarkup(xml);
      } catch (error) {
        if (active) {
          console.error('Unable to export Excalidraw SVG', error);
          setSvgMarkup(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [elements, isDark]);

  const hasDrawing = elements.length > 0;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: hasDrawing ? 'auto' : height,
        borderRadius: 1,
        border: (themeArg) => `1px solid ${themeArg.palette.divider}`,
        overflow: 'hidden',
        backgroundColor: (themeArg) => themeArg.palette.background.paper,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : hasDrawing && svgMarkup ? (
        <Box
          sx={{
            width: '100%',
            '& svg': {
              display: 'block',
              width: '100%',
              height: 'auto',
            },
          }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height,
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Drawing unavailable
          </Typography>
        </Box>
      )}

      {hasDrawing && showModalTrigger && (
        <>
          <IconButton
            size="small"
            onClick={() => setModalOpen(true)}
            aria-label={ariaLabel}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          {modalOpen && (
            <ExcalidrawModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              initialElements={Array.from(elements)}
              readonly={!allowEditing}
              onSave={(updated) => {
                // When editing is enabled, persist new drawing back into the preview.
                const sanitized = sanitizeExcalidrawElements(updated);
                setElements(sanitized);
                setModalOpen(false);
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default ExcalidrawStaticPreview;
