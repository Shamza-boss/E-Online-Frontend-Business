'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import Splitter from '@devbookhq/splitter';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

import { useClassroomNote } from '../../../_lib/hooks/useNotes';

import PDFViewer from '../../../_lib/components/PDFViewer/PDFViewer';
import FullScreenClassroomModal from './Modals/FullscreenClassroomModal';
import Editor from '@/app/_lib/components/TipTapEditor/Editor';
import SeeAssignmentsAndPreview from './Homework/SeeAssignmentsAndPreview';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { OutlinedWrapper } from '../../../_lib/components/shared-theme/customizations/OutlinedWrapper';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';

interface Props {
  classId: string;
  textbookUrl: string;
}

export const ClassComponent: React.FC<Props> = ({ classId, textbookUrl }) => {
  const { data: session } = useSession();
  const isElevated = Number(session?.user?.role) === UserRole.Trainee;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabVal, setTab] = useState('1');
  const [openBook, setOpenBook] = useState(false);
  const [isFs, setFs] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [currentPage, setPg] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [outline, setOutline] = useState(false);
  const { data: note, isLoading, saveNote } = useClassroomNote(classId);

  const handleSave = async (html: string) => {
    await saveNote({ content: html });
  };

  const toggleFs = () => {
    setFs((f) => !f);
    if (isFs) setPdfKey((k) => k + 1);
    else !openBook && setOpenBook(true);
  };

  const editorLoading = isLoading && !note;
  const noteData = note ?? undefined;

  return (
    <>
      <FullScreenClassroomModal
        open={isFs}
        canEdit={!isElevated}
        fileUrl={textbookUrl}
        isLoading={editorLoading}
        handleClose={() => setFs(false)}
        handleSaveNote={handleSave}
        note={noteData}
        currentTab={tabVal}
        onTabChange={setTab}
        classId={classId}
        pdfState={{
          currentPage,
          zoom,
          outline,
          onPageChange: setPg,
          onZoomChange: setZoom,
          onOutlineChange: setOutline,
        }}
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
          <Stack spacing={1} direction="row" alignItems="center">
            <Tooltip title="Fullscreen">
              <IconButton onClick={toggleFs}>
                {isFs ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>

            <Button variant="outlined" onClick={() => setOpenBook((o) => !o)}>
              {openBook ? 'Hide' : 'Show'} notes
            </Button>
          </Stack>
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
              openBook ? (
                <OutlinedWrapper sx={{ flex: 1, overflow: 'hidden' }}>
                  <Editor
                    note={noteData}
                    loading={editorLoading}
                    onSave={handleSave}
                  />
                </OutlinedWrapper>
              ) : (
                <OutlinedWrapper
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  <TabContext value={tabVal}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={(_e, v) => setTab(v)}>
                        <Tab label="Modules" value="1" />
                        <Tab label="Resources" value="2" />
                      </TabList>
                    </Box>

                    <ConditionalTabPanel value={tabVal} index="1">
                      <SeeAssignmentsAndPreview
                        classId={classId}
                        canEdit={!isElevated}
                      />
                    </ConditionalTabPanel>
                    <ConditionalTabPanel value={tabVal} index="2">
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                        }}
                      >
                        <PDFViewer
                          key={`pdf-${currentPage}-${pdfKey}`}
                          fileUrl={textbookUrl}
                          initialPage={currentPage}
                          initialZoom={zoom}
                          showOutline={outline}
                          onPageChange={setPg}
                          onZoomChange={setZoom}
                          onOutlineChange={setOutline}
                        />
                      </Box>
                    </ConditionalTabPanel>
                  </TabContext>
                </OutlinedWrapper>
              )
            ) : (
              // Desktop Splitter
              <Splitter
                gutterClassName="custom-gutter-horizontal"
                draggerClassName="custom-dragger-horizontal"
              >
                {openBook && (
                  <OutlinedWrapper
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <Editor
                      note={noteData}
                      loading={editorLoading}
                      onSave={handleSave}
                    />
                  </OutlinedWrapper>
                )}

                <OutlinedWrapper
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  <TabContext value={tabVal}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={(_e, v) => setTab(v)}>
                        <Tab label="Modules" value="1" />
                        <Tab label="Resources" value="2" />
                      </TabList>
                    </Box>
                    <DataGridTabPanel value="1">
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                        }}
                      >
                        <SeeAssignmentsAndPreview
                          classId={classId}
                          canEdit={!isElevated}
                        />
                      </Box>
                    </DataGridTabPanel>
                    <DataGridTabPanel value="2">
                      <PDFViewer
                        key={`pdf-${currentPage}-${pdfKey}`}
                        fileUrl={textbookUrl}
                        initialPage={currentPage}
                        initialZoom={zoom}
                        showOutline={outline}
                        onPageChange={setPg}
                        onZoomChange={setZoom}
                        onOutlineChange={setOutline}
                      />
                    </DataGridTabPanel>
                  </TabContext>
                </OutlinedWrapper>
              </Splitter>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
