import PDFViewer, {
  type PdfNoteLinkOptions,
} from '@/app/_lib/components/PDFViewer/PDFViewer';
import { NoteDto } from '@/app/_lib/interfaces/types';
import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Slide,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { NextPage } from 'next';
import Splitter from '@devbookhq/splitter';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import SeeAssignmentsAndPreview from '../Homework/SeeAssignmentsAndPreview';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Editor, {
  type EditorHandle,
} from '@/app/_lib/components/TipTapEditor/Editor';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import type { PdfNoteLinkSummary } from '@/app/_lib/utils/pdfNoteLinks';

interface FullScreenClassroomModalProps {
  open: boolean;
  canEdit: boolean;
  fileUrl: string;
  isLoading: boolean;
  note: NoteDto | undefined;
  handleSaveNote: (noteContent: string) => void | Promise<void>;
  handleClose: () => void;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  classId: string;
  pdfState: {
    currentPage: number;
    zoom: number;
    outline: boolean;
    onPageChange: (page: number) => void;
    onZoomChange: (zoom: number) => void;
    onOutlineChange: (show: boolean) => void;
  };
  noteLinkOptions?: PdfNoteLinkOptions;
  editorRef?:
  | React.RefObject<EditorHandle | null>
  | React.MutableRefObject<EditorHandle | null>;
  onEditorContentChange?: (html: string) => void;
  onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
  notesOpen: boolean;
  onToggleNotes: () => void;
  splitSizes: number[];
  onSplitResizeFinished: (gutterIdx: number, sizes: number[]) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenClassroomModal: NextPage<FullScreenClassroomModalProps> = ({
  open,
  canEdit,
  fileUrl,
  isLoading,
  note,
  handleSaveNote,
  handleClose,
  currentTab = '1',
  onTabChange,
  classId,
  pdfState,
  noteLinkOptions,
  editorRef,
  onEditorContentChange,
  onPdfLinkClick,
  notesOpen,
  onToggleNotes,
  splitSizes,
  onSplitResizeFinished,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange?.(newValue);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slots={{ transition: Transition }}
      title="Course Fullscreen Mode"
    >
      <AppBar position="static">
        <Toolbar>
          <Button
            variant="outlined"
            startIcon={<FullscreenExitIcon />}
            onClick={handleClose}
          >
            Exit Fullscreen
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={onToggleNotes}>
            {notesOpen ? 'Hide' : 'Show'} Notes
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 1,
          minHeight: 0,
          bgcolor: 'background.default',
        }}
      >
        {isMobile ? (
          // Mobile layout - toggle between notes and tabs
          notesOpen ? (
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
                ref={editorRef as React.RefObject<EditorHandle> | undefined}
                note={note}
                loading={isLoading}
                onSave={handleSaveNote}
                onContentChange={onEditorContentChange}
                onPdfLinkClick={onPdfLinkClick}
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
              <TabContext value={currentTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="course tabs"
                  >
                    <Tab label="Training Resource" value="1" />
                    <Tab label="Assessments" value="2" />
                  </TabList>
                </Box>
                <ConditionalTabPanel value={currentTab} index="1">
                  <PDFViewer
                    fileUrl={fileUrl}
                    initialPage={pdfState.currentPage}
                    initialZoom={pdfState.zoom}
                    showOutline={pdfState.outline}
                    onPageChange={pdfState.onPageChange}
                    onZoomChange={pdfState.onZoomChange}
                    onOutlineChange={pdfState.onOutlineChange}
                    noteLinkOptions={noteLinkOptions}
                  />
                </ConditionalTabPanel>
                <ConditionalTabPanel value={currentTab} index="2">
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
                      canEdit={canEdit}
                    />
                  </Box>
                </ConditionalTabPanel>
              </TabContext>
            </OutlinedWrapper>
          )
        ) : notesOpen ? (
          // Desktop layout with notes - Splitter with notes + tabs
          <Splitter
            gutterClassName="custom-gutter-horizontal"
            draggerClassName="custom-dragger-horizontal"
            initialSizes={splitSizes}
            onResizeFinished={onSplitResizeFinished}
          >
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
                ref={editorRef as React.RefObject<EditorHandle> | undefined}
                note={note}
                loading={isLoading}
                onSave={handleSaveNote}
                onContentChange={onEditorContentChange}
                onPdfLinkClick={onPdfLinkClick}
              />
            </OutlinedWrapper>

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
              <TabContext value={currentTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="course tabs">
                    <Tab label="Training Resource" value="1" />
                    <Tab label="Assessments" value="2" />
                  </TabList>
                </Box>
                <ConditionalTabPanel value={currentTab} index="1">
                  <PDFViewer
                    fileUrl={fileUrl}
                    initialPage={pdfState.currentPage}
                    initialZoom={pdfState.zoom}
                    showOutline={pdfState.outline}
                    onPageChange={pdfState.onPageChange}
                    onZoomChange={pdfState.onZoomChange}
                    onOutlineChange={pdfState.onOutlineChange}
                    noteLinkOptions={noteLinkOptions}
                  />
                </ConditionalTabPanel>
                <ConditionalTabPanel value={currentTab} index="2">
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
                      canEdit={canEdit}
                    />
                  </Box>
                </ConditionalTabPanel>
              </TabContext>
            </OutlinedWrapper>
          </Splitter>
        ) : (
          // Desktop layout without notes - just tabs
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
            <TabContext value={currentTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="course tabs">
                  <Tab label="Training Resource" value="1" />
                  <Tab label="Assessments" value="2" />
                </TabList>
              </Box>
              <ConditionalTabPanel value={currentTab} index="1">
                <PDFViewer
                  fileUrl={fileUrl}
                  initialPage={pdfState.currentPage}
                  initialZoom={pdfState.zoom}
                  showOutline={pdfState.outline}
                  onPageChange={pdfState.onPageChange}
                  onZoomChange={pdfState.onZoomChange}
                  onOutlineChange={pdfState.onOutlineChange}
                  noteLinkOptions={noteLinkOptions}
                />
              </ConditionalTabPanel>
              <ConditionalTabPanel value={currentTab} index="2">
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
                    canEdit={canEdit}
                  />
                </Box>
              </ConditionalTabPanel>
            </TabContext>
          </OutlinedWrapper>
        )}
      </Box>
    </Dialog>
  );
};

export default FullScreenClassroomModal;
