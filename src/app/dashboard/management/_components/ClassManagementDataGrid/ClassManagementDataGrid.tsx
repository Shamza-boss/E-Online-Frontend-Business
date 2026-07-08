'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useSWR from 'swr';
import {
  ClassDto,
  AcademicLevelDto,
  ClassroomDetailsDto,
  SubjectDto,
  UserDto,
} from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import {
  deleteClassroom,
  getClassroomById,
  getClassroomsAndData,
} from '@/app/_lib/actions/classrooms';
import EditClassroomModal from '../Modals/EditClassroomModal';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import { PagedResult } from '@/app/_lib/interfaces/pagination';
import { getUsers } from '@/app/_lib/actions/users';
import { getAllAcademics } from '@/app/_lib/actions/academics';
import { getAllSubjects } from '@/app/_lib/actions/subjects';
import type { ClassManagementDataGridProps } from './interfaces';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SWR_USERS_INSTRUCTORS_KEY,
  SWR_ACADEMICS_KEY,
  SWR_SUBJECTS_KEY,
  DELETE_ANIMATION_MS,
  DATA_GRID_SLOT_PROPS,
} from './constants';
import {
  sanitizeOptionalInput,
  buildLabelMap,
  normalizeClassroomRows,
  getRowClassName,
} from './utils';

