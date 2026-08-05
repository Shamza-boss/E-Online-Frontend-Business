import React, { type ReactNode, useCallback } from 'react';
import { Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';
import SeeAssignmentsAndPreview from '../../../Homework/SeeAssignmentsAndPreview';
import PDFViewer from '@/app/_lib/components/PDFViewer';
import type { PdfNoteLinkOptions } from '@/app/_lib/components/PDFViewer/types';
import type { PdfViewState } from '../../hooks/useClassroomLayout';
import type { TabsContentProps } from './types';
import { FlexColumnBox, TabHeaderBox } from './elements';

const AssignmentsPanel = ({
    classId,
    canEdit,
    onExamModeChange,
}: {
    classId: string;
    canEdit: boolean;
    onExamModeChange?: (isExamMode: boolean) => void;
}) => (
    <FlexColumnBox>
        <SeeAssignmentsAndPreview classId={classId} canEdit={canEdit} onExamModeChange={onExamModeChange} />
    </FlexColumnBox>
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
    <FlexColumnBox>
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
    </FlexColumnBox>
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
    examMode,
    onExamModeChange,
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
            <TabHeaderBox>
                <TabList onChange={(_e, value) => onTabChange(value)}>
                    <Tab label="Training Resource" value="1" disabled={examMode} />
                    <Tab label="Assessments" value="2" />
                </TabList>
            </TabHeaderBox>
            {renderPanel(
                '1',
                <ResourcesPanel
                    fileUrl={fileUrl}
                    pdfState={pdfState}
                    noteLinkOptions={noteLinkOptions}
                />
            )}
            {renderPanel('2', <AssignmentsPanel classId={classId} canEdit={canEdit} onExamModeChange={onExamModeChange} />)}
        </TabContext>
    );
};
