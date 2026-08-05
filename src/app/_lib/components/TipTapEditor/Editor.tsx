'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  type RefObject,
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
import { Box, Button, Fade, Typography, GlobalStyles } from '@mui/material';
import { Lock, LockOpen, TextFields } from '@mui/icons-material';
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import type { EditorOptions } from '@tiptap/core';
import type { NoteDto } from '../../interfaces/types';
import { debounce } from 'es-toolkit';
import TextFragmentLoader from '@/app/dashboard/_components/_skeletonLoaders/TextSkeleton';
import {
  base64Encode,
  computeChecksum,
  decodePdfNotePayload,
  PDF_NOTE_LINK_SELECTOR,
  PDF_NOTE_LINK_CLASS,
  PDF_NOTE_SENTINEL_ATTRIBUTE,
  PDF_NOTE_TRAILING_PARAGRAPHS,
  sanitizeBookmarkColor,
  parsePdfNoteLinkElement,
  type PdfNoteLinkSummary,
  type PdfNoteLinkNodeAttributes,
} from '@/app/_lib/utils/pdfNoteLinks';
import {
  getNoteDraft,
  removeNoteDraft,
  setNoteDraft,
} from '@/app/_lib/utils/noteDraftStore';
import type { JsonObject } from '@/lib/api/json';
import type { DebouncedFunction } from 'es-toolkit';

export type EditorProps = {
  note?: NoteDto;
  loading: boolean;
  onSave: (content: string) => void | Promise<void>;
  onContentChange?: (html: string) => void;
  onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
};

export type EditorHandle = {
  insertHtml: (html: string) => void;
  getHtml: () => string;
  insertPdfLink?: (attrs: PdfNoteLinkNodeAttributes) => boolean;
  updatePdfLink?: (
    linkId: string,
    updates: {
      chipLabel?: string;
      chipColor?: string;
    },
  ) => boolean;
  getRootElement?: () => HTMLElement | null;
};

const serializePdfPayload = (payload: JsonObject) => {
  const payloadJson = JSON.stringify(payload);
  return {
    encoded: base64Encode(payloadJson),
    checksum: computeChecksum(payloadJson),
  };
};

