'use client';

import React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridSortModel,
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
  getClassroomsAndData,
  updateClassroom,
} from '@/app/_lib/actions/classrooms';
import useSWR from 'swr';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import {
  PagedResult,
  PaginationParams,
} from '@/app/_lib/interfaces/pagination';
import { getUsers } from '@/app/_lib/actions/users';
import { getAllAcademics } from '@/app/_lib/actions/academics';
import { getAllSubjects } from '@/app/_lib/actions/subjects';
import { useRegisterSearch } from '@/app/_lib/context/SearchContext';

const DEFAULT_PAGE_SIZE = 20;

const sanitizeOptionalInput = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower === 'undefined' ||
    lower === 'null' ||
    lower === '$undefined' ||
    lower === '$null'
  ) {
    return undefined;
  }

  return trimmed;
};

interface ClassManagementDataGridProps {
  active: boolean;
}

export default function ClassManagementDataGrid({
  active,
}: ClassManagementDataGridProps) {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Admin;

  const { showAlert } = useAlert();
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [deleteTarget, setDeleteTarget] =
    React.useState<ClassroomDetailsDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [searchTerm, setSearchTermState] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);

  const handleSearch = React.useCallback((term: string) => {
    setSearchTermState(term);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useRegisterSearch({
    id: 'dashboard-management-classes',
    placeholder: 'Search courses',
    onSearch: handleSearch,
    debounceMs: 300,
    active,
  });

  const sortField = sortModel[0]?.field ?? null;
  const sortDirection = sortModel[0]?.sort ?? null;
  const normalizedSearchKey = sanitizeOptionalInput(searchTerm) ?? '';

  const classesKey = React.useMemo(
    () =>
      active
        ? [
            'classes',
            paginationModel.page,
            paginationModel.pageSize,
            sortField ?? '',
            sortDirection ?? '',
            normalizedSearchKey,
          ]
        : null,
    [
      active,
      paginationModel.page,
      paginationModel.pageSize,
      sortField,
      sortDirection,
      normalizedSearchKey,
    ]
  );

  const {
    data: classesResult,
    isLoading: classLoading,
    isValidating: classValidating,
    mutate: mutateClasses,
  } = useSWR<PagedResult<ClassroomDetailsDto>>(
    classesKey,
    () => {
      const pageIndex = paginationModel.page;
      const size = Number.isFinite(paginationModel.pageSize)
        ? paginationModel.pageSize
        : DEFAULT_PAGE_SIZE;
      const orderBy = sortField ?? null;
      const normalizedDirection = sanitizeOptionalInput(sortDirection);
      const orderDirection =
        normalizedDirection === 'asc' || normalizedDirection === 'desc'
          ? normalizedDirection
          : undefined;
      const sanitizedSearch = normalizedSearchKey;

      const requestParams: PaginationParams = {
        pageNumber: pageIndex + 1,
        pageSize: size,
      };

      if (orderBy) {
        requestParams.sortBy = orderBy;
        requestParams.sortDirection = orderDirection ?? 'asc';
      }

      if (sanitizedSearch) {
        requestParams.searchTerm = sanitizedSearch;
      }

      return getClassroomsAndData(requestParams);
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: active,
    }
  );

  React.useEffect(() => {
    if (typeof classesResult?.totalCount === 'number') {
      setRowCount(classesResult.totalCount);
    }
  }, [classesResult?.totalCount]);

  const { data: users } = useSWR<PagedResult<UserDto>>(
    ['users', 'instructors'],
    () =>
      getUsers({
        pageNumber: 1,
        pageSize: 100,
        sortBy: 'lastName',
        sortDirection: 'asc',
      }),
    {
      revalidateOnMount: true,
    }
  );
  const { data: academics } = useSWR<AcademicLevelDto[]>(
    'academics',
    getAllAcademics,
    { revalidateOnMount: true }
  );
  const { data: subjects } = useSWR<SubjectDto[]>('subjects', getAllSubjects, {
    revalidateOnMount: true,
  });

  const instructorUsers = React.useMemo(
    () =>
      (users?.items ?? []).filter(
        (user): user is UserDto & { userId: string } =>
          Boolean(user.userId) && user.role === UserRole.Instructor
      ),
    [users]
  );

  const teacherOptions = React.useMemo<{ value: string; label: string }[]>(
    () =>
      instructorUsers.map((teacher) => ({
        value: teacher.userId,
        label:
          `${teacher.firstName ?? ''} ${teacher.lastName ?? ''}`.trim() ||
          teacher.email,
      })),
    [instructorUsers]
  );

  const teacherLabelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    teacherOptions.forEach((opt) => {
      map.set(opt.value, opt.label);
    });
    return map;
  }, [teacherOptions]);

  const academicOptions = React.useMemo<{ value: string; label: string }[]>(
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

  const academicLabelMap = React.useMemo(() => {
    const map = new Map<string, string>();
    academicOptions.forEach((opt) => {
      map.set(opt.value, opt.label);
    });
    return map;
  }, [academicOptions]);

  const subjectOptions = React.useMemo<
    Array<{ value: string; label: string; code: string; subjectName: string }>
  >(
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

  const subjectValueOptions = React.useMemo(
    () => subjectOptions.map(({ value, label }) => ({ value, label })),
    [subjectOptions]
  );

  const subjectLabelMap = React.useMemo(() => {
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

  const rows = React.useMemo(
    () =>
      (classesResult?.items ?? []).map((row) => ({
        ...row,
        teacherId: row.teacherId ?? '',
        academicLevelId: row.academicLevelId ?? '',
        subjectId: row.subjectId ?? '',
      })),
    [classesResult?.items]
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
      await mutateClasses();
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
      await mutateClasses();
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
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        rowCount={rowCount}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={`Remove ${deleteTarget?.classroomName?.trim() || 'classroom'}`}
        description="This action cannot be undone. The selected classroom will be permanently removed if you continue."
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        disableCancel={isDeleting}
        disableConfirm={isDeleting}
        confirmButtonProps={{ variant: 'contained' }}
      />
    </>
  );
}
