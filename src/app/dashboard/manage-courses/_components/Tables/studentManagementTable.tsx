'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Stack,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  styled,
} from '@mui/material';
import useSWR from 'swr';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import EDataGrid from '../../../_components/EDataGrid';

import { getAllStudents } from '../../../../_lib/actions/users';
import {
  EnrollStudents,
  getAllUsersInClassroom,
  getAllClassroomsAndData,
} from '../../../../_lib/actions/classrooms';
import {
  UserDto,
  EnrollStudentsDto,
  ClassroomDetailsDto,
} from '../../../../_lib/interfaces/types';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';

const StudentManagementTable = () => {
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const { showAlert } = useAlert();
  const [classId, setClassId] = useState<string>('');

  const { data: students, isLoading: studentsLoading } = useSWR<UserDto[]>(
    'students',
    getAllStudents
  );

  const { data: classRooms, isLoading: classesLoading } = useSWR<
    ClassroomDetailsDto[]
  >('getAvailableClasses', getAllClassroomsAndData);

  const { data: enrolledStudents = [] } = useSWR<UserDto[]>(
    classId ? ['classroomUsers', classId] : null,
    () => getAllUsersInClassroom(classId)
  );

  // Filter eligible students (not already enrolled)
  const eligibleStudents = useMemo(() => {
    if (!students || !classId) return students || [];
    const enrolledIds = new Set(enrolledStudents.map((s) => s.userId));
    return students.filter((s) => !enrolledIds.has(s.userId));
  }, [students, enrolledStudents, classId]);

  const handleValueChange = (e: any) => {
    setClassId(e.target.value);
    setSelectedIds({ type: 'include', ids: new Set() }); // Reset selection
  };

  const handleRowSelectionModelChange = (model: GridRowSelectionModel) => {
    setSelectedIds(model);
  };

  const handleAssignToClass = async () => {
    if (classId && selectedIds.ids.size > 0) {
      const payload: EnrollStudentsDto = {
        classroomId: classId,
        studentIds: Array.from(selectedIds.ids) as string[],
      };
      await EnrollStudents(payload);
      setSelectedIds({ type: 'include', ids: new Set() });
      showAlert(
        'success',
        `Successfully enrolled ${payload.studentIds.length} students to the class.`
      );
    }
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 120 },
    { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
  ];

  const dataGridSlotProps = useMemo(
    () => ({
      loadingOverlay: {
        variant: 'linear-progress' as const,
        noRowsVariant: 'linear-progress' as const,
      },
    }),
    []
  );

  return (
    <Box flexGrow={1}>
      <Stack spacing={2}>
        <Alert severity="info">
          {!classId
            ? 'Please select a class you want to enroll trainees to.'
            : 'Select trainees who are not yet enrolled in this class.'}
        </Alert>

        <FormControl fullWidth disabled={classesLoading}>
          <InputLabel>Select Class</InputLabel>
          <Select value={classId} onChange={handleValueChange}>
            {classRooms?.map((c) => (
              <MenuItem key={c.classroomId} value={c.classroomId}>
                {c.classroomName}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            You must select a class to begin enrolling.
          </FormHelperText>
        </FormControl>
        <Box
          sx={{
            width: '100%',
            height: 300, // or a specific height like '400px'
            maxHeight: 300, // adjust as needed for modal padding
            overflow: 'hidden',
          }}
        >
          <EDataGrid
            checkboxSelection={!!classId}
            rows={eligibleStudents || []}
            columns={columns}
            getRowId={(r) => r.userId}
            rowSelectionModel={selectedIds}
            onRowSelectionModelChange={handleRowSelectionModelChange}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50, 100]}
            loading={studentsLoading}
            slotProps={dataGridSlotProps}
            slots={{
              noResultsOverlay: CustomNoResultsOverlay,
            }}
          />
        </Box>

        <Button
          variant="outlined"
          disabled={!classId || selectedIds.ids.size === 0}
          onClick={handleAssignToClass}
        >
          Assign to class
        </Button>
      </Stack>
    </Box>
  );
};

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-results-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-results-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

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

export default StudentManagementTable;
