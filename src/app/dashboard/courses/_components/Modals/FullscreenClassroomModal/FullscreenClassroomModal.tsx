import PDFViewer, {
    type PdfNoteLinkOptions,
} from '@/app/_lib/components/PDFViewer/PDFViewer';
import {
    Dialog,
    AppBar,
    Toolbar,
    Box,
    Slide,
    useMediaQuery,
    useTheme,
    Button,
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Splitter from '@devbookhq/splitter';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import SeeAssignmentsAndPreview from '../../Homework/SeeAssignmentsAndPreview';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import Editor, {
    type EditorHandle,
} from '@/app/_lib/components/TipTapEditor/Editor';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import type { FullScreenClassroomModalProps } from './interfaces';
import {
    ContentArea,
    FlexOutlinedWrapper,
    FlexOutlinedWrapperMinHeight,
    FlexColumnBox,
    TabHeaderBox,
    ToolbarSpacer,
} from './elements';
import { handleTabChange } from './utils';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<unknown> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenClassroomModal: React.FC<FullScreenClassroomModalProps> = ({
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

    const onTabChangeHandler = (_event: React.SyntheticEvent, newValue: string) => {
        handleTabChange(onTabChange, _event, newValue);
    };

    const editorPanel = (
        <FlexOutlinedWrapper>
            <Editor
                ref={editorRef as React.RefObject<EditorHandle> | undefined}
                note={note}
                loading={isLoading}
                onSave={handleSaveNote}
                onContentChange={onEditorContentChange}
                onPdfLinkClick={onPdfLinkClick}
            />
        </FlexOutlinedWrapper>
    );

    const tabsPanel = (
        <FlexOutlinedWrapperMinHeight>
            <TabContext value={currentTab}>
                <TabHeaderBox>
                    <TabList onChange={onTabChangeHandler} aria-label="course tabs">
                        <Tab label="Training Resource" value="1" />
                        <Tab label="Assessments" value="2" />
                    </TabList>
                </TabHeaderBox>
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
                    <FlexColumnBox>
                        <SeeAssignmentsAndPreview
                            classId={classId}
                            canEdit={canEdit}
                        />
                    </FlexColumnBox>
                </ConditionalTabPanel>
            </TabContext>
        </FlexOutlinedWrapperMinHeight>
    );

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
                    <ToolbarSpacer />
                    <Button variant="contained" onClick={onToggleNotes}>
                        {notesOpen ? 'Hide' : 'Show'} Notes
                    </Button>
                </Toolbar>
            </AppBar>
            <ContentArea>
                {isMobile ? (
                    notesOpen ? editorPanel : tabsPanel
                ) : notesOpen ? (
                    <Splitter
                        gutterClassName="custom-gutter-horizontal"
                        draggerClassName="custom-dragger-horizontal"
                        initialSizes={splitSizes}
                        onResizeFinished={onSplitResizeFinished}
                    >
                        {editorPanel}
                        {tabsPanel}
                    </Splitter>
                ) : (
                    tabsPanel
                )}
            </ContentArea>
        </Dialog>
    );
};

export default FullScreenClassroomModal;
