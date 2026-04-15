import React, { useMemo, useState } from 'react';
import {
    Tabs,
    Tab,
    Alert,
} from '@mui/material';
import EDataGrid from '../../../../_components/EDataGrid';
import {
    HomeworkAssignmentDto,
    AssignmentDetailsDto,
    SubmittedHomework,
} from '../../../../../_lib/interfaces/types';
import { getStudentAssignments } from '../../../../../_lib/actions';
import HomeworkView from '../HomeworkView';
import GradedHomeworkComponent from '../../../../../_lib/components/homework/GradedHomeworkComponent';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import type { SeeAssignmentsAndPreviewProps } from './interfaces';
import { buildColumns } from './constants';
import {
    handleRowClick as handleRowClickUtil,
    confirmModuleOpen as confirmModuleOpenUtil,
    submitHomeworkAndRefresh,
} from './utils';
import {
    FlexColumnContainer,
    FlexColumnHiddenContainer,
    CenteredOverlayBox,
    TabContentBox,
    TabHeaderBox,
} from './elements';

export default function SeeAssignmentsAndPreview({
    canEdit,
    classId,
}: SeeAssignmentsAndPreviewProps) {
    const { data: session } = useSession();
    const [selectedAssignment, setSelectedAssignment] =
        useState<AssignmentDetailsDto | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<
        'graded' | 'submitted' | 'pending'
    >('pending');

    const userId = session?.user.id;
    const userRole = session?.user?.role ? Number(session.user.role) : null;
    const isStudent = userRole === UserRole.Trainee;

    const { data: allAssignments, isLoading } = useSWR<HomeworkAssignmentDto[]>(
        isStudent && userId ? ['student-assignments', userId] : null,
        () => getStudentAssignments(userId!),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 1,
            shouldRetryOnError: false,
            dedupingInterval: 60000,
            focusThrottleInterval: 300000,
            onError: (error) => {
                console.warn('Failed to load student assignments:', error);
            },
        },
    );

    const isDataLoading = !session || isLoading;

    const data = useMemo(() => {
        return allAssignments?.filter((a) => a.classroomId === classId);
    }, [allAssignments, classId]);

    const [activeTab, setActiveTab] = useState(0);
    const [pendingRowParams, setPendingRowParams] = useState<any>(null);

    const onRowClick = async (params: any) => {
        await handleRowClickUtil(
            params,
            setPendingRowParams,
            setSelectedStatus,
            setSelectedAssignment,
            setActiveTab,
        );
    };

    const onConfirmModuleOpen = async () => {
        await confirmModuleOpenUtil(
            pendingRowParams,
            setPendingRowParams,
            setSelectedStatus,
            setSelectedAssignment,
            setActiveTab,
        );
    };

    const handleBack = () => {
        setSelectedAssignment(null);
    };

    const handleHomeworkSubmit = async (submitted: SubmittedHomework) => {
        await submitHomeworkAndRefresh(
            submitted,
            selectedAssignment,
            userId,
            setSelectedAssignment,
        );
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const columns = useMemo(() => buildColumns(onRowClick), []);

    return (
        <>
            {!isStudent ? (
                <FlexColumnContainer>
                    <EDataGrid
                        rows={[]}
                        columns={columns}
                        getRowId={(r) => r.assignmentId || r.id}
                        disableRowSelectionOnClick={canEdit}
                        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                        pageSizeOptions={[10, 20, 50]}
                        slots={{
                            noRowsOverlay: () => (
                                <CenteredOverlayBox>
                                    <Alert severity="info">
                                        Only students can view enrolled assessments
                                    </Alert>
                                </CenteredOverlayBox>
                            ),
                        }}
                    />
                </FlexColumnContainer>
            ) : !selectedAssignment ? (
                <FlexColumnContainer>
                    <EDataGrid
                        rows={data || []}
                        columns={columns}
                        getRowId={(r) => r.assignmentId || r.id}
                        disableRowSelectionOnClick={canEdit}
                        onRowClick={onRowClick}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                        pageSizeOptions={[10, 20, 50]}
                        loading={isDataLoading}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'skeleton',
                                noRowsVariant: 'skeleton',
                            },
                        }}
                    />
                </FlexColumnContainer>
            ) : (
                <FlexColumnHiddenContainer>
                    <TabHeaderBox>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                        >
                            <Tab
                                label="Complete Assignment"
                                disabled={selectedStatus !== 'pending'}
                            />
                            <Tab
                                label="Graded Result"
                                disabled={selectedStatus === 'pending'}
                            />
                        </Tabs>
                    </TabHeaderBox>

                    <TabContentBox>
                        {activeTab === 0 && selectedStatus === 'pending' && (
                            <HomeworkView
                                homework={selectedAssignment.homework}
                                onSubmit={handleHomeworkSubmit}
                                onBack={handleBack}
                            />
                        )}
                        {activeTab === 1 && (selectedStatus === 'graded' || selectedStatus === 'submitted') && (
                            <GradedHomeworkComponent
                                gradedHomework={{
                                    homework: selectedAssignment.homework,
                                    answers: selectedAssignment.answers,
                                    grading: selectedAssignment.grading || {},
                                    overallComment: selectedAssignment.overallComment,
                                }}
                                onBack={handleBack}
                            />
                        )}
                    </TabContentBox>
                </FlexColumnHiddenContainer>
            )}

            <ConfirmDialog
                open={!!pendingRowParams}
                title="Open Assessment?"
                description={
                    <>
                        Once you open this assessment, you will be <strong>required to complete it</strong>.
                    </>
                }
                confirmText="Open Assessment"
                cancelText="Cancel"
                onConfirm={onConfirmModuleOpen}
                onCancel={() => setPendingRowParams(null)}
                confirmButtonProps={{ color: 'warning' }}
            />
        </>
    );
}
