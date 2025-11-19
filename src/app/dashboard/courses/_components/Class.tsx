'use client';
import React from 'react';
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

interface Props {
  classId: string;
  textbookUrl: string;
}

export const ClassComponent: React.FC<Props> = ({ classId, textbookUrl }) => {
  const { data: session } = useSession();
  const isElevated = Number(session?.user?.role) === UserRole.Trainee;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  } = useClassroomLayout();
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
    />
  );

  const editorLoading = isLoading && !note;
  const noteData = note ?? undefined;

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