const AUTOSAVE_IDLE_MS = 30000;
const NETWORK_FLUSH_INTERVAL_MS = 30000;
const LOCAL_DRAFT_WRITE_MS = 2000;
const CONTENT_CHANGE_EMIT_MS = 250;
const AUTOSAVE_ENABLED = true;

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ note, loading, onSave, onContentChange, onPdfLinkClick }: EditorProps, ref) => {
    const [editable, setEditable] = useState(true);
    const [showMenuBar, setShowMenuBar] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(
      null
    );
    const [pendingSave, setPendingSave] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const lastSavedContentRef = useRef(note?.content ?? '');
    const latestContentRef = useRef(note?.content ?? '');
    const isFlushingRef = useRef(false);
    const draftStorageKey = note?.id ? `note-draft:${note.id}` : null;

    const extensions = useExtensions({
      placeholder: `Add your own content here...`,
    });

    const flushLatestRef = useRef<() => Promise<void>>(async () => {});

    const persistLocalDraftRef = useRef(
      debounce((content: string, key: string, noteUpdatedAt?: string) => {
        void setNoteDraft({
          noteId: key,
          content,
          updatedAt: Date.now(),
          noteUpdatedAt,
        });
      }, LOCAL_DRAFT_WRITE_MS) as DebouncedFunction<
        (content: string, key: string, noteUpdatedAt?: string) => void
      >,
    );

    const emitContentChangeRef = useRef(
      debounce((content: string) => {
        onContentChange?.(content);
      }, CONTENT_CHANGE_EMIT_MS) as DebouncedFunction<(content: string) => void>,
    );

    const saveLatestContentRef = useRef<(content: string) => void>(() => {});

    const debouncedSaveRef = useRef(
      debounce((content: string) => {
        saveLatestContentRef.current(content);
      }, AUTOSAVE_IDLE_MS) as DebouncedFunction<(content: string) => void>,
    );

    const editor = useEditor({
      editable,
      extensions,
      content: note?.content,
      immediatelyRender: true,
      editorProps: {},
      onUpdate: ({ editor }) => {
        const content = editor.getHTML();
        emitContentChangeRef.current(content);

        latestContentRef.current = content;

        if (draftStorageKey && content !== lastSavedContentRef.current) {
          persistLocalDraftRef.current(content, draftStorageKey, note?.updatedAt);
        }

        if (content !== lastSavedContentRef.current) {
          if (!AUTOSAVE_ENABLED) {
            setIsDirty(true);
            return;
          }

          debouncedSaveRef.current(content);
        }
      },
    });

    useEffect(() => {
      if (!editor) return;
      editor.setEditable(editable);
    }, [editor, editable]);

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
      return false;
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
          .command(({ tr, state }) => {
            state.doc.descendants((node, pos) => {
              if (
                node.type.name !== 'pdfNoteLink' ||
                node.attrs['data-link-id'] !== linkId
              ) {
                return true;
              }

              const nextAttrs = { ...node.attrs };
              const hasLabelUpdate = typeof updates.chipLabel === 'string';
              const hasColorUpdate = typeof updates.chipColor === 'string';
              const normalizedColor = hasColorUpdate
                ? sanitizeBookmarkColor(updates.chipColor as string) ?? ''
                : undefined;

              if (hasLabelUpdate) {
                nextAttrs['data-chip-label'] = updates.chipLabel as string;
              }

              if (hasColorUpdate) {
                nextAttrs['data-chip-color'] =
                  normalizedColor ?? nextAttrs['data-chip-color'];
              }

              if (hasLabelUpdate || hasColorUpdate) {
                const decodedPayload = decodePdfNotePayload(
                  nextAttrs['data-pdf-payload'],
                  nextAttrs['data-pdf-checksum']
                );

                if (decodedPayload) {
                  const payload = { ...decodedPayload.payload };

                  if (hasLabelUpdate) {
                    payload.bookmarkTitle = updates.chipLabel as string;
                  }

                  if (hasColorUpdate) {
                    payload.bookmarkColor = normalizedColor || undefined;
                  }

                  const { encoded, checksum } = serializePdfPayload(payload);
                  nextAttrs['data-pdf-payload'] = encoded;
                  nextAttrs['data-pdf-checksum'] = checksum;
                } else {
                  nextAttrs['data-pdf-payload'] = null;
                  nextAttrs['data-pdf-checksum'] = null;
                }
              }

              tr.setNodeMarkup(pos, undefined, nextAttrs);
              changed = true;
              return false;
            });
            return changed;
          })
          .run();
        return changed;
      },
      [editor]
    );

    const handleManualSave = useCallback(async () => {
      if (!editor || pendingSave) return;

      const content = editor.getHTML();

      try {
        setPendingSave(true);
        setSaveStatus('saving');
        await onSave(content);
        setIsDirty(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } catch {
        setSaveStatus(null);
      } finally {
        setPendingSave(false);
      }
    }, [editor, onSave, pendingSave]);

    if (ref) {
      (ref as RefObject<EditorHandle | null>).current = {
        insertHtml: (html: string) => {
          if (editor) editor.commands.insertContent(html);
        },
        getHtml: () => editor?.getHTML() ?? '',
        insertPdfLink: (attrs) => {
          if (!editor) return false;
          const trailingParagraphs = Array.from(
            { length: PDF_NOTE_TRAILING_PARAGRAPHS },
            () => ({
              type: 'paragraph',
              content: [{ type: 'hardBreak' }],
            })
          );
          editor
            .chain()
            .focus()
            .insertContent([
              {
                type: 'pdfNoteLink',
                attrs,
              },
              ...trailingParagraphs,
            ])
            .run();
          return true;
        },
        updatePdfLink: (linkId, updates) =>
          updatePdfLinkAttributes(linkId, updates),
        getRootElement: () => editor?.view.dom ?? null,
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

    const flushLatest = useCallback(async () => {
      if (isFlushingRef.current) return;

      const contentToSave = latestContentRef.current;
      if (contentToSave === lastSavedContentRef.current) return;

      try {
        isFlushingRef.current = true;
        setPendingSave(true);
        setSaveStatus('saving');

        await onSave(contentToSave);
        lastSavedContentRef.current = contentToSave;
        setIsDirty(false);

        if (draftStorageKey) {
          const draft = await getNoteDraft(draftStorageKey);
          if (draft?.content === contentToSave) {
            await removeNoteDraft(draftStorageKey);
          }
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } catch {
        setSaveStatus(null);
      } finally {
        isFlushingRef.current = false;
        setPendingSave(false);

        if (latestContentRef.current !== lastSavedContentRef.current) {
          debouncedSaveRef.current(latestContentRef.current);
        }
      }
    }, [onSave, draftStorageKey]);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      flushLatestRef.current = flushLatest;
    }, [flushLatest]);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      saveLatestContentRef.current = (content: string) => {
        latestContentRef.current = content;
        void flushLatestRef.current();
      };
    }, []);

    useEffect(() => {
      const debounced = debouncedSaveRef.current;
      return () => {
        debounced.cancel();
        persistLocalDraftRef.current.cancel();
        emitContentChangeRef.current.cancel();
      };
    }, []);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      emitContentChangeRef.current = debounce((content: string) => {
        onContentChange?.(content);
      }, CONTENT_CHANGE_EMIT_MS) as DebouncedFunction<(content: string) => void>;

      return () => {
        emitContentChangeRef.current.cancel();
      };
    }, [onContentChange]);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      const flushOnBackground = () => {
        if (document.visibilityState === 'hidden') {
          debouncedSaveRef.current.cancel();
          void flushLatestRef.current();
        }
      };

      const flushOnUnload = () => {
        debouncedSaveRef.current.cancel();
      };

      document.addEventListener('visibilitychange', flushOnBackground);
      window.addEventListener('beforeunload', flushOnUnload);

      return () => {
        document.removeEventListener('visibilitychange', flushOnBackground);
        window.removeEventListener('beforeunload', flushOnUnload);
      };
    }, []);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      const timer = window.setInterval(() => {
        if (latestContentRef.current !== lastSavedContentRef.current) {
          void flushLatestRef.current();
        }
      }, NETWORK_FLUSH_INTERVAL_MS);

      return () => {
        window.clearInterval(timer);
      };
    }, []);

    useEffect(() => {
      if (!AUTOSAVE_ENABLED) return;
      const serverContent = note?.content ?? '';
      lastSavedContentRef.current = serverContent;
      latestContentRef.current = serverContent;

      if (!draftStorageKey) return;

      let cancelled = false;

      void (async () => {
        const draft = await getNoteDraft(draftStorageKey);
        if (!draft || !editor || cancelled) return;

        if (
          draft.content &&
          draft.content !== serverContent &&
          draft.noteUpdatedAt === note?.updatedAt
        ) {
          queueMicrotask(() => {
            if (!cancelled) {
              editor.commands.setContent(draft.content, false);
            }
          });
          latestContentRef.current = draft.content;
          setIsDirty(true);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [draftStorageKey, editor, note?.content, note?.updatedAt]);

    useEffect(() => {
      setIsDirty(false);
    }, [note?.id, note?.updatedAt]);

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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!AUTOSAVE_ENABLED && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleManualSave}
                  disabled={pendingSave || !isDirty}
                >
                  {pendingSave ? 'Saving…' : 'Save'}
                </Button>
              )}
              <Fade in={saveStatus !== null}>
                <Typography
                  variant="caption"
                  sx={{
                    color: (theme) =>
                      saveStatus === 'saving'
                        ? theme.palette.text.secondary
                        : theme.palette.success.main,
                    transition: 'color 0.2s ease',
                    ml: 0.5,
                  }}
                >
                  {saveStatus === 'saving' ? 'Saving…' : 'Saved'}
                </Typography>
              </Fade>
            </Box>
          </Box>
        </Box>
      </RichTextEditorProvider>
    );
  }
);

Editor.displayName = 'Editor';

export default memo(Editor);
