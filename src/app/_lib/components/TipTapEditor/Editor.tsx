'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  RefObject,
  memo,
} from 'react';
import { useEditor } from '@tiptap/react';
import {
  RichTextEditorProvider,
  RichTextContent,
  MenuControlsContainer,
  MenuButton,
  LinkBubbleMenu,
  TableBubbleMenu,
} from 'mui-tiptap';
import { Box, Fade, Typography, GlobalStyles } from '@mui/material';
import { Lock, LockOpen, TextFields } from '@mui/icons-material';
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import type { EditorOptions } from '@tiptap/core';
import type { NoteDto } from '../../interfaces/types';
import { debounce } from 'es-toolkit';
import TextFragmentLoader from '@/app/dashboard/_components/_skeletonLoaders/TextSkeleton';
import {
  PDF_NOTE_LINK_SELECTOR,
  PDF_NOTE_LINK_CLASS,
  PDF_NOTE_SENTINEL_ATTRIBUTE,
  parsePdfNoteLinkElement,
  type PdfNoteLinkSummary,
  type PdfNoteLinkNodeAttributes,
} from '@/app/_lib/utils/pdfNoteLinks';

export interface EditorProps {
  note?: NoteDto;
  loading: boolean;
  onSave: (content: string) => void | Promise<void>;
  onContentChange?: (html: string) => void;
  onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
}
export interface EditorHandle {
  insertHtml: (html: string) => void;
  getHtml: () => string;
  insertPdfLink?: (attrs: PdfNoteLinkNodeAttributes) => boolean;
  updatePdfLink?: (
    linkId: string,
    updates: {
      chipLabel?: string;
      chipColor?: string;
    }
  ) => boolean;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ note, loading, onSave, onContentChange, onPdfLinkClick }: EditorProps, ref) => {
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
        onContentChange?.(content);
        if (content !== note?.content) {
          debouncedSaveRef.current(content);
        }
      },
    });

    const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> =
      useCallback((view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer?.files)
          return false;

        const hasImage = Array.from(event.dataTransfer.files).some((file) =>
          (file.type || '').toLowerCase().startsWith('image/')
        );

        if (hasImage) {
          event.preventDefault();
          return true;
        }
        return false;
      }, []);

    const handlePaste: NonNullable<
      EditorOptions['editorProps']['handlePaste']
    > = useCallback((_view, event) => {
      if (!event.clipboardData) return false;

      const hasImage = Array.from(event.clipboardData.files || []).some(
        (file) => (file.type || '').toLowerCase().startsWith('image/')
      );

      if (hasImage) {
        event.preventDefault();
        return true;
      }
    }, []);

    const handlePdfLinkActivation = useCallback(
      (event: MouseEvent | KeyboardEvent) => {
        if (!onPdfLinkClick) return;
        const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
          PDF_NOTE_LINK_SELECTOR
        );
        if (!target) return;

        if (
          event instanceof KeyboardEvent &&
          event.type === 'keydown' &&
          event.key !== 'Enter' &&
          event.key !== ' '
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const payload = parsePdfNoteLinkElement(target);
        if (!payload) return;

        onPdfLinkClick(payload);
      },
      [onPdfLinkClick]
    );

    const updatePdfLinkAttributes = useCallback(
      (
        linkId: string,
        updates: { chipLabel?: string; chipColor?: string }
      ): boolean => {
        if (!editor) return false;

        let changed = false;
        editor
          .chain()
          .command(({ tr }) => {
            editor.state.doc.descendants((node, pos) => {
              if (
                node.type.name === 'pdfNoteLink' &&
                node.attrs['data-link-id'] === linkId
              ) {
                const nextAttrs = { ...node.attrs };
                if (typeof updates.chipLabel === 'string') {
                  nextAttrs['data-chip-label'] = updates.chipLabel;
                }
                if (typeof updates.chipColor === 'string') {
                  nextAttrs['data-chip-color'] = updates.chipColor;
                }
                tr.setNodeMarkup(pos, undefined, nextAttrs);
                changed = true;
                return false;
              }
              return true;
            });
            return changed;
          })
          .run();
        return changed;
      },
      [editor]
    );

    if (ref) {
      (ref as RefObject<EditorHandle | null>).current = {
        insertHtml: (html: string) => {
          if (editor) editor.commands.insertContent(html);
        },
        getHtml: () => editor?.getHTML() ?? '',
        insertPdfLink: (attrs) => {
          if (!editor) return false;
          editor
            .chain()
            .focus()
            .insertContent({
              type: 'pdfNoteLink',
              attrs,
            })
            .run();
          return true;
        },
        updatePdfLink: (linkId, updates) =>
          updatePdfLinkAttributes(linkId, updates),
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

    useEffect(() => {
      if (!editor || !onPdfLinkClick) return;
      const clickListener = (event: MouseEvent) => handlePdfLinkActivation(event);
      const keyListener = (event: KeyboardEvent) => handlePdfLinkActivation(event);
      const dom = editor.view.dom;
      dom.addEventListener('click', clickListener);
      dom.addEventListener('keydown', keyListener);
      return () => {
        dom.removeEventListener('click', clickListener);
        dom.removeEventListener('keydown', keyListener);
      };
    }, [editor, onPdfLinkClick, handlePdfLinkActivation]);

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
        <GlobalStyles
          styles={(theme) => ({
            [`.${PDF_NOTE_LINK_CLASS}`]: {
              display: 'block',
              width: '100%',
              textDecoration: 'none',
              cursor: 'pointer',
              userSelect: 'none',
              backgroundColor: 'transparent',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.85,
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}55`,
                borderRadius: theme.shape.borderRadius,
              },
            },
            [`[${PDF_NOTE_SENTINEL_ATTRIBUTE}="true"]`]: {
              display: 'none !important',
              visibility: 'hidden',
              pointerEvents: 'none',
              opacity: 0,
              width: 0,
              height: 0,
              overflow: 'hidden',
            },
            '@keyframes pdfNoteChipPulse': {
              '0%': {
                transform: 'scale(0.98)',
                boxShadow: `0 0 0 0 ${theme.palette.primary.main}55`,
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: 'none',
              },
            },
            '.pdf-note-chip--pulse': {
              animation: 'pdfNoteChipPulse 1s ease-out',
            },
          })}
        />
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

export default memo(Editor);
