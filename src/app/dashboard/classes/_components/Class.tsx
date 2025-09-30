'use client';
import React, { useRef, useState } from 'react';
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
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import Splitter from '@devbookhq/splitter';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';

import {
  useNoteChain,
  useNoteDates,
  useNoteSlice,
} from '../../../_lib/hooks/useNotes';
import { NoteDto } from '../../../_lib/interfaces/types';

import PDFViewer from '../../../_lib/components/PDFViewer/PDFViewer';
import FullScreenClassroomModal from './Modals/FullscreenClassroomModal';
import Editor, {
  EditorHandle,
} from '@/app/_lib/components/TipTapEditor/Editor';
import SeeAssignmentsAndPreview from './Homework/SeeAssignmentsAndPreview';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { OutlinedWrapper } from '../../../_lib/components/shared-theme/customizations/OutlinedWrapper';
import { GutterStyles } from '@/app/_lib/components/shared-theme/customizations/SplitterComponent';

interface Props {
  classId: string;
  textbookUrl: string;
}

export const ClassComponent: React.FC<Props> = ({ classId, textbookUrl }) => {
  const DIVIDER = '<hr data-type="day-divider" />';
  const { data: session } = useSession();
  const isElevated = Number(session?.user?.role) === UserRole.Student;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabVal, setTab] = useState('1');
  const [openBook, setOpenBook] = useState(false);
  const [isFs, setFs] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [currentPage, setPg] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [outline, setOutline] = useState(false);
  const todayIso = dayjs().format('YYYY-MM-DD');
  const yesterdayIso = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  const [baseDateIso, setBase] = useState<string | undefined>(undefined);
  const [pickerOpen, setPOpen] = useState(false);
  const [mergedContent, setMergedContent] = useState<string | undefined>();
  const [continueLoading, setContinueLoading] = useState(false);
  const [yLoading, setYLoading] = useState(false);

  const {
    data: chain,
    isLoading,
    updateSlice,
  } = useNoteChain(classId, baseDateIso);
  const { data: enabledDates } = useNoteDates(classId);
  const { data: yesterdayNote } = useNoteSlice(classId, yesterdayIso);

  const todayNote: NoteDto | undefined =
    chain && chain.length ? chain[chain.length - 1] : undefined;
  const { data: pastNote } = useNoteSlice(classId, baseDateIso);

  const editorRef = useRef<EditorHandle | null>(null);

  const handleSave = async (html: string) => {
    if (!todayNote) return;
    setMergedContent(html);
    await updateSlice({ ...todayNote, content: html });
  };

  const handleInsertYesterdayLink = () => {
    if (!yesterdayNote || !editorRef.current) return;

    const prettyDate = dayjs(yesterdayNote.noteDate).format('MMM DD');
    const linkHtml = `<a href="#" data-note-id="${yesterdayNote.id}" class="note-link">Yesterday’s note (${prettyDate})</a>`;

    editorRef.current.insertHtml(linkHtml);
  };

  const handleContinueYesterday = async () => {
    if (!yesterdayNote || !todayNote) return;
    setYLoading(true);

    try {
      const merged = `${(mergedContent ?? todayNote.content) || ''}${DIVIDER}${yesterdayNote.content}`;
      setMergedContent(merged);
      await updateSlice({ ...todayNote, content: merged });
    } finally {
      setYLoading(false);
    }
  };

  const handleContinuePastDay = async () => {
    if (!pastNote || !todayNote) return;
    setContinueLoading(true);
    const merged = `${(mergedContent ?? todayNote.content) || ''}${DIVIDER}${pastNote.content}`;
    try {
      setMergedContent(merged);
      await updateSlice({ ...todayNote, content: merged });
      setBase(undefined);
    } finally {
      setContinueLoading(false);
    }
  };

  const toggleFs = () => {
    setFs((f) => !f);
    if (isFs) setPdfKey((k) => k + 1);
    else !openBook && setOpenBook(true);
  };

  return (
    <>
      <FullScreenClassroomModal
        open={isFs}
        canEdit={!isElevated}
        fileUrl={textbookUrl}
        isLoading={isLoading}
        handleClose={() => setFs(false)}
        handleSaveNote={handleSave}
        note={todayNote}
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
        chain={chain}
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
              {openBook ? 'Hide' : 'Show'} textbook
            </Button>
            {!baseDateIso && (
              <Tooltip
                title={'Append work from yesterdays notes into todays note'}
              >
                <Button
                  variant="outlined"
                  disabled={isLoading || !todayNote}
                  onClick={handleContinueYesterday}
                >
                  Continue yesterday
                </Button>
              </Tooltip>
            )}
            {/* {!baseDateIso && yesterdayNote && (
              <Button
                variant="outlined"
                disabled={isLoading || yLoading}
                onClick={handleInsertYesterdayLink}
              >
                Link yesterday
              </Button>
            )} */}

            {baseDateIso && baseDateIso !== todayIso && (
              <Tooltip
                title={
                  'Append work from the current selected note into todays note'
                }
              >
                <Button
                  variant="outlined"
                  onClick={handleContinuePastDay}
                  disabled={continueLoading}
                >
                  Continue this day
                </Button>
              </Tooltip>
            )}

            <Tooltip title={'Choose some a date to see work from past note'}>
              <DatePicker
                open={pickerOpen}
                onClose={() => setPOpen(false)}
                value={baseDateIso ? dayjs(baseDateIso) : null}
                onChange={(d) => {
                  if (!d) return;
                  setBase(d.format('YYYY-MM-DD'));
                  setPOpen(false);
                }}
                disableHighlightToday
                slots={{
                  field: (props) => (
                    <Button
                      variant="outlined"
                      onClick={() => setPOpen(true)}
                      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
                      sx={{ minWidth: 'fit-content' }}
                    >
                      {props.value
                        ? dayjs(props.value).format('MMM D YYYY')
                        : 'Pick a date'}
                    </Button>
                  ),
                  day: (props) => {
                    const iso = props.day.format('YYYY-MM-DD');
                    const enabled = enabledDates?.includes(iso);
                    return <PickersDay {...props} disabled={!enabled} />;
                  },
                }}
                slotProps={{
                  nextIconButton: { size: 'small' },
                  previousIconButton: { size: 'small' },
                }}
              />
            </Tooltip>
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
            height="84.5vh"
            width="100%"
            maxHeight="84.5vh"
            overflow="hidden"
          >
            {isMobile ? (
              openBook ? (
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
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
                        <Tab label="Class notes" value="1" />
                        <Tab label="Assignments" value="2" />
                      </TabList>
                    </Box>

                    <ConditionalTabPanel value={tabVal} index="1">
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                        }}
                      >
                        <Editor
                          ref={editorRef}
                          note={
                            todayNote && {
                              ...todayNote,
                              content: mergedContent ?? todayNote.content,
                            }
                          }
                          loading={isLoading || continueLoading || yLoading}
                          onSave={handleSave}
                          chain={chain}
                        />
                      </Box>
                    </ConditionalTabPanel>

                    <ConditionalTabPanel value={tabVal} index="2">
                      <SeeAssignmentsAndPreview
                        classId={classId}
                        canEdit={!isElevated}
                      />
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
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      overflow: 'hidden',
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
                        <Tab label="Class notes" value="1" />
                        <Tab label="Assignments" value="2" />
                      </TabList>
                    </Box>

                    <ConditionalTabPanel value={tabVal} index="1">
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: 0,
                        }}
                      >
                        <Editor
                          ref={editorRef}
                          note={
                            todayNote && {
                              ...todayNote,
                              content: mergedContent ?? todayNote.content,
                            }
                          }
                          loading={isLoading || continueLoading || yLoading}
                          onSave={handleSave}
                          chain={chain}
                        />
                      </Box>
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
                        <SeeAssignmentsAndPreview
                          classId={classId}
                          canEdit={!isElevated}
                        />
                      </Box>
                    </ConditionalTabPanel>
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
