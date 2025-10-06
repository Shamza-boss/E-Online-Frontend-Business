'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  RefObject,
} from 'react';
import { useEditor } from '@tiptap/react';
import {
  RichTextEditorProvider,
  RichTextContent,
  MenuControlsContainer,
  MenuButton,
  LinkBubbleMenu,
  TableBubbleMenu,
  insertImages,
} from 'mui-tiptap';
import { Box, Fade, Typography } from '@mui/material';
import { Lock, LockOpen, TextFields } from '@mui/icons-material';
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import type { EditorOptions } from '@tiptap/core';
import type { NoteDto } from '../../interfaces/types';
import { debounce } from 'es-toolkit';
import TextFragmentLoader from '@/app/dashboard/_components/_skeletonLoaders/TextSkeleton';

const fileListToImageFiles = (fl: FileList): File[] =>
  Array.from(fl).filter((f) =>
    (f.type || '').toLowerCase().startsWith('image/')
  );

interface EditorProps {
  note?: NoteDto;
  loading: boolean;
  onSave: (content: string) => void | Promise<void>;
}
export interface EditorHandle {
  insertHtml: (html: string) => void;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ note, loading, onSave }: EditorProps, ref) => {
    const [editable, setEditable] = useState(true);
    const [showMenuBar, setShowMenuBar] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(
      null
    );
    const [pendingSave, setPendingSave] = useState(false);

    const extensions = useExtensions({
      placeholder: `Add your own content here...`,
    });

    const editor = useEditor({
      editable,
      extensions,
      content: note?.content,
      immediatelyRender: true,
      editorProps: {},
      onUpdate: ({ editor }) => {
        const content = editor.getHTML();
        if (content !== note?.content) {
          debouncedSaveRef.current(content);
        }
      },
    });

    const handleNewImageFiles = useCallback(
      (files: File[], insertPosition?: number) => {
        if (!editor) return;
        const imgs = files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }));
        insertImages({ images: imgs, editor, position: insertPosition });
      },
      [editor]
    );

    const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> =
      useCallback(
        (view, event) => {
          if (!(event instanceof DragEvent) || !event.dataTransfer)
            return false;
          const files = fileListToImageFiles(event.dataTransfer.files);
          if (files.length) {
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;
            handleNewImageFiles(files, pos);
            event.preventDefault();
            return true;
          }
          return false;
        },
        [handleNewImageFiles]
      );

    const handlePaste: NonNullable<
      EditorOptions['editorProps']['handlePaste']
    > = useCallback(
      (_view, event) => {
        if (!event.clipboardData) return false;
        const files = fileListToImageFiles(event.clipboardData.files);
        if (files.length) {
          handleNewImageFiles(files);
          return true;
        }
      },
      [handleNewImageFiles]
    );

    if (ref) {
      (ref as RefObject<EditorHandle | null>).current = {
        insertHtml: (html: string) => {
          if (editor) editor.commands.insertContent(html);
        },
      };
    }

    useEffect(() => {
      if (!editor) return;
      editor.setOptions({
        editorProps: {
          handleDrop,
          handlePaste,
        },
      });
    }, [editor, handleDrop, handlePaste]);

    const saveContent = useCallback(
      async (content: string) => {
        if (pendingSave) return;
        try {
          setPendingSave(true);
          setSaveStatus('saving');
          await onSave(content);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(null), 2000);
        } catch (error) {
          setSaveStatus(null);
        } finally {
          setPendingSave(false);
        }
      },
      [pendingSave, onSave]
    );

    const debouncedSaveRef = useRef(
      debounce((content: string) => {
        debouncedSaveRef.current.saveContent(content);
      }, 800) as any
    );

    useEffect(() => {
      debouncedSaveRef.current.saveContent = saveContent;
    }, [saveContent]);

    useEffect(() => {
      const debounced = debouncedSaveRef.current;
      return () => {
        debounced.cancel();
      };
    }, []);

    useEffect(() => {
      if (editor && note?.content && editor.getHTML() !== note.content) {
        // Defer setContent to avoid flushSync error
        queueMicrotask(() => {
          editor.commands.setContent(note.content, false);
        });
      }
    }, [editor, note?.content]);

    if (!editor) return null;

    return (
      <RichTextEditorProvider editor={editor}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
              p: 1,
            }}
          >
            {showMenuBar && <EditorMenuControls />}
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <TextFragmentLoader />
            ) : (
              <Box m={2}>
                <RichTextContent />
              </Box>
            )}
          </Box>
          <LinkBubbleMenu />
          <TableBubbleMenu />
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
            }}
          >
            <MenuControlsContainer>
              <MenuButton
                value="formatting"
                tooltipLabel={
                  showMenuBar ? 'Hide formatting' : 'Show formatting'
                }
                size="small"
                onClick={() => setShowMenuBar((currentState) => !currentState)}
                selected={showMenuBar}
                IconComponent={TextFields}
              />
              <MenuButton
                value="formatting"
                tooltipLabel={editable ? 'Prevent edits' : 'Allow edits'}
                size="small"
                onClick={() => setEditable((e) => !e)}
                IconComponent={editable ? Lock : LockOpen}
              />
            </MenuControlsContainer>

            <Fade in={saveStatus !== null}>
              <Typography
                variant="caption"
                sx={{
                  color: (theme) =>
                    saveStatus === 'saving'
                      ? theme.palette.text.secondary
                      : theme.palette.success.main,
                  transition: 'color 0.2s ease',
                  ml: 2,
                }}
              >
                {saveStatus === 'saving' ? 'Saving…' : 'Saved'}
              </Typography>
            </Fade>
          </Box>
        </Box>
      </RichTextEditorProvider>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
