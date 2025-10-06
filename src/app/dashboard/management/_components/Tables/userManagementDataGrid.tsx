'use client';
import React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowModel,
} from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import useSWR, { mutate } from 'swr';
import { getAllowedRoles, roleOptions } from '@/app/_lib/common/functions';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { UserDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { getAllUsers, updateUser } from '@/app/_lib/actions/users';

export default function UserManagementDataGrid() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
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
      width: 100,
      getActions: ({ id }) => {
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
        ];
      },
    },
  ];

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
  );
}
