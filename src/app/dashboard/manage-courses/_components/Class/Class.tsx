'use client';

import React, { useState, useCallback } from 'react';
import { Button, Stack, Tab, Tooltip, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import type { Homework, HomeworkPayload, UserDto } from '@/app/_lib/interfaces/types';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import ConditionalTabPanel from '@/app/_lib/components/conditionalTabPanel';
import DataGridTabPanel from '@/app/_lib/components/tabs/DataGridTabPanel';
import DragDropFormBuilderModal from '../Modals/FormBuilderModal';
import StudentDatagridTable from '../Tables/StudentDatagridTable';
import ModulesDataGrid from '../DraftModulesDatagrid';
import StudentAssignmentsModal from '../Modals/StudentAssignmentsModal';
import type { StudentManagementComponentProps } from './types';
import {
    PageShell,
    ToolbarArea,
    ContentArea,
    TabHeaderBox,
    FlexMinHeightBox,
} from './elements';
import {
    handleModuleSubmit,
    handleEditDraftModule,
    createSeeHomeworkHandler,
} from './utils';

export default function StudentManagementComponent({
    userData,
    classDetails,
}: StudentManagementComponentProps) {
    const { data: session } = useSession();
    const params = useParams();
    const userRole = Number(session?.user?.role);
    const isElevated = userRole === UserRole.Instructor;
    const slug = params.slug as string;

    const decodedSlug = decodeURIComponent(slug);
    const classroomId = decodedSlug.split('~')[1] ?? '';

    const [builderOpen, setBuilderOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<UserDto | null>(null);
    const [assignmentsModalOpen, setAssignmentsModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
    const [modulesRefreshIndex, setModulesRefreshIndex] = useState(0);
    const [value, setValue] = useState('1');

    const handleChange = async (
        event: React.SyntheticEvent,
        newValue: string,
    ) => {
        setValue(newValue);
    };

    const onRefresh = useCallback(
        () => setModulesRefreshIndex((prev) => prev + 1),
        [],
    );

    const onModuleSubmit = useCallback(
        (homework: HomeworkPayload, options: { isDraft: boolean; homeworkId?: string }) =>
            handleModuleSubmit(homework, options, classDetails.teacherId, classroomId, onRefresh),
        [classDetails.teacherId, classroomId, onRefresh],
    );

    const onEditDraftModule = useCallback(
        (homeworkId: string) =>
            handleEditDraftModule(homeworkId, classDetails.teacherId, setEditingHomework, setBuilderOpen),
        [classDetails.teacherId],
    );

    const handleSeeHomeworkClick = useCallback(
        createSeeHomeworkHandler(isElevated, userData, setSelectedStudent, setAssignmentsModalOpen),
        [isElevated, userData],
    );

    const handleBuilderClose = useCallback(() => {
        setBuilderOpen(false);
        setEditingHomework(null);
    }, []);

    const handleAssignmentsClose = useCallback(() => {
        setAssignmentsModalOpen(false);
        setSelectedStudent(null);
    }, []);

    return (
        <PageShell>
            <ToolbarArea>
                <Stack spacing={1} direction="row">
                    <Tooltip
                        title={
                            !isElevated
                                ? 'Only the class instructor can create modules.'
                                : 'Create a new homework module with questions, due dates, and grading criteria for your trainees.'
                        }
                    >
                        <span>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setEditingHomework(null);
                                    setBuilderOpen(true);
                                }}
                                disabled={!isElevated}
                            >
                                Create module
                            </Button>
                        </span>
                    </Tooltip>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Click any row in the modules table to edit it. Use the action buttons for
                    publish, unpublish, or delete.
                </Typography>
            </ToolbarArea>
            <ContentArea>
                <OutlinedWrapper
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        width: '100%',
                        overflow: 'hidden',
                        minHeight: 0,
                    }}
                >
                    <DragDropFormBuilderModal
                        open={builderOpen}
                        onClose={handleBuilderClose}
                        onSubmit={onModuleSubmit}
                        initialHomework={editingHomework}
                    />

                    <TabContext value={value}>
                        <TabHeaderBox sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="manage courses">
                                <Tab label="All modules" value="1" />
                                <Tab label="Trainees" value="2" />
                            </TabList>
                        </TabHeaderBox>

                        <DataGridTabPanel value="1">
                            <FlexMinHeightBox>
                                <ModulesDataGrid
                                    teacherId={classDetails.teacherId}
                                    classroomId={classroomId}
                                    refreshIndex={modulesRefreshIndex}
                                    onEdit={onEditDraftModule}
                                    onAfterChange={onRefresh}
                                    onRowClick={(homeworkId) => onEditDraftModule(homeworkId)}
                                />
                            </FlexMinHeightBox>
                        </DataGridTabPanel>

                        <DataGridTabPanel value="2">
                            <FlexMinHeightBox>
                                <StudentDatagridTable
                                    userData={userData}
                                    usersLoading={false}
                                    handleSeeHomeworkClick={handleSeeHomeworkClick}
                                />
                            </FlexMinHeightBox>
                        </DataGridTabPanel>
                    </TabContext>
                </OutlinedWrapper>
            </ContentArea>
            <StudentAssignmentsModal
                open={assignmentsModalOpen}
                onClose={handleAssignmentsClose}
                student={selectedStudent}
                classId={classroomId}
            />
        </PageShell>
    );
}
