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
  const [searchTerm, setSearchTermState] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const handleSearch = useCallback((term: string) => {
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

  // SWR for classes with server-side pagination
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
    const params: any = {
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

  // Update row count when data changes
  useEffect(() => {
    if (typeof classesResult?.totalCount === 'number') {
      setRowCount(classesResult.totalCount);
    }
  }, [classesResult?.totalCount]);

  // SWR fetchers for lookup data
  const usersFetcher = useCallback(() => getUsers({
    pageNumber: 1,
    pageSize: 100,
    sortBy: 'lastName',
    sortDirection: 'asc',
  }), []);

  // SWR for lookup data (users, academics, subjects)
  const { data: users } = useSWR<PagedResult<UserDto>>('users-instructors', usersFetcher);

  const { data: academics } = useSWR<AcademicLevelDto[]>('academics', getAllAcademics);
  const { data: subjects } = useSWR<SubjectDto[]>('subjects', getAllSubjects);

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
      (classesResult?.items ?? []).map((row) => ({
        ...row,
        teacherId: row.teacherId ?? '',
        academicLevelId: row.academicLevelId ?? '',
        subjectId: row.subjectId ?? '',
      })),
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
      valueFormatter: (value: any, row: any) => {
        const levelId = value as string | undefined;
        if (!levelId) return row.academicLevelName ?? 'N/A';
        return academicLabelMap.get(levelId) ?? row.academicLevelName ?? 'N/A';
      },
    },
    {
      field: 'subjectId',
      headerName: 'Subject',
      flex: 1,
      minWidth: 130,
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
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 1,
      minWidth: 120,
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
          <Tooltip key="edit-tooltip" title={getEditTooltip()} arrow>
            <span>
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                disabled={isEditDisabled}
                onClick={() => {
                  void handleEditClick(row);
                }}
                color="primary"
                style={{ border: 0, backgroundColor: 'transparent' }}
              />
            </span>
          </Tooltip>,
          <Tooltip key="delete-tooltip" title={getDeleteTooltip()} arrow>
            <span>
              <GridActionsCellItem
                icon={
                  <DeleteOutlineIcon 
                    sx={{ 
                      color: isDeleteDisabled ? 'action.disabled' : 'error.main' 
                    }} 
                  />
                }
                label="Delete"
                disabled={isDeleteDisabled}
                onClick={() => handlePromptDelete(row)}
                style={{ border: 0, backgroundColor: 'transparent' }}
              />
            </span>
          </Tooltip>,
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
    
    // Small delay to show the delete animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await deleteClassroom(deleteTarget.classroomId);
      alert.success('Course deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await mutateClasses();
    } catch (err: any) {
      const message = err?.message || 'Failed to delete course.';
      alert.error(message);
    } finally {
      setIsDeleting(false);
      setDeletingRowId(null);
    }
  }, [deleteTarget?.classroomId, alert, mutateClasses]);



  const dataGridSlotProps = useMemo(
    () => ({
      loadingOverlay: {
        variant: 'skeleton' as const,
        noRowsVariant: 'skeleton' as const,
      },
    }),
    []
  );

  const pageSizeOptions = useMemo(() => [10, 20, 50], []);

  const confirmButtonProps = useMemo(() => ({ variant: 'contained' as const }), []);

  const getRowClassName = useCallback(
    (params: any) => {
      const classes = [];
      if (params.indexRelativeToCurrentPage % 2 === 0) {
        classes.push('even');
      } else {
        classes.push('odd');
      }
      if (deletingRowId === params.row.classroomId) {
        classes.push('row-deleted');
      }
      return classes.join(' ');
    },
    [deletingRowId]
  );

  const getRowId = useCallback((r: any) => r.classroomId, []);

  return (
    <>
      <EDataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        getRowClassName={getRowClassName}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        rowCount={rowCount}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={classLoading}
        slotProps={dataGridSlotProps}
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
