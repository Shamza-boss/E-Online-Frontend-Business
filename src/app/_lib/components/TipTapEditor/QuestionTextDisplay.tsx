'use client';

import React, { useEffect, useMemo } from 'react';
import { useEditor } from '@tiptap/react';
import { RichTextContent, RichTextEditorProvider } from 'mui-tiptap';
import { Box, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import useExtensions from './useExtensions';

type QuestionTextDisplayProps = {
  content?: string | null;
  fallback?: string;
  variant?: TypographyProps['variant'];
  fontWeight?: TypographyProps['fontWeight'];
  color?: TypographyProps['color'];
  fallbackColor?: TypographyProps['color'];
  component?: TypographyProps['component'];
  sx?: SxProps<Theme>;
  showExcalidrawModalTrigger?: boolean;
}

const defaultBlockStyles: SxProps<Theme> = {
  '& p': {
    margin: 0,
  },
  '& p + p': {
    marginTop: 1,
  },
  '& ul, & ol': {
    margin: 0,
    paddingLeft: 3,
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: 2,
    marginBottom: 1,
  },
  '& h1:first-of-type, & h2:first-of-type, & h3:first-of-type, & h4:first-of-type, & h5:first-of-type, & h6:first-of-type':
    {
      marginTop: 0,
    },
};

const QuestionTextDisplay: React.FC<QuestionTextDisplayProps> = ({
  content,
  fallback = 'Untitled question',
  variant = 'body1',
  fontWeight,
  color,
  fallbackColor = 'text.secondary',
  component = 'div',
  sx,
}) => {
  const html = useMemo(() => (content ?? '').trim(), [content]);
  const extensions = useExtensions();

  const editor = useEditor({
    editable: false,
    extensions,
    content: html,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        'data-readonly': 'true',
      },
    },
  });

  useEffect(() => {
    if (!editor || !html) return;
    if (editor.getHTML() === html) return;
    queueMicrotask(() => {
      editor.commands.setContent(html, false);
    });
  }, [editor, html]);

  if (!html) {
    return (
      <Typography
        variant={variant}
        fontWeight={fontWeight}
        color={color ?? fallbackColor}
        component={component}
        sx={sx}
      >
        {fallback}
      </Typography>
    );
  }

  return (
    <Typography
      component={component}
      variant={variant}
      fontWeight={fontWeight}
      color={color}
      sx={sx}
    >
      <Box sx={defaultBlockStyles}>
        {editor ? (
          <RichTextEditorProvider editor={editor}>
            <RichTextContent />
          </RichTextEditorProvider>
        ) : null}
      </Box>
    </Typography>
  );
};

export default QuestionTextDisplay;
