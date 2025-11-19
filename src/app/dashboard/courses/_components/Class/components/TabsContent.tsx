import React, { ReactNode, useCallback } from 'react';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';

import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';
import SeeAssignmentsAndPreview from '../../Homework/SeeAssignmentsAndPreview';
import PDFViewer, {
    type PdfNoteLinkOptions,
} from '@/app/_lib/components/PDFViewer/PDFViewer';
import type { PdfViewState } from '../hooks/useClassroomLayout';

interface TabsContentProps {
    variant: 'mobile' | 'desktop';
    tabValue: string;
    onTabChange: (value: string) => void;
    classId: string;
    canEdit: boolean;
    fileUrl: string;
    pdfState: PdfViewState;
    noteLinkOptions?: PdfNoteLinkOptions;
}

const AssignmentsPanel = ({
    classId,
    canEdit,
}: {
    classId: string;
    canEdit: boolean;
}) => (
    <Box
        sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
        }}
    >
        <SeeAssignmentsAndPreview classId={classId} canEdit={canEdit} />
    </Box>
);

const ResourcesPanel = ({
    fileUrl,
    pdfState,
    noteLinkOptions,
}: {
    fileUrl: string;
    pdfState: PdfViewState;
    noteLinkOptions?: PdfNoteLinkOptions;
}) => (
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
            fileUrl={fileUrl}
            initialPage={pdfState.currentPage}
            initialZoom={pdfState.zoom}
            showOutline={pdfState.outline}
            onPageChange={pdfState.onPageChange}
            onZoomChange={pdfState.onZoomChange}
            onOutlineChange={pdfState.onOutlineChange}
            noteLinkOptions={noteLinkOptions}
        />
    </Box>
);

export const TabsContent: React.FC<TabsContentProps> = ({
    variant,
    tabValue,
    onTabChange,
    classId,
    canEdit,
    fileUrl,
    pdfState,
    noteLinkOptions,
}) => {
    const renderPanel = useCallback(
        (panel: '1' | '2', children: ReactNode) => {
            if (variant === 'mobile') {
                return (
                    <ConditionalTabPanel key={`mobile-panel-${panel}`} value={tabValue} index={panel}>
                        {children}
                    </ConditionalTabPanel>
                );
            }

            return (
                <DataGridTabPanel key={`desktop-panel-${panel}`} value={panel}>
                    {children}
                </DataGridTabPanel>
            );
        },
        [variant, tabValue]
    );

    return (
        <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(_e, value) => onTabChange(value)}>
                    <Tab label="Modules" value="1" />
                    <Tab label="Resources" value="2" />
                </TabList>
            </Box>
            {renderPanel('1', <AssignmentsPanel classId={classId} canEdit={canEdit} />)}
            {renderPanel(
                '2',
                <ResourcesPanel
                    fileUrl={fileUrl}
                    pdfState={pdfState}
                    noteLinkOptions={noteLinkOptions}
                />
            )}
        </TabContext>
    );
};
