import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Tabs,
    Tab,
    Alert,
    Button,
    Dialog,
    Stack,
    Typography,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EDataGrid from '../../../../_components/EDataGrid';
import {
    type HomeworkAssignmentDto,
    type AssignmentDetailsDto,
    type SubmittedHomework,
} from '../../../../../_lib/interfaces/types';
import { getStudentAssignments, resetAssignment } from '../../../../../_lib/actions';
import HomeworkView from '../HomeworkView';
import GradedHomeworkComponent from '../../../../../_lib/components/homework/GradedHomeworkComponent';
import useSWR, { mutate } from 'swr';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { formatSaDateTime } from '@/app/_lib/utils/datetime';
import type { SeeAssignmentsAndPreviewProps } from './types';
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
    onExamModeChange,
}: SeeAssignmentsAndPreviewProps) {
    const { data: session } = useSession();
    const { showAlert } = useAlert();
    const [selectedAssignment, setSelectedAssignment] =
        useState<AssignmentDetailsDto | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<
        'graded' | 'submitted' | 'pending'
    >('pending');
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [examFullscreen, setExamFullscreen] = useState(false);

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

    // Determine if current assignment is an exam
    const isExamMode = Boolean(selectedAssignment?.homework?.isExam);

    // Notify parent about exam mode changes
    useEffect(() => {
        onExamModeChange?.(isExamMode && selectedStatus === 'pending');
    }, [isExamMode, selectedStatus, onExamModeChange]);

    // Exam scheduled check
    const examScheduledAt = selectedAssignment?.homework?.scheduledAt;
    const isExamScheduledInFuture = useMemo(() => {
        if (!isExamMode || !examScheduledAt) return false;
        return new Date(examScheduledAt).getTime() > Date.now();
    }, [isExamMode, examScheduledAt]);

    // Countdown timer for scheduled exams
    const [countdown, setCountdown] = useState('');
    useEffect(() => {
        if (!isExamScheduledInFuture || !examScheduledAt) {
            setCountdown('');
            return;
        }
        const update = () => {
            const diff = new Date(examScheduledAt).getTime() - Date.now();
            if (diff <= 0) {
                setCountdown('');
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setCountdown(`${h}h ${m}m ${s}s`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [isExamScheduledInFuture, examScheduledAt]);

    // Open exam in fullscreen when it's an exam and pending
    useEffect(() => {
        if (isExamMode && selectedStatus === 'pending' && selectedAssignment && !isExamScheduledInFuture) {
            setExamFullscreen(true);
        } else {
            setExamFullscreen(false);
        }
    }, [isExamMode, selectedStatus, selectedAssignment, isExamScheduledInFuture]);

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
        setExamFullscreen(false);
    };

    const handleHomeworkSubmit = async (submitted: SubmittedHomework) => {
        setExamFullscreen(false);
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

    const handleResetAssignment = useCallback(async () => {
        if (!selectedAssignment) return;
        setResetting(true);
        try {
            await resetAssignment(selectedAssignment.assignmentId);
            showAlert('success', 'Assignment reset successfully. You can try again.');
            setSelectedAssignment(null);
            mutate(['student-assignments', userId]);
        } catch (err: any) {
            showAlert('error', err?.message || 'Failed to reset assignment.');
        } finally {
            setResetting(false);
            setResetConfirmOpen(false);
        }
    }, [selectedAssignment, userId, showAlert]);

    // Check if reset is allowed
    const canReset =
        selectedAssignment?.homework?.allowReset &&
        (selectedStatus === 'submitted' || selectedStatus === 'graded');

    const columns = useMemo(() => buildColumns(onRowClick), []);

    const assignmentView = (
        <>
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

            {isExamScheduledInFuture ? (
                <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ flex: 1, p: 4 }}>
                    <Alert severity="warning" sx={{ maxWidth: 500 }}>
                        <Typography variant="h6" gutterBottom>
                            Exam not yet available
                        </Typography>
                        <Typography variant="body2">
                            This exam is scheduled for{' '}
                            <strong>{formatSaDateTime(examScheduledAt!)}</strong>.
                        </Typography>
                        {countdown && (
                            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                                {countdown}
                            </Typography>
                        )}
                    </Alert>
                    <Button variant="contained" color="warning" onClick={handleBack}>
                        Back to assessments
                    </Button>
                </Stack>
            ) : (
                <TabContentBox>
                    {activeTab === 0 && selectedStatus === 'pending' && selectedAssignment && (
                        <HomeworkView
                            homework={selectedAssignment.homework}
                            onSubmit={handleHomeworkSubmit}
                            onBack={handleBack}
                        />
                    )}
                    {activeTab === 1 && (selectedStatus === 'graded' || selectedStatus === 'submitted') && selectedAssignment && (
                        <>
                            <GradedHomeworkComponent
                                gradedHomework={{
                                    homework: selectedAssignment.homework,
                                    answers: selectedAssignment.answers,
                                    grading: selectedAssignment.grading || {},
                                    overallComment: selectedAssignment.overallComment,
                                }}
                                onBack={handleBack}
                            />
                            {canReset && (
                                <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<RestartAltIcon />}
                                        onClick={() => setResetConfirmOpen(true)}
                                        disabled={resetting}
                                    >
                                        {resetting ? 'Resetting…' : 'Try Again'}
                                    </Button>
                                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                        Attempt #{selectedAssignment?.homework && 'attemptNumber' in (selectedAssignment as any)
                                            ? (selectedAssignment as any).attemptNumber ?? 1
                                            : 1}
                                    </Typography>
                                </Stack>
                            )}
                        </>
                    )}
                </TabContentBox>
            )}
        </>
    );

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
            ) : examFullscreen ? (
                <Dialog fullScreen open>
                    <FlexColumnHiddenContainer>
                        {assignmentView}
                    </FlexColumnHiddenContainer>
                </Dialog>
            ) : (
                <FlexColumnHiddenContainer>
                    {assignmentView}
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

            <ConfirmDialog
                open={resetConfirmOpen}
                title="Reset Assignment?"
                description={
                    <>
                        This will <strong>clear all your answers</strong> and reset the assignment.
                        You will start fresh with a new attempt. This action cannot be undone.
                    </>
                }
                confirmText="Reset"
                cancelText="Cancel"
                onConfirm={handleResetAssignment}
                onCancel={() => setResetConfirmOpen(false)}
                confirmButtonProps={{ color: 'warning' }}
            />
        </>
    );
}
