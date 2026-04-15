'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Stack,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import useSWR from 'swr';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import EDataGrid from '../../../../_components/EDataGrid';
import {
    getAllStudents,
    getAllUsersInClassroom,
    getAllUserClassrooms,
} from '@/app/_lib/actions';
import type { UserDto, ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import type { StudentManagementTableProps } from './interfaces';
import { StyledGridOverlay } from './elements';
import {
    normalizeSelectionModel,
    computeSelectableStudentIds,
    computeSelectedStudentIds,
    assignToClass,
    unenrollStudent,
} from './utils';

function CustomNoResultsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 523 299"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-results-primary"
                    d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
                />
                <path
                    className="no-results-primary"
                    d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-results-primary"
                    d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-results-secondary"
                    d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
                />
            </svg>
            <Box sx={{ mt: 2 }}>
                All available students have been enrolled in the selected classroom.
            </Box>
        </StyledGridOverlay>
    );
}

const StudentManagementTable: React.FC<StudentManagementTableProps> = ({
    onEnrollmentStateChange,
}) => {
    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>({
        type: 'include',
        ids: new Set(),
    });
    const [unenrollingId, setUnenrollingId] = useState<string | null>(null);
    const [confirmUnenroll, setConfirmUnenroll] = useState<{
        open: boolean;
        studentId: string | null;
        studentName: string;
    }>({ open: false, studentId: null, studentName: '' });
    const { showAlert } = useAlert();
    const [classId, setClassId] = useState<string>('');

    const { data: students, isLoading: studentsLoading } = useSWR<UserDto[]>(
        'all-students',
        getAllStudents,
        { revalidateOnFocus: false },
    );

    const { data: classRooms, isLoading: classesLoading } = useSWR<ClassroomDetailsDto[]>(
        'user-classrooms',
        getAllUserClassrooms,
        { revalidateOnFocus: false },
    );

    const { data: enrolledStudents = [], mutate: mutateEnrolledStudents } = useSWR<UserDto[]>(
        classId ? ['classroom-users', classId] : null,
        () => getAllUsersInClassroom(classId),
        { revalidateOnFocus: false },
    );

    const enrolledIds = useMemo(
        () =>
            new Set(
                enrolledStudents
                    .map((s) => s.userId)
                    .filter((id): id is string => Boolean(id)),
            ),
        [enrolledStudents],
    );

    const studentsWithIds = useMemo(
        () => (students ?? []).filter((s): s is UserDto & { userId: string } => Boolean(s.userId)),
        [students],
    );

    const handleValueChange = (e: any) => {
        setClassId(e.target.value);
        setSelectedIds({ type: 'include', ids: new Set() });
    };

    const handleRowSelectionModelChange = (model: GridRowSelectionModel) => {
        if (Array.isArray(model)) {
            setSelectedIds({ type: 'include', ids: new Set(model.map(String)) });
            return;
        }
        setSelectedIds({
            type: model.type,
            ids: new Set(model.ids),
        });
    };

    const normalizedSelection = useMemo(
        () => normalizeSelectionModel(selectedIds),
        [selectedIds],
    );

    const selectableStudentIds = useMemo(
        () => computeSelectableStudentIds(classId, studentsWithIds, enrolledIds),
        [classId, enrolledIds, studentsWithIds],
    );

    const selectableStudentIdSet = useMemo(
        () => new Set(selectableStudentIds),
        [selectableStudentIds],
    );

    const selectedStudentIds = useMemo(
        () => computeSelectedStudentIds(classId, normalizedSelection, selectableStudentIds, selectableStudentIdSet),
        [classId, normalizedSelection, selectableStudentIds, selectableStudentIdSet],
    );

    const selectedCount = selectedStudentIds.length;
    const canEnroll = Boolean(classId) && selectedCount > 0;
    const selectionKey = useMemo(
        () => `${normalizedSelection.type}|${Array.from(normalizedSelection.ids).join('|')}`,
        [normalizedSelection],
    );

    const resetSelection = useCallback(
        () => setSelectedIds({ type: 'include', ids: new Set() }),
        [],
    );

    const handleAssignToClass = useCallback(
        () => assignToClass(classId, selectedStudentIds, showAlert, resetSelection, mutateEnrolledStudents),
        [classId, mutateEnrolledStudents, selectedStudentIds, showAlert, resetSelection],
    );

    const handleUnenrollStudent = useCallback(
        (studentId: string) =>
            unenrollStudent(studentId, classId, showAlert, setUnenrollingId, mutateEnrolledStudents),
        [classId, mutateEnrolledStudents, showAlert],
    );

    const handleOpenUnenrollDialog = (studentId: string, studentName: string) => {
        setConfirmUnenroll({ open: true, studentId, studentName });
    };

    const handleCloseUnenrollDialog = () => {
        setConfirmUnenroll({ open: false, studentId: null, studentName: '' });
    };

    const handleConfirmUnenroll = async () => {
        if (!confirmUnenroll.studentId) return;
        await handleUnenrollStudent(confirmUnenroll.studentId);
        handleCloseUnenrollDialog();
    };

    const lastEnrollmentState = useRef<{
        canEnroll: boolean;
        selectedCount: number;
        classId: string;
        selectionKey: string;
    } | null>(null);

    useEffect(() => {
        if (!onEnrollmentStateChange) return;
        const nextState = { canEnroll, selectedCount, classId, selectionKey };
        if (
            lastEnrollmentState.current &&
            lastEnrollmentState.current.canEnroll === nextState.canEnroll &&
            lastEnrollmentState.current.selectedCount === nextState.selectedCount &&
            lastEnrollmentState.current.classId === nextState.classId &&
            lastEnrollmentState.current.selectionKey === nextState.selectionKey
        ) {
            return;
        }
        lastEnrollmentState.current = nextState;
        onEnrollmentStateChange({
            canEnroll,
            selectedCount,
            enroll: handleAssignToClass,
        });
    }, [canEnroll, classId, handleAssignToClass, onEnrollmentStateChange, selectedCount, selectionKey]);

    const columns: GridColDef[] = [
        { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 120 },
        { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            minWidth: 160,
            renderCell: (params) => {
                const studentId = params.row.userId as string | undefined;
                const isEnrolled = Boolean(classId) && !!studentId ? enrolledIds.has(studentId) : false;
                const isBusy = unenrollingId === studentId;
                const studentName = `${params.row.firstName ?? ''} ${params.row.lastName ?? ''}`.trim();

                return (
                    <Button
                        size="small"
                        variant="outlined"
                        disabled={!isEnrolled || isBusy}
                        onClick={() => studentId && handleOpenUnenrollDialog(studentId, studentName)}
                    >
                        {isBusy ? 'Removing...' : 'Unenroll'}
                    </Button>
                );
            },
        },
    ];

    const dataGridSlotProps = useMemo(
        () => ({
            loadingOverlay: {
                variant: 'linear-progress' as const,
                noRowsVariant: 'linear-progress' as const,
            },
        }),
        [],
    );

    return (
        <Box flexGrow={1} display="flex" flexDirection="column" minHeight={0}>
            <Stack spacing={2} sx={{ flexShrink: 0 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Enroll students
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Step 1: pick a class. Step 2: select students to enroll.
                    </Typography>
                </Box>

                <FormControl fullWidth disabled={classesLoading}>
                    <InputLabel id="trainee-class-label">Select trainee class</InputLabel>
                    <Select
                        labelId="trainee-class-label"
                        value={classId}
                        onChange={handleValueChange}
                        label="Select trainee class"
                    >
                        {classRooms?.map((c) => (
                            <MenuItem key={c.classroomId} value={c.classroomId}>
                                {c.classroomName}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        You must select a trainee class to begin enrolling.
                    </FormHelperText>
                </FormControl>
            </Stack>

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
                <EDataGrid
                    checkboxSelection={!!classId}
                    rows={studentsWithIds}
                    columns={columns}
                    getRowId={(r) => r.userId}
                    getRowClassName={(params) =>
                        `${params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}${
                            enrolledIds.has(params.row.userId) ? ' row-disabled' : ''
                        }`
                    }
                    isRowSelectable={(params) =>
                        Boolean(classId) && !enrolledIds.has(params.row.userId)
                    }
                    rowSelectionModel={selectedIds}
                    onRowSelectionModelChange={handleRowSelectionModelChange}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 20, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                    loading={studentsLoading}
                    slotProps={dataGridSlotProps}
                    slots={{
                        noResultsOverlay: CustomNoResultsOverlay,
                    }}
                    sx={{
                        '& .row-disabled': {
                            color: 'text.disabled',
                            bgcolor: 'action.disabledBackground',
                        },
                    }}
                />
            </OutlinedWrapper>

            <Box sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    {classId
                        ? `${selectedCount} student${selectedCount === 1 ? '' : 's'} selected.`
                        : 'Select a class to enable student selection.'}
                </Typography>
            </Box>

            <Dialog open={confirmUnenroll.open} onClose={handleCloseUnenrollDialog}>
                <DialogTitle>Remove student from class?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmUnenroll.studentName
                            ? `This will remove ${confirmUnenroll.studentName} from the selected class. They will lose access immediately.`
                            : 'This will remove the student from the selected class. They will lose access immediately.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUnenrollDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmUnenroll} color="warning" variant="contained">
                        Remove student
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentManagementTable;
