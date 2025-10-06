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
import useSWR from 'swr';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { InstitutionDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { getAllInstitutions } from '@/app/_lib/actions/institution';
import { format } from 'date-fns';

export default function InstitutionUserDataGrid() {
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const {
    data: institutions,
    isLoading: institutionsLoading,
    isValidating: institutionsValidating,
  } = useSWR<InstitutionDto[]>('institutions', getAllInstitutions, {
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
      field: 'name',
      headerName: 'Institution Name',
      flex: 1,
      minWidth: 200,
      editable: isElevated,
    },
    {
      field: 'adminEmail',
      headerName: 'Admin Email',
      flex: 1,
      minWidth: 200,
      editable: isElevated,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span
          style={{ color: params.value ? 'green' : 'red', fontWeight: 500 }}
        >
          {params.value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
      renderCell: (params) => {
        if (!params.value) return '';
        return format(new Date(params.value), 'MM/dd/yyyy');
      },
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
              key="view"
              icon={<SaveIcon />}
              label="view"
              onClick={handleSaveClick(id)}
              color="primary"
              style={{ border: 0, backgroundColor: 'transparent' }}
            />,
            <GridActionsCellItem
              key="enable"
              icon={<CancelIcon />}
              label="enable"
              onClick={handleCancelClick(id)}
              color="inherit"
              style={{ border: 0, backgroundColor: 'transparent' }}
            />,
            <GridActionsCellItem
              key="delete"
              icon={<CancelIcon />}
              label="delete"
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

  return (
    <EDataGrid
      checkboxSelection={isElevated}
      rows={institutions || []}
      columns={columns}
      getRowId={(r) => r.id}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      editMode="row"
      initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
      pageSizeOptions={[10, 20, 50]}
      rowModesModel={rowModesModel}
      onRowModesModelChange={setRowModesModel}
      loading={institutionsLoading || institutionsValidating}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
      }}
    />
  );
}
