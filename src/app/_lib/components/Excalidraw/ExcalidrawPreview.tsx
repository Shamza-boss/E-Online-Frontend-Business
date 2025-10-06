/* eslint-disable react/display-name */
// components/ExcalidrawPreview.tsx
'use client';

import React, { forwardRef, useState, useEffect, useMemo } from 'react';
import { NodeViewWrapper, ReactNodeViewProps } from '@tiptap/react';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import ExcalidrawModal from './ExcaliDrawModal.client';
import { Box, CircularProgress, IconButton, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRichTextEditorContext } from 'mui-tiptap';
import { sanitizeExcalidrawElements } from './sanitizeElements';

const ExcalidrawPreview = forwardRef<
  HTMLDivElement,
  ReactNodeViewProps<HTMLDivElement>
>(({ node, updateAttributes }, ref) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [open, setOpen] = useState(false);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const elements = useMemo(() => {
    try {
      const parsed = JSON.parse(node.attrs.data || '[]');
      return sanitizeExcalidrawElements(parsed);
    } catch (error) {
      console.error('Failed to parse excalidraw data', error);
      return [] as ExcalidrawElement[];
    }
  }, [node.attrs.data]);

  const editor = useRichTextEditorContext();
  const isEditable = editor?.options.editable ?? false;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!elements.length) {
        setSvgHtml('');
        return;
      }
      // dynamically import only on client
      const { exportToSvg } = await import('@excalidraw/utils');
      // minimal appState
      const appState = {
        viewBackgroundColor: 'transparent',
        exportBackground: true,
        exportWithDarkMode: isDark,
      };

      try {
        const svgEl = await exportToSvg({
          elements,
          appState,
          exportPadding: 0,
          files: {},
        });
        if (!cancelled) {
          const xml = new XMLSerializer().serializeToString(svgEl);
          setSvgHtml(xml);
        }
      } catch (err) {
        console.error('exportToSvg failed:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    elements,
    isDark,
    theme.palette.background.paper,
    theme.palette.background.default,
  ]);

  return (
    <NodeViewWrapper
      ref={ref}
      as="div"
      style={{
        position: 'relative',
      }}
    >
      {svgHtml ? (
        <Box
          sx={{ width: '100%' }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {/* show pencil if editable, eye if readOnly */}
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          backgroundColor: 'primary.main',
        }}
      >
        {isEditable ? (
          <EditIcon fontSize="small" />
        ) : (
          <VisibilityIcon fontSize="small" />
        )}
      </IconButton>
      {open && (
        <ExcalidrawModal
          open={open}
          initialElements={Array.from(elements)}
          onClose={() => setOpen(false)}
          onSave={(updated) => {
            const sanitized = sanitizeExcalidrawElements(updated);
            updateAttributes({ data: JSON.stringify(sanitized) });
            setOpen(false);
          }}
          readonly={!isEditable}
        />
      )}
    </NodeViewWrapper>
  );
});

export default ExcalidrawPreview;
