'use client';

import React, { useMemo, useState } from 'react';
import {
    GridActionsCellItem,
    GridColDef,
    GridRowModesModel,
    GridRowModel,
} from '@mui/x-data-grid';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import {
    getAllowedRoles,
    roleOptions,
} from '@/app/_lib/common/functions';
import { RoleChip } from '@/app/_lib/components/role/roleChip';
import EDataGrid from '../../../../_components/EDataGrid';
import { useSession } from 'next-auth/react';
import type { ManagementDataGridProps } from './interfaces';
import { processRowUpdate } from './utils';

export default function StudentDatagridTable({
    userData,
    usersLoading,
    handleSeeHomeworkClick,
}: ManagementDataGridProps) {
    const { data: session } = useSession();
    const { showAlert } = useAlert();
    const userRole = Number(session?.user?.role);
    const isElevated = userRole === UserRole.Instructor;

    const rows = useMemo(() => userData ?? [], [userData]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const isLoading = usersLoading;

    const currentUserRole = session?.user?.role as UserRole | undefined;
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
                const allowedRoles = currentUserRole
                    ? getAllowedRoles(currentUserRole, params.row)
                    : [];
                const currentRole = roleOptions.find(
                    (r) => r.value === params.row.role,
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

    const handleProcessRowUpdate = async (
        newRow: GridRowModel,
        oldRow: GridRowModel,
    ) => processRowUpdate(newRow, oldRow, showAlert);

    const handleRowUpdateError = (error: Error) => {
        showAlert('error', `Failed to update student: ${error.message}`);
    };

    const dataGridSlotProps = React.useMemo(
        () => ({
            loadingOverlay: {
                variant: 'linear-progress' as const,
                noRowsVariant: 'linear-progress' as const,
            },
        }),
        [],
    );

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
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleRowUpdateError}
            loading={isLoading}
            slotProps={dataGridSlotProps}
        />
    );
}
