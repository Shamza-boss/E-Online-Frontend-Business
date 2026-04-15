'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

import { useClassroomNote } from '../../../../_lib/hooks/useNotes';

import FullScreenClassroomModal from '../Modals/FullscreenClassroomModal';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import { useClassroomLayout } from './hooks/useClassroomLayout';
import { ClassToolbar } from './components/ClassToolbar';
import { NotesPanel } from './components/NotesPanel';
import { TabsContent } from './components/TabsContent';
import { DesktopContent } from './components/DesktopContent';
import { MobileContent } from './components/MobileContent';
import type { EditorHandle } from '@/app/_lib/components/TipTapEditor/Editor';
import {
    extractPdfNoteLinks,
    type PdfNoteLinkRequest,
    type PdfNoteLinkSummary,
} from '@/app/_lib/utils/pdfNoteLinks';
import type { PdfNoteLinkOptions } from '@/app/_lib/components/PDFViewer/PDFViewer';
import type { ClassComponentProps } from './interfaces';
import { ClassShell, ToolbarRow, ContentArea, InnerColumn } from './elements';
import {
    focusNoteChip as focusNoteChipUtil,
    handleCreateNoteLinkRequest as createNoteLinkUtil,
    handleUpdateNoteLinkRequest as updateNoteLinkUtil,
} from './utils';

export const ClassComponent: React.FC<ClassComponentProps> = ({ classId, textbookUrl }) => {
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

    useEffect(() => {
        setLiveNoteContent(note?.content ?? '');
    }, [note?.content]);

    const handleEditorContentChange = useCallback((html: string) => {
        setLiveNoteContent(html);
    }, []);

    const noteLinks = useMemo(
        () => extractPdfNoteLinks(liveNoteContent, note?.id),
        [liveNoteContent, note?.id],
    );

    const ensureNotesVisible = useCallback(() => {
        if (!isNotesOpen) {
            toggleNotes();
            return true;
        }
        return false;
    }, [isNotesOpen, toggleNotes]);

    const ensurePdfVisible = useCallback(() => {
        setTabValue('1');
        if (isMobile && isNotesOpen) {
            toggleNotes();
        }
    }, [isMobile, isNotesOpen, setTabValue, toggleNotes]);

    const handleCreateNoteLink = useCallback(
        (payload: PdfNoteLinkRequest) => {
            createNoteLinkUtil(
                payload,
                isFullscreen,
                fullscreenEditorRef,
                notesEditorRef,
                ensureNotesVisible,
                setLiveNoteContent,
                setActiveNoteLinkId,
            );
        },
        [ensureNotesVisible, isFullscreen],
    );

    const handleUpdateNoteLink = useCallback(
        (link: PdfNoteLinkSummary, payload: { title: string; color: string }) => {
            updateNoteLinkUtil(
                link,
                payload,
                isFullscreen,
                fullscreenEditorRef,
                notesEditorRef,
                ensureNotesVisible,
                setLiveNoteContent,
                setActiveNoteLinkId,
            );
        },
        [ensureNotesVisible, isFullscreen],
    );

    const handleNotebookPdfLinkClick = useCallback(
        (link: PdfNoteLinkSummary) => {
            setActiveNoteLinkId(link.id);
            ensurePdfVisible();
            pdfState.onPageChange(link.pageNumber);
        },
        [ensurePdfVisible, pdfState],
    );

    const handleOpenNoteFromSidebar = useCallback(
        (link: PdfNoteLinkSummary) => {
            setActiveNoteLinkId(link.id);
            focusNoteChipUtil(
                link.id,
                ensureNotesVisible,
                isFullscreen,
                fullscreenEditorRef,
                notesEditorRef,
            );
        },
        [ensureNotesVisible, isFullscreen],
    );

    const handleSidebarLinkSelect = useCallback(
        (link: PdfNoteLinkSummary) => {
            setActiveNoteLinkId(link.id);
            ensurePdfVisible();
            pdfState.onPageChange(link.pageNumber);
            focusNoteChipUtil(
                link.id,
                ensureNotesVisible,
                isFullscreen,
                fullscreenEditorRef,
                notesEditorRef,
            );
        },
        [ensurePdfVisible, pdfState, ensureNotesVisible, isFullscreen],
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
            onCreateLink: handleCreateNoteLink,
            onOpenNote: handleOpenNoteFromSidebar,
            onSelectLink: handleSidebarLinkSelect,
            onUpdateLink: handleUpdateNoteLink,
        };
    }, [
        noteFeaturesEnabled,
        noteLinks,
        activeNoteLinkId,
        handleCreateNoteLink,
        handleOpenNoteFromSidebar,
        handleSidebarLinkSelect,
        handleUpdateNoteLink,
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
                notesOpen={isNotesOpen}
                onToggleNotes={toggleNotes}
                splitSizes={splitSizes}
                onSplitResizeFinished={onSplitResizeFinished}
            />

            <ClassShell>
                {GutterStyles()}

                <ToolbarRow>
                    <ClassToolbar
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                        notesOpen={isNotesOpen}
                        onToggleNotes={toggleNotes}
                    />
                </ToolbarRow>
                <ContentArea>
                    <InnerColumn>
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
                    </InnerColumn>
                </ContentArea>
            </ClassShell>
        </>
    );
};
