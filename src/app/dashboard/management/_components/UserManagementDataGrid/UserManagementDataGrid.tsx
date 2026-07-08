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
import {
  PagedResult,
  PaginationParams,
} from '@/app/_lib/interfaces/pagination';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import EditUserModal from '../Modals/EditUserModal';
import { deleteUser, getUsers } from '@/app/_lib/actions';
import type { UserManagementDataGridProps } from './interfaces';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DELETE_ANIMATION_MS,
  DATA_GRID_SLOT_PROPS,
} from './constants';
import {
  sanitizeOptionalInput,
  getDeleteDialogTitle,
  getRowClassName,
} from './utils';

export default function UserManagementDataGrid({
  active,
  searchTerm,
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
  const [rowCount, setRowCount] = React.useState(0);
  const { data: session } = useSession();
  const alert = useAlert();

  React.useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [searchTerm]);

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

      const requestParams: PaginationParams = {
        pageNumber: pageIndex + 1,
        pageSize: size,
      };

      if (orderBy) {
        requestParams.sortBy = orderBy;
        requestParams.sortDirection = orderDirection ?? 'asc';
      }

      if (normalizedSearchKey) {
        requestParams.searchTerm = normalizedSearchKey;
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

  const handlePromptDelete = (user: UserDto) => {
    if (!isElevated) return;
    if (user.role === UserRole.Admin && !isPrimaryAdmin) return;
    setDeleteTarget(user);
    setDeleteDialogOpen(true);
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
          if (isAdminUser && !canDeleteAdmin) {
            return 'Only the primary administrator can delete admin accounts';
          }
          return 'Delete user';
        };

        const getEditTooltip = () => {
          if (!isElevated) return 'Only administrators can edit users';
          return 'Edit user';
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
            onClick={() => handleEditClick(row)}
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
  ];

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

    await new Promise((resolve) => setTimeout(resolve, DELETE_ANIMATION_MS));

    try {
      await deleteUser(deleteTarget.userId);
      alert.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await mutateUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete user.';
      alert.error(message);
    } finally {
      setIsDeleting(false);
      setDeletingRowId(null);
    }
  };

  const getRowClassNameCallback = React.useCallback(
    (params: { indexRelativeToCurrentPage: number; row: { userId: string } }) =>
      getRowClassName(params, deletingRowId),
    [deletingRowId]
  );

  return (
    <>
      <EDataGrid
        rows={users?.items ?? []}
        columns={columns}
        getRowId={(r) => r.userId}
        getRowClassName={getRowClassNameCallback}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
        rowCount={rowCount}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={usersLoading || usersValidating}
        slotProps={DATA_GRID_SLOT_PROPS}
      />
      <EditUserModal
        open={editModalOpen}
        user={editTarget}
        isAdmin={isElevated}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={getDeleteDialogTitle(deleteTarget)}
        description="This action cannot be undone. The selected person will be permanently removed from the platform if you continue."
        confirmText={isDeleting ? 'Deleting…' : 'Delete'}
        disableCancel={isDeleting}
        disableConfirm={isDeleting}
      />
    </>
  );
}
