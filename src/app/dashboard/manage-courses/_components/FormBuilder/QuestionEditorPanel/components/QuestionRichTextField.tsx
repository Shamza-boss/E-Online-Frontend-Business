'use client';

import React, { useEffect, useId, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { RichTextEditor, RichTextEditorRef } from 'mui-tiptap';
import useExtensions from '@/app/_lib/components/TipTapEditor/useExtensions';
import EditorMenuControls from '@/app/_lib/components/TipTapEditor/EditorMenuControls';
import type { QuestionRichTextFieldProps } from '../interfaces';
import { ANTI_ASSIST_ATTRS } from '../constants';
import { RichTextWrapper } from '../elements';

export default function QuestionRichTextField({
  label,
  value,
  placeholder,
  onChange,
  minHeight = 180,
  showToolbar = true,
  debounceMs = 1000,
}: QuestionRichTextFieldProps) {
  const fieldId = useId();
  const editorRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({ placeholder });
  const normalizedValue = value ?? '';
  const timeoutRef = useRef<number | null>(null);
  const latestOnChangeRef = useRef(onChange);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    if (!normalizedValue) {
      if (!editor.isEmpty) {
        editor.commands.clearContent();
      }
      return;
    }

    if (editor.getHTML() !== normalizedValue) {
      editor.commands.setContent(normalizedValue, false);
    }
  }, [normalizedValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleUpdate = () => {
    const editor = editorRef.current?.editor;
    if (!editor) return;

    const html = editor.isEmpty ? '' : editor.getHTML();
    if (html !== normalizedValue) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        latestOnChangeRef.current(html);
      }, debounceMs);
    }
  };

  return (
    <RichTextWrapper {...(ANTI_ASSIST_ATTRS as any)}>
      <Typography
        variant="caption"
        color="text.secondary"
        component="label"
        htmlFor={fieldId}
        sx={{ display: 'block', mb: 0.5 }}
      >
        {label}
      </Typography>
      <RichTextEditor
        ref={editorRef}
        content={normalizedValue}
        extensions={extensions}
        onUpdate={handleUpdate}
        renderControls={showToolbar ? () => <EditorMenuControls /> : undefined}
        immediatelyRender={false}
        RichTextFieldProps={{
          id: fieldId,
          variant: 'outlined',
          RichTextContentProps: ANTI_ASSIST_ATTRS as any,
          sx: {
            mt: 1,
            '& .MuiRichTextContent-root': {
              minHeight,
              px: 1,
            },
          },
        }}
      />
    </RichTextWrapper>
  );
}
