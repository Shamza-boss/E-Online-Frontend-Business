'use client';

import React, { useMemo, useState } from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
} from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AcademicLevelDto,
  ClassroomDetailsDto,
  SubjectDto,
  UserDto,
} from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import {
  deleteClassroom,
  getAllClassroomsAndData,
  updateClassroom,
} from '@/app/_lib/actions/classrooms';
import useSWR, { mutate } from 'swr';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { getAllUsers } from '@/app/_lib/actions/users';
import { getAllAcademics } from '@/app/_lib/actions/academics';
import { getAllSubjects } from '@/app/_lib/actions/subjects';

export default function ClassManagementDataGrid() {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Admin;

  const { showAlert } = useAlert();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deleteTarget, setDeleteTarget] = useState<ClassroomDetailsDto | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    data: classes,
    isLoading: classLoading,
    isValidating: classValidating,
  } = useSWR<ClassroomDetailsDto[]>('classes', getAllClassroomsAndData, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });
  const { data: users } = useSWR<UserDto[]>('users', getAllUsers, {
    revalidateOnMount: true,
  });
  const { data: academics } = useSWR<AcademicLevelDto[]>(
    'academics',
    getAllAcademics,
    { revalidateOnMount: true }
  );
  const { data: subjects } = useSWR<SubjectDto[]>('subjects', getAllSubjects, {
    revalidateOnMount: true,
  });

  const instructorUsers = useMemo(
    () =>
      (users ?? []).filter(
        (user): user is UserDto & { userId: string } =>
          Boolean(user.userId) && user.role === UserRole.Instructor
      ),
    [users]
  );

  const teacherOptions = useMemo<{ value: string; label: string }[]>(
    () =>
      instructorUsers.map((teacher) => ({
        value: teacher.userId,
        label:
          `${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim() ||
          teacher.email,
      })),
    [instructorUsers]
  );

  const teacherLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    teacherOptions.forEach((opt) => {
      map.set(opt.value, opt.label);
    });
    return map;
  }, [teacherOptions]);

  const academicOptions = useMemo<{ value: string; label: string }[]>(
    () =>
      (academics ?? [])
        .filter((academic): academic is AcademicLevelDto & { id: string } =>
          Boolean(academic.id)
        )
        .map((academic) => ({
          value: academic.id,
          label: academic.name,
        })),
    [academics]
  );

  const academicLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    academicOptions.forEach((opt) => {
      map.set(opt.value, opt.label);
    });
    return map;
  }, [academicOptions]);

  const subjectOptions = useMemo(
    () =>
      (subjects ?? [])
        .filter((subject): subject is SubjectDto & { id: string } =>
          Boolean(subject.id)
        )
        .map((subject) => ({
          value: subject.id,
          label: `${subject.name} — ${subject.subjectCode}`,
          code: subject.subjectCode,
          subjectName: subject.name,
        })),
    [subjects]
  );

  const subjectValueOptions = useMemo(
    () => subjectOptions.map(({ value, label }) => ({ value, label })),
    [subjectOptions]
  );

  const subjectLabelMap = useMemo(() => {
    const map = new Map<
      string,
      { label: string; code: string; name: string }
    >();
    subjectOptions.forEach((opt) => {
      map.set(opt.value, {
        label: opt.label,
        code: opt.code,
        name: opt.subjectName,
      });
    });
    return map;
  }, [subjectOptions]);

  const rows = useMemo(
    () =>
      (classes ?? []).map((row) => ({
        ...row,
        teacherId: row.teacherId ?? '',
        academicLevelId: row.academicLevelId ?? '',
        subjectId: row.subjectId ?? '',
      })),
    [classes]
  );

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'classroomName',
      headerName: 'Course name',
      flex: 1,
      minWidth: 150,
      editable: isElevated,
    },
    {
      field: 'teacherId',
      headerName: 'Instructor',
      flex: 1,
      minWidth: 160,
      type: 'singleSelect',
      valueOptions: teacherOptions,
      valueFormatter: (params: any, row: any) => {
        const teacherId = params.value as string | undefined;
        if (!teacherId) {
          const fallback =
            `${row.teacherFirstName ?? ''} ${row.teacherLastName ?? ''}`.trim();
          return fallback || 'N/A';
        }
        return (
          teacherLabelMap.get(teacherId) ||
          `${row.teacherFirstName ?? ''} ${row.teacherLastName ?? ''}`.trim() ||
          'N/A'
        );
      },
      editable: isElevated,
    },
    {
      field: 'numberOfUsers',
      headerName: 'Users in class',
      flex: 1,
      minWidth: 120,
      editable: false,
    },
    {
      field: 'academicLevelId',
      headerName: 'Academic level',
      flex: 1,
      minWidth: 130,
      type: 'singleSelect',
      valueOptions: academicOptions,
      valueFormatter: (value: any, row: any) => {
        const levelId = value as string | undefined;
        if (!levelId) return row.academicLevelName ?? 'N/A';
        return academicLabelMap.get(levelId) ?? row.academicLevelName ?? 'N/A';
      },
      editable: isElevated,
    },
    {
      field: 'subjectId',
      headerName: 'Subject',
      flex: 1,
      minWidth: 130,
      type: 'singleSelect',
      valueOptions: subjectValueOptions,
      valueFormatter: (value: any, row: any) => {
        const subjectId = value as string | undefined;
        if (!subjectId) {
          return row.subjectName
            ? `${row.subjectName} — ${row.subjectCode}`
            : 'N/A';
        }
        const entry = subjectLabelMap.get(subjectId);
        if (entry) return entry.label;
        return row.subjectName
          ? `${row.subjectName} — ${row.subjectCode}`
          : 'N/A';
      },
      editable: isElevated,
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 1,
      minWidth: 120,
      editable: false,
      valueGetter: (_value, row) => {
        if (row.subjectId) {
          const entry = subjectLabelMap.get(row.subjectId);
          if (entry) return entry.code;
        }
        return row.subjectCode;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 140,
      getActions: ({ id, row }: GridRowParams<ClassroomDetailsDto>) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              color="primary"
              style={{ border: 0, backgroundColor: 'transparent' }}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
              style={{ border: 0, backgroundColor: 'transparent' }}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            disabled={!isElevated}
            color="primary"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handlePromptDelete(row)}
            disabled={!isElevated}
            color="inherit"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
        ];
      },
    },
  ];

  const handlePromptDelete = (row: ClassroomDetailsDto) => {
    if (!isElevated) return;
    setDeleteTarget(row);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.classroomId) {
      showAlert('error', 'Unable to determine which classroom to delete.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteClassroom(deleteTarget.classroomId);
      showAlert('success', 'Classroom deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      mutate('classes');
    } catch (err: any) {
      const message = err?.message || 'Failed to delete classroom.';
      showAlert('error', message);
    } finally {
      setIsDeleting(false);
    }
  };

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    const mergedRow = {
      ...(oldRow as ClassroomDetailsDto),
      ...(newRow as ClassroomDetailsDto),
    } as ClassroomDetailsDto;

    try {
      const payloadName =
        typeof mergedRow.classroomName === 'string'
          ? mergedRow.classroomName.trim()
          : '';

      if (!payloadName) {
        throw new Error('Course name is required.');
      }

      const academicLevelId = mergedRow.academicLevelId ?? '';
      const subjectId = mergedRow.subjectId ?? '';

      if (!mergedRow.classroomId) {
        throw new Error('Missing classroom identifier.');
      }

      if (!academicLevelId || !subjectId) {
        throw new Error(
          'Missing academic level or subject details required for updates.'
        );
      }

      await updateClassroom({
        id: mergedRow.classroomId,
        name: payloadName,
        teacherId: mergedRow.teacherId ?? null,
        academicLevelId,
        subjectId,
      });

      const updatedTeacher = instructorUsers.find(
        (teacher) => teacher.userId === mergedRow.teacherId
      );
      const updatedAcademic = academics?.find(
        (level) => level.id === academicLevelId
      );
      const updatedSubject = subjects?.find(
        (subject) => subject.id === subjectId
      );

      const updatedRow: ClassroomDetailsDto = {
        ...mergedRow,
        teacherFirstName: mergedRow.teacherId
          ? (updatedTeacher?.firstName ?? mergedRow.teacherFirstName)
          : '',
        teacherLastName: mergedRow.teacherId
          ? (updatedTeacher?.lastName ?? mergedRow.teacherLastName)
          : '',
        academicLevelName: updatedAcademic?.name ?? mergedRow.academicLevelName,
        subjectName: updatedSubject?.name ?? mergedRow.subjectName,
        subjectCode: updatedSubject?.subjectCode ?? mergedRow.subjectCode,
      };

      showAlert('success', 'Classroom updated successfully');
      mutate('classes');
      return updatedRow;
    } catch (err: any) {
      const message = err?.message || 'Failed to update classroom.';
      showAlert('error', message);
      return oldRow;
    }
  };

  const handleRowUpdateError = (error: Error) => {
    showAlert('error', `Failed to update row: ${error.message}`);
  };

  return (
    <>
      <EDataGrid
        checkboxSelection={isElevated}
        rows={rows}
        columns={columns}
        getRowId={(r) => r.classroomId}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        editMode="row"
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        pageSizeOptions={[10, 20, 50]}
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleRowUpdateError}
        loading={classLoading || classValidating}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
        }}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="confirm-delete-classroom-title"
      >
        <DialogTitle id="confirm-delete-classroom-title">
          {`Remove ${deleteTarget?.classroomName?.trim() || 'classroom'}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The selected classroom will be
            permanently removed if you continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <span>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              disabled={isDeleting}
              variant="contained"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </span>
        </DialogActions>
      </Dialog>
    </>
  );
}
