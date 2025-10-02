import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import { NoteDto } from '@/app/_lib/interfaces/types';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Slide,
  Tooltip,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Switch,
  alpha,
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { NextPage } from 'next';
import Splitter from '@devbookhq/splitter';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import SeeAssignmentsAndPreview from '../Homework/SeeAssignmentsAndPreview';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Editor from '@/app/_lib/components/TipTapEditor/Editor';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';

interface FullScreenClassroomModalProps {
  open: boolean;
  canEdit: boolean;
  fileUrl: string;
  isLoading: boolean;
  note: NoteDto | undefined;
  handleSaveNote: (noteContent: string) => void;
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
  chain?: NoteDto[];
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
  chain,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showTextbook, setShowTextbook] = useState(false);
  const [value, setValue] = useState(currentTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slotProps={{ transition: Transition }}
      keepMounted
      title="Classroom Fullscreen Mode"
    >
      <AppBar
        position="static"
        sx={{
          color: 'text.primary',
          boxShadow: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Tooltip title={'Exit fullscreen mode'}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <FullscreenExitIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Fullscreen View
          </Typography>
          {isMobile && (
            <Box sx={{ m: 1, mx: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showTextbook}
                    onChange={() => setShowTextbook((prev) => !prev)}
                    color="secondary"
                  />
                }
                label={
                  showTextbook
                    ? 'Show Textbook'
                    : value === '1'
                      ? 'Show Notes'
                      : 'Show Assignments'
                }
              />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 1,
          minHeight: 0,
          backgroundColor: alpha(theme.palette.background.default, 1),
        }}
      >
        {isMobile ? (
          // Mobile layout - toggle between textbook and content based on switch
          showTextbook ? (
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
                note={note}
                loading={isLoading}
                onSave={handleSaveNote}
                chain={chain}
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
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Modules" value="1" />
                    <Tab label="Resources" value="2" />
                  </TabList>
                </Box>
                <ConditionalTabPanel value={value} index="1">
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
                <ConditionalTabPanel value={value} index="2">
                  <PDFViewer
                    key={`pdf-${pdfState.currentPage}`}
                    fileUrl={fileUrl}
                    initialPage={pdfState.currentPage}
                    initialZoom={pdfState.zoom}
                    showOutline={pdfState.outline}
                    onPageChange={pdfState.onPageChange}
                    onZoomChange={pdfState.onZoomChange}
                    onOutlineChange={pdfState.onOutlineChange}
                  />
                </ConditionalTabPanel>
              </TabContext>
            </OutlinedWrapper>
          )
        ) : (
          // Desktop layout - always show PDF in split view, but optimize space based on tab
          <Splitter
            gutterClassName="custom-gutter-horizontal"
            draggerClassName="custom-dragger-horizontal"
            initialSizes={value === '2' ? [30, 70] : [50, 50]} // Give homework more space
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
                note={note}
                loading={isLoading}
                onSave={handleSaveNote}
                chain={chain}
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
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="classroom tabs">
                    <Tab label="Modules" value="1" />
                    <Tab label="Resources" value="2" />
                  </TabList>
                </Box>
                <ConditionalTabPanel value={value} index="1">
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
                      canEdit={canEdit ?? false}
                    />
                  </Box>
                </ConditionalTabPanel>
                <ConditionalTabPanel value={value} index="2">
                  <PDFViewer
                    fileUrl={fileUrl}
                    initialPage={pdfState.currentPage}
                    initialZoom={pdfState.zoom}
                    showOutline={pdfState.outline}
                    onPageChange={pdfState.onPageChange}
                    onZoomChange={pdfState.onZoomChange}
                    onOutlineChange={pdfState.onOutlineChange}
                  />
                </ConditionalTabPanel>
              </TabContext>
            </OutlinedWrapper>
          </Splitter>
        )}
      </Box>
    </Dialog>
  );
};

export default FullScreenClassroomModal;
