'use client';
import React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useSWR, { mutate } from 'swr';
import { getAllowedRoles, roleOptions } from '@/app/_lib/common/functions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { UserDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { deleteUser, getAllUsers, updateUser } from '@/app/_lib/actions/users';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function UserManagementDataGrid() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [deleteTarget, setDeleteTarget] = React.useState<UserDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const {
    data: users,
    isLoading: usersLoading,
    isValidating: usersValidating,
  } = useSWR<UserDto[]>('users', getAllUsers, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });

  const currentUserRole = session?.user?.role as UserRole;

  const userRole = Number(currentUserRole);
  const isElevated = userRole === UserRole.Admin;

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
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      editable: isElevated,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
      type: 'singleSelect',
      valueOptions: (params) => {
        const allowedRoles = getAllowedRoles(currentUserRole, params.row);
        const currentRole = roleOptions.find(
          (r) => r.value === params.row.role
        );
        if (
          currentRole &&
          !allowedRoles.some((r) => r.value === currentRole.value)
        ) {
          return [...allowedRoles, currentRole].map((r) => ({
            value: r.value,
            label: r.label,
          }));
        }
        return allowedRoles.map((r) => ({ value: r.value, label: r.label }));
      },
      renderCell: (params) => <RoleChip role={params.value} />,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 110,
      getActions: ({ id, row }: GridRowParams<UserDto>) => {
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
            disabled={!isElevated}
            onClick={handleEditClick(id)}
            color="primary"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            disabled={!isElevated}
            onClick={() => handlePromptDelete(row)}
            color="inherit"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
        ];
      },
    },
  ];

  const handlePromptDelete = (user: UserDto) => {
    if (!isElevated) return;
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
      showAlert('error', 'Unable to determine which user to delete.');
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.userId);
      showAlert('success', 'User deleted successfully');
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      mutate('users');
    } catch (err: any) {
      const message = err?.message || 'Failed to delete user.';
      showAlert('error', message);
    } finally {
      setIsDeleting(false);
    }
  };

  const processRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
  ) => {
    try {
      await updateUser(newRow as UserDto);
      showAlert('success', 'User details updated successfully');
      mutate('users');
      return { ...newRow };
    } catch (err: any) {
      showAlert('error', `Failed to update user: ${err.message}`);
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
        rows={users || []}
        columns={columns}
        getRowId={(r) => r.userId}
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
        loading={usersLoading || usersValidating}
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
        aria-labelledby="confirm-delete-user-title"
      >
        <DialogTitle id="confirm-delete-user-title">
          {`Remove ${deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}`.trim() : 'person'}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The selected person will be
            permanently removed from the platform if you continue.
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
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </span>
        </DialogActions>
      </Dialog>
    </>
  );
}
