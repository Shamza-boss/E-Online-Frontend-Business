'use client';
import React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridPaginationModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useSWR from 'swr';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { UserDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { useRegisterSearch } from '@/app/_lib/context/SearchContext';
import {
  PagedResult,
  PaginationParams,
} from '@/app/_lib/interfaces/pagination';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import EditUserModal from '../Modals/EditUserModal';
import { deleteUser, getUsers } from '@/app/_lib/actions';

interface UserManagementDataGridProps {
  active: boolean;
}

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

export default function UserManagementDataGrid({
  active,
}: UserManagementDataGridProps) {
  const [editTarget, setEditTarget] = React.useState<UserDto | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<UserDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deletingRowId, setDeletingRowId] = React.useState<string | null>(null);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [searchTerm, setSearchTermState] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const { data: session } = useSession();
  const alert = useAlert();
  const handleSearch = React.useCallback((term: string) => {
    setSearchTermState(term);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useRegisterSearch({
    id: 'dashboard-management-users',
    placeholder: 'Search users',
    onSearch: handleSearch,
    debounceMs: 300,
    active,
  });

  const sortField = sortModel[0]?.field ?? null;
  const sortDirection = sortModel[0]?.sort ?? null;
  const normalizedSearchKey = sanitizeOptionalInput(searchTerm) ?? '';

  const usersKey = React.useMemo(
    () =>
      active
        ? [
          'users',
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
    data: users,
    isLoading: usersLoading,
    isValidating: usersValidating,
    mutate: mutateUsers,
  } = useSWR<PagedResult<UserDto>>(
    usersKey,
    () => {
      const pageIndex = paginationModel.page;
      const size = Number.isFinite(paginationModel.pageSize)
        ? paginationModel.pageSize
        : DEFAULT_PAGE_SIZE;
      const orderBy = sortModel[0]?.field ?? null;
      const normalizedDirection = sanitizeOptionalInput(sortModel[0]?.sort);
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

      return getUsers(requestParams);
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: active,
    }
  );

  React.useEffect(() => {
    if (typeof users?.totalCount === 'number') {
      setRowCount(users.totalCount);
    }
  }, [users?.totalCount]);

  const currentUserRole = session?.user?.role as UserRole;
  const currentUserEmail = session?.user?.email;
  const primaryAdminEmail = session?.user?.primaryAdminEmail;

  const userRole = Number(currentUserRole);
  const isElevated = userRole === UserRole.Admin;
  const isPrimaryAdmin = isElevated && currentUserEmail === primaryAdminEmail;

  const handleEditClick = (user: UserDto) => {
    setEditTarget(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditTarget(null);
  };

  const handleEditSuccess = async () => {
    await mutateUsers();
  };

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <RoleChip role={params.value} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      description: 'Edit user details or remove a user. A confirmation dialog will appear before deletion.',
      minWidth: 110,
      getActions: ({ row }: GridRowParams<UserDto>) => {
        const isAdminUser = row.role === UserRole.Admin;
        const canDeleteAdmin = isPrimaryAdmin;
        const isDeleteDisabled = !isElevated || (isAdminUser && !canDeleteAdmin);
        const isEditDisabled = !isElevated;
        
        const getDeleteTooltip = () => {
          if (!isElevated) return 'Only administrators can delete users';
          if (isAdminUser && !canDeleteAdmin) return 'Only the primary administrator can delete admin accounts';
          return 'Delete user';
        };
        
        const getEditTooltip = () => {
          if (!isElevated) return 'Only administrators can edit users';
          return 'Edit user';
        };
        
        return [
          <Tooltip key="edit-tooltip" title={getEditTooltip()} arrow>
            <span>
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                disabled={isEditDisabled}
                onClick={() => handleEditClick(row)}
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
  ];

  const handlePromptDelete = (user: UserDto) => {
    if (!isElevated) return;
    if (user.role === UserRole.Admin && !isPrimaryAdmin) return;
    setDeleteTarget(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.userId) {
      alert.error('Unable to determine which user to delete.');
      return;
    }
    if (deleteTarget.role === UserRole.Admin && !isPrimaryAdmin) {
      alert.error('Only the primary administrator can delete admin accounts.');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      return;
    }
    setIsDeleting(true);
    setDeletingRowId(deleteTarget.userId);
    
    // Small delay to show the delete animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await deleteUser(deleteTarget.userId);
      alert.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await mutateUsers();
    } catch (err: any) {
      const message = err?.message || 'Failed to delete user.';
      alert.error(message);
    } finally {
      setIsDeleting(false);
      setDeletingRowId(null);
    }
  };

  const dataGridSlotProps = React.useMemo(
    () => ({
      loadingOverlay: {
        variant: 'skeleton' as const,
        noRowsVariant: 'skeleton' as const,
      },
    }),
    []
  );

  const getRowClassName = React.useCallback(
    (params: any) => {
      const classes = [];
      if (params.indexRelativeToCurrentPage % 2 === 0) {
        classes.push('even');
      } else {
        classes.push('odd');
      }
      if (deletingRowId === params.row.userId) {
        classes.push('row-deleted');
      }
      return classes.join(' ');
    },
    [deletingRowId]
  );

  return (
    <>
      <EDataGrid
        rows={users?.items ?? []}
        columns={columns}
        getRowId={(r) => r.userId}
        getRowClassName={getRowClassName}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        rowCount={rowCount}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={usersLoading || usersValidating}
        slotProps={dataGridSlotProps}
      />
      <EditUserModal
        open={editModalOpen}
        user={editTarget} // <-- fix: never pass null, only undefined or UserDto
        isAdmin={isElevated}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={`Remove ${deleteTarget
          ? `${`${deleteTarget.firstName ?? ''} ${deleteTarget.lastName ?? ''}`.trim() ||
          deleteTarget.email ||
          'person'
          }`
          : 'person'
          }`}
        description="This action cannot be undone. The selected person will be permanently removed from the platform if you continue."
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        disableCancel={isDeleting}
        disableConfirm={isDeleting}
      />
    </>
  );
}
