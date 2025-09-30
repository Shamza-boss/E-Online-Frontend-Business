'use client';

import React, { useState } from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { ClassroomDetailsDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { getAllClassroomsAndData } from '@/app/_lib/actions/classroom';
import useSWR from 'swr';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useSession } from 'next-auth/react';

export default function ClassManagementDataGrid() {
  const { data: session } = useSession();
  const userRole = Number(session?.user?.role);
  const isElevated =
    userRole === UserRole.Admin || userRole === UserRole.Moderator;

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const {
    data: classes,
    isLoading: classLoading,
    isValidating: classValidating,
  } = useSWR<ClassroomDetailsDto[]>('classes', getAllClassroomsAndData, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });

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
      headerName: 'Class name',
      flex: 1,
      minWidth: 150,
      editable: isElevated,
    },
    {
      field: 'teacherFirstName',
      headerName: 'Teacher name',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
    },
    {
      field: 'teacherLastName',
      headerName: 'Teacher last name',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
    },
    {
      field: 'numberOfUsers',
      headerName: 'Users in class',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
    },
    {
      field: 'academicLevelName',
      headerName: 'Academic level',
      flex: 1,
      minWidth: 130,
      editable: isElevated,
    },
    {
      field: 'subjectName',
      headerName: 'Subject name',
      flex: 1,
      minWidth: 130,
      editable: isElevated,
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 1,
      minWidth: 120,
      editable: isElevated,
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
            onClick={handleEditClick(id)}
            disabled={!isElevated}
            color="primary"
            style={{ border: 0, backgroundColor: 'transparent' }}
          />,
        ];
      },
    },
  ];

  //publish update API route
  // const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
  //     try {
  //         const res = await fetch(`/api/users/${newRow.userId}`, {
  //             method: 'PUT',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify(newRow),
  //         })
  //         if (!res.ok) {
  //             const err = await res.text()
  //             throw new Error(err)
  //         }
  //         const updated = await res.json()
  //         showAlert('success', 'User updated successfully')
  //         return { ...newRow, ...updated }
  //     } catch (err: any) {
  //         showAlert('error', `Failed to update user: ${err.message}`)
  //         return oldRow
  //     }
  // }

  // const handleRowUpdateError = (error: Error) => {
  //     showAlert('error', `Failed to update row: ${error.message}`)
  // }

  return (
    <EDataGrid
      checkboxSelection={isElevated}
      rows={classes}
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
      // processRowUpdate={processRowUpdate}
      // onProcessRowUpdateError={handleRowUpdateError}
      loading={classLoading || classValidating}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
      }}
    />
  );
}
