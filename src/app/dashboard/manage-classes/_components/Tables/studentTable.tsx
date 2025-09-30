'use client';

import React, { useEffect } from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowModel,
} from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { UserRole } from '../../../../_lib/Enums/UserRole';
import { useAlert } from '../../../../_lib/components/alert/AlertProvider';
import {
  getAllowedRoles,
  roleOptions,
} from '../../../../_lib/common/functions';
import { RoleChip } from '../../../../_lib/components/role/roleChip';
import useSWR, { mutate } from 'swr';
import { UserDto } from '../../../../_lib/interfaces/types';
import EDataGrid from '../../../_components/EDataGrid';

interface ManagementDataGridProps {
  userData: UserDto[] | undefined;
  usersLoading: boolean;
  handleSeeHomeworkClick: (id: GridRowId) => () => void;
}

export default function StudentDatagridTable({
  userData,
  usersLoading,
  handleSeeHomeworkClick,
}: ManagementDataGridProps) {
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const userRole = Number(session?.user?.role);
  const isElevated = userRole === UserRole.Teacher;

  const [rows, setRows] = React.useState(userData);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [isLoading, setIsloading] = React.useState<boolean>(usersLoading);

  const currentUserRole = session?.user?.role as UserRole;

  useEffect(() => {
    setRows(userData);
  }, [userData]);

  useEffect(() => {
    setIsloading(usersLoading);
  }, [usersLoading]);
  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1, editable: false },
    { field: 'lastName', headerName: 'Last Name', flex: 1, editable: false },
    { field: 'email', headerName: 'Email', flex: 1, editable: false },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      editable: false,
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
        return [
          <GridActionsCellItem
            key={`see-assignments-${id}`}
            icon={<ChecklistRtlIcon />}
            label="See Assignments"
            disabled={!isElevated}
            onClick={handleSeeHomeworkClick(id)}
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
      const res = await fetch(`/api/users/${newRow.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const updated = await res.json();
      showAlert('success', 'User details updated successfully');

      // Update SWR cache
      mutate((current: any) => {
        return current.map((user: any) =>
          user.userId === newRow.userId ? { ...user, ...updated } : user
        );
      }, false);

      return { ...newRow, ...updated };
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
      rows={rows}
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
      loading={isLoading}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
      }}
    />
  );
}