export default function ClassManagementDataGrid({
  active,
  searchTerm,
  initialAcademics,
  initialSubjects,
}: ClassManagementDataGridProps) {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Admin;

  const alert = useAlert();
  const [editTarget, setEditTarget] = useState<ClassDto | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClassroomDetailsDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [searchTerm]);

  const sortField = sortModel[0]?.field ?? null;
  const sortDirection = sortModel[0]?.sort ?? null;
  const normalizedSearchKey = sanitizeOptionalInput(searchTerm) ?? '';

  const classesKey = useMemo(
    () =>
      active
        ? [
          'classes',
          paginationModel.page,
          paginationModel.pageSize,
          sortField,
          sortDirection,
          normalizedSearchKey,
        ]
        : null,
    [active, paginationModel.page, paginationModel.pageSize, sortField, sortDirection, normalizedSearchKey]
  );

  const classesFetcher = useCallback(async () => {
    const params: Record<string, unknown> = {
      pageNumber: paginationModel.page + 1,
      pageSize: paginationModel.pageSize || DEFAULT_PAGE_SIZE,
    };
    if (sortField) {
      params.sortBy = sortField;
      params.sortDirection = sortDirection === 'asc' || sortDirection === 'desc' ? sortDirection : 'asc';
    }
    if (normalizedSearchKey) {
      params.searchTerm = normalizedSearchKey;
    }
    return getClassroomsAndData(params);
  }, [paginationModel.page, paginationModel.pageSize, sortField, sortDirection, normalizedSearchKey]);

  const {
    data: classesResult,
    isLoading: classLoading,
    mutate: mutateClasses,
  } = useSWR<PagedResult<ClassroomDetailsDto>>(
    classesKey,
    classesFetcher
  );

  useEffect(() => {
    if (typeof classesResult?.totalCount === 'number') {
      setRowCount(classesResult.totalCount);
    }
  }, [classesResult?.totalCount]);

  const usersFetcher = useCallback(() => getUsers({
    pageNumber: 1,
    pageSize: 100,
    sortBy: 'lastName',
    sortDirection: 'asc',
  }), []);

  const { data: users } = useSWR<PagedResult<UserDto>>(SWR_USERS_INSTRUCTORS_KEY, usersFetcher);
  const { data: academics } = useSWR<AcademicLevelDto[]>(SWR_ACADEMICS_KEY, getAllAcademics, {
    fallbackData: initialAcademics,
    revalidateOnMount: !initialAcademics,
    revalidateOnFocus: false,
  });
  const { data: subjects } = useSWR<SubjectDto[]>(SWR_SUBJECTS_KEY, getAllSubjects, {
    fallbackData: initialSubjects,
    revalidateOnMount: !initialSubjects,
    revalidateOnFocus: false,
  });

  const instructorUsers = useMemo(
    () =>
      (users?.items ?? []).filter(
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

  const teacherLabelMap = useMemo(
    () => buildLabelMap(teacherOptions),
    [teacherOptions]
  );

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

  const academicLabelMap = useMemo(
    () => buildLabelMap(academicOptions),
    [academicOptions]
  );

  const subjectOptions = useMemo<
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
    () => normalizeClassroomRows(classesResult?.items),
    [classesResult?.items]
  );

  const handleEditClick = useCallback(async (classroom: ClassroomDetailsDto) => {
    try {
      const fullClassroom = await getClassroomById(classroom.classroomId);
      setEditTarget(fullClassroom);
      setEditModalOpen(true);
    } catch (error) {
      console.error('Failed to load course for editing', error);
      alert.error('Unable to load course details for editing. Please try again.');
    }
  }, [alert]);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditTarget(null);
  }, []);

  const handleEditSuccess = useCallback(async () => {
    await mutateClasses();
  }, [mutateClasses]);

  const handlePromptDelete = useCallback((row: ClassroomDetailsDto) => {
    if (!isElevated) return;
    setDeleteTarget(row);
    setDeleteDialogOpen(true);
  }, [isElevated]);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'classroomName',
      headerName: 'Course name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'teacherId',
      headerName: 'Instructor',
      flex: 1,
      minWidth: 160,
      valueFormatter: (params: { value?: string }, row: ClassroomDetailsDto) => {
        const teacherId = params.value;
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
    },
    {
      field: 'numberOfUsers',
      headerName: 'Users in class',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'academicLevelId',
      headerName: 'Academic level',
      flex: 1,
      minWidth: 130,
      valueFormatter: (value: string | undefined, row: ClassroomDetailsDto) => {
        const levelId = value;
        if (!levelId) return row.academicLevelName ?? 'N/A';
        return academicLabelMap.get(levelId) ?? row.academicLevelName ?? 'N/A';
      },
    },
    {
      field: 'subjectId',
      headerName: 'Subject',
      flex: 1,
      minWidth: 130,
      valueFormatter: (value: string | undefined, row: ClassroomDetailsDto) => {
        const subjectId = value;
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
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row: ClassroomDetailsDto) => {
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
      description: 'Edit course details or remove a course. A confirmation dialog will appear before deletion.',
      minWidth: 110,
      getActions: ({ row }: GridRowParams<ClassroomDetailsDto>) => {
        const isDeleteDisabled = !isElevated;
        const isEditDisabled = !isElevated;

        const getDeleteTooltip = () => {
          if (!isElevated) return 'Only administrators can delete courses';
          return 'Delete course';
        };

        const getEditTooltip = () => {
          if (!isElevated) return 'Only administrators can edit courses';
          return 'Edit course';
        };

        return [
          <GridActionsCellItem
            key="edit-action"
            icon={
              <Tooltip title={getEditTooltip()} arrow>
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            disabled={isEditDisabled}
            onClick={() => {
              void handleEditClick(row);
            }}
            color="primary"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
          <GridActionsCellItem
            key="delete-action"
            icon={
              <Tooltip title={getDeleteTooltip()} arrow>
                <DeleteOutlineIcon
                  sx={{
                    color: isDeleteDisabled ? 'action.disabled' : 'error.main',
                  }}
                />
              </Tooltip>
            }
            label="Delete"
            disabled={isDeleteDisabled}
            onClick={() => handlePromptDelete(row)}
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
        ];
      },
    },
  ], [
    isElevated,
    teacherLabelMap,
    academicLabelMap,
    subjectLabelMap,
    handleEditClick,
    handlePromptDelete,
  ]);

  const handleCloseDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget?.classroomId) {
      alert.error('Unable to determine which course to delete.');
      return;
    }

    setIsDeleting(true);
    setDeletingRowId(deleteTarget.classroomId);

    await new Promise((resolve) => setTimeout(resolve, DELETE_ANIMATION_MS));

    try {
      await deleteClassroom(deleteTarget.classroomId);
      alert.success('Course deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await mutateClasses();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete course.';
      alert.error(message);
    } finally {
      setIsDeleting(false);
      setDeletingRowId(null);
    }
  }, [deleteTarget?.classroomId, alert, mutateClasses]);

  const confirmButtonProps = useMemo(() => ({ variant: 'contained' as const }), []);

  const getRowClassNameCallback = useCallback(
    (params: { indexRelativeToCurrentPage: number; row: { classroomId: string } }) =>
      getRowClassName(params, deletingRowId),
    [deletingRowId]
  );

  const getRowId = useCallback((r: ClassroomDetailsDto) => r.classroomId, []);

  return (
    <>
      <EDataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        getRowClassName={getRowClassNameCallback}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
        rowCount={rowCount}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={classLoading}
        slotProps={DATA_GRID_SLOT_PROPS}
      />
      <EditClassroomModal
        open={editModalOpen}
        classroom={editTarget}
        isAdmin={isElevated}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={`Remove ${deleteTarget?.classroomName?.trim() || 'course'}`}
        description="This action cannot be undone. The selected course will be permanently removed if you continue."
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        disableCancel={isDeleting}
        disableConfirm={isDeleting}
        confirmButtonProps={confirmButtonProps}
      />
    </>
  );
}
