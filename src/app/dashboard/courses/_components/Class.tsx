'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

import { useClassroomNote } from '../../../_lib/hooks/useNotes';

import FullScreenClassroomModal from './Modals/FullscreenClassroomModal';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import { useClassroomLayout } from './Class/hooks/useClassroomLayout';
import { ClassToolbar } from './Class/components/ClassToolbar';
import { NotesPanel } from './Class/components/NotesPanel';
import { TabsContent } from './Class/components/TabsContent';
import { DesktopContent } from './Class/components/DesktopContent';
import { MobileContent } from './Class/components/MobileContent';
import type { EditorHandle } from '@/app/_lib/components/TipTapEditor/Editor';
import {
  buildPdfNoteLinkHtml,
  extractPdfNoteLinks,
  type PdfNoteLinkRequest,
  type PdfNoteLinkSummary,
} from '@/app/_lib/utils/pdfNoteLinks';
import type { PdfNoteLinkOptions } from '@/app/_lib/components/PDFViewer/PDFViewer';

interface Props {
  classId: string;
  textbookUrl: string;
}

export const ClassComponent: React.FC<Props> = ({ classId, textbookUrl }) => {
  const { data: session } = useSession();
  const isElevated = Number(session?.user?.role) === UserRole.Trainee;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pdfPersistKey = `${classId}:${textbookUrl}`;

  const {
    tabValue,
    setTabValue,
    isNotesOpen,
    toggleNotes,
    isFullscreen,
    toggleFullscreen,
    exitFullscreen,
    pdfState,
    splitSizes,
    onSplitResizeFinished,
  } = useClassroomLayout({ pdfPersistKey });
  const { data: note, isLoading, saveNote } = useClassroomNote(classId);

  const handleSave = async (html: string) => {
    await saveNote({ content: html });
  };

  const renderTabs = (variant: 'mobile' | 'desktop') => (
    <TabsContent
      variant={variant}
      tabValue={tabValue}
      onTabChange={setTabValue}
      classId={classId}
      canEdit={!isElevated}
      fileUrl={textbookUrl}
      pdfState={pdfState}
      noteLinkOptions={noteLinkOptions}
    />
  );

  const editorLoading = isLoading && !note;
  const noteData = note ?? undefined;
  const notesEditorRef = useRef<EditorHandle | null>(null);
  const fullscreenEditorRef = useRef<EditorHandle | null>(null);
  const [liveNoteContent, setLiveNoteContent] = useState<string>(note?.content ?? '');
  const [activeNoteLinkId, setActiveNoteLinkId] = useState<string | null>(null);

  const syncLiveNoteContent = useCallback((editor: EditorHandle) => {
    const html = editor.getHtml();
    if (typeof html === 'string') {
      setLiveNoteContent(html);
    }
  }, [setLiveNoteContent]);

  useEffect(() => {
    setLiveNoteContent(note?.content ?? '');
  }, [note?.content]);

  const handleEditorContentChange = useCallback((html: string) => {
    setLiveNoteContent(html);
  }, []);

  const noteLinks = useMemo(
    () => extractPdfNoteLinks(liveNoteContent, note?.id),
    [liveNoteContent, note?.id]
  );

  const ensureNotesVisible = useCallback(() => {
    if (!isNotesOpen) {
      toggleNotes();
      return true;
    }
    return false;
  }, [isNotesOpen, toggleNotes]);

  const ensurePdfVisible = useCallback(() => {
    setTabValue('2');
    if (isMobile && isNotesOpen) {
      toggleNotes();
    }
  }, [isMobile, isNotesOpen, setTabValue, toggleNotes]);

  const scrollAndPulseNoteChip = useCallback(
    (linkId: string, editorHandle?: EditorHandle | null) => {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return;
      }

      type QueryRoot = Document | HTMLElement;
      const selector = `[data-link-id="${linkId}"]`;
      const contexts: QueryRoot[] = [];
      const editorRoot = editorHandle?.getRootElement?.();
      if (editorRoot) {
        contexts.push(editorRoot);
      }
      contexts.push(document);

      window.requestAnimationFrame(() => {
        for (const context of contexts) {
          const chip = context.querySelector<HTMLElement>(selector);
          if (!chip) {
            continue;
          }
          chip.classList.remove('pdf-note-chip--pulse');
          void chip.offsetWidth;
          chip.classList.add('pdf-note-chip--pulse');
          chip.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      });
    },
    []
  );

  const withEditorHandle = useCallback(
    (task: (editor: EditorHandle) => void) => {
      const immediate =
        (isFullscreen ? fullscreenEditorRef.current : notesEditorRef.current) ??
        notesEditorRef.current ??
        fullscreenEditorRef.current;

      if (immediate) {
        task(immediate);
        return;
      }

      const opened = ensureNotesVisible();

      const timeout = opened ? 350 : 150;
      setTimeout(() => {
        const fallback = notesEditorRef.current ?? fullscreenEditorRef.current;
        if (fallback) {
          task(fallback);
          return;
        }
        console.warn('Unable to access notebook editor to insert PDF link.');
      }, timeout);
    },
    [ensureNotesVisible, isFullscreen]
  );


  const focusNoteChip = useCallback(
    (linkId: string) => {
      const notesJustOpened = ensureNotesVisible();
      const delay = notesJustOpened ? 350 : 0;
      const run = () =>
        withEditorHandle((editorHandle) => {
          scrollAndPulseNoteChip(linkId, editorHandle);
        });

      if (delay) {
        setTimeout(run, delay);
      } else {
        run();
      }
    },
    [ensureNotesVisible, scrollAndPulseNoteChip, withEditorHandle]
  );
  
  const handleCreateNoteLinkRequest = useCallback(
    (payload: PdfNoteLinkRequest) => {
      withEditorHandle((editorHandle) => {
        const { html, summary, attrs } = buildPdfNoteLinkHtml(payload);
        const inserted = editorHandle.insertPdfLink?.(attrs) ?? false;
        if (!inserted) {
          editorHandle.insertHtml(html);
        }
        syncLiveNoteContent(editorHandle);
        setActiveNoteLinkId(summary.id);
        scrollAndPulseNoteChip(summary.id, editorHandle);
      });
    },
    [withEditorHandle, scrollAndPulseNoteChip, syncLiveNoteContent]
  );

  const handleUpdateNoteLinkRequest = useCallback(
    (link: PdfNoteLinkSummary, payload: { title: string; color: string }) => {
      withEditorHandle((editorHandle) => {
        const updated = editorHandle.updatePdfLink?.(link.id, {
          chipLabel: payload.title,
          chipColor: payload.color,
        });
        if (updated) {
          syncLiveNoteContent(editorHandle);
          setActiveNoteLinkId(link.id);
          focusNoteChip(link.id);
        }
      });
    },
    [withEditorHandle, focusNoteChip, syncLiveNoteContent]
  );

  const handleNotebookPdfLinkClick = useCallback(
    (link: PdfNoteLinkSummary) => {
      setActiveNoteLinkId(link.id);
      ensurePdfVisible();
      pdfState.onPageChange(link.pageNumber);
    },
    [ensurePdfVisible, pdfState]
  );

  const handleOpenNoteFromSidebar = useCallback(
    (link: PdfNoteLinkSummary) => {
      setActiveNoteLinkId(link.id);
      focusNoteChip(link.id);
    },
    [focusNoteChip]
  );

  const handleSidebarLinkSelect = useCallback(
    (link: PdfNoteLinkSummary) => {
      setActiveNoteLinkId(link.id);
      ensurePdfVisible();
      pdfState.onPageChange(link.pageNumber);
      focusNoteChip(link.id);
    },
    [ensurePdfVisible, pdfState, focusNoteChip]
  );

  const noteFeaturesEnabled = !editorLoading;

  const noteLinkOptions: PdfNoteLinkOptions | undefined = useMemo(() => {
    if (!noteFeaturesEnabled) {
      return undefined;
    }

    return {
      enabled: true,
      links: noteLinks,
      activeLinkId: activeNoteLinkId,
      onCreateLink: handleCreateNoteLinkRequest,
      onOpenNote: handleOpenNoteFromSidebar,
      onSelectLink: handleSidebarLinkSelect,
      onUpdateLink: handleUpdateNoteLinkRequest,
    };
  }, [
    noteFeaturesEnabled,
    noteLinks,
    activeNoteLinkId,
    handleCreateNoteLinkRequest,
    handleOpenNoteFromSidebar,
    handleSidebarLinkSelect,
    handleUpdateNoteLinkRequest,
  ]);

  return (
    <>
      <FullScreenClassroomModal
        open={isFullscreen}
        canEdit={!isElevated}
        fileUrl={textbookUrl}
        isLoading={editorLoading}
        handleClose={exitFullscreen}
        handleSaveNote={handleSave}
        note={noteData}
        currentTab={tabValue}
        onTabChange={setTabValue}
        classId={classId}
        pdfState={pdfState}
        noteLinkOptions={noteLinkOptions}
        editorRef={fullscreenEditorRef}
        onEditorContentChange={handleEditorContentChange}
        onPdfLinkClick={handleNotebookPdfLinkClick}
      />

      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {GutterStyles()}

        <Box sx={{ flexShrink: 0, mb: 1 }}>
          <ClassToolbar
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            notesOpen={isNotesOpen}
            onToggleNotes={toggleNotes}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            flexGrow={1}
            overflow="hidden"
          >
            {isMobile ? (
              <MobileContent
                notesOpen={isNotesOpen}
                notesPanel={
                  <NotesPanel
                    note={noteData}
                    loading={editorLoading}
                    onSave={handleSave}
                    sx={{ overflow: 'hidden' }}
                    editorRef={notesEditorRef}
                    onContentChange={handleEditorContentChange}
                    onPdfLinkClick={handleNotebookPdfLinkClick}
                  />
                }
                renderTabs={() => renderTabs('mobile')}
              />
            ) : (
              <DesktopContent
                notesOpen={isNotesOpen}
                notesPanel={
                  <NotesPanel
                    note={noteData}
                    loading={editorLoading}
                    onSave={handleSave}
                    editorRef={notesEditorRef}
                    onContentChange={handleEditorContentChange}
                    onPdfLinkClick={handleNotebookPdfLinkClick}
                  />
                }
                renderTabs={() => renderTabs('desktop')}
                splitSizes={splitSizes}
                onSplitResizeFinished={onSplitResizeFinished}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
