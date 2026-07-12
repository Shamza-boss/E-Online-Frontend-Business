'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import useSWR from 'swr';
import type { Homework } from '@/app/_lib/interfaces/types';
import {
    listTeacherClassroomModules,
    publishHomework,
    unpublishHomework,
    softDeleteHomework,
} from '@/app/_lib/actions/homework';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import ConfirmDialog from '@/app/_lib/components/dialog/ConfirmDialog';
import EDataGrid from '../../../_components/EDataGrid';
import type { ModulesPanelProps } from './types';
import { NoRowsContainer } from './elements';
import {
    resolveModuleId,
    filterActiveModules,
    buildRows,
    handlePublishAction,
    handleUnpublishAction,
    handleDeleteAction,
} from './utils';
import { buildColumns } from './constants';

const ModulesDataGrid: React.FC<ModulesPanelProps> = ({
    teacherId,
    classroomId,
    refreshIndex,
    onEdit,
    onAfterChange,
    onRowClick,
}) => {
    const { showAlert } = useAlert();
    const [pendingDelete, setPendingDelete] = useState<{
        homeworkId: string;
        title: string;
    } | null>(null);
    const { data, isLoading, mutate } = useSWR<Homework[]>(
        teacherId && classroomId
            ? ['teacher-drafts', teacherId, classroomId, refreshIndex]
            : null,
        () => listTeacherClassroomModules(teacherId, classroomId),
    );

    const modules = useMemo(() => filterActiveModules(data), [data]);
    const rows = useMemo(() => buildRows(modules), [modules]);

    const handlePublish = useCallback(
        (homeworkId: string) =>
            handlePublishAction(homeworkId, teacherId, publishHomework, showAlert, mutate, onAfterChange),
        [mutate, onAfterChange, showAlert, teacherId],
    );

    const handleUnpublish = useCallback(
        (homeworkId: string) =>
            handleUnpublishAction(homeworkId, teacherId, unpublishHomework, showAlert, mutate, onAfterChange),
        [mutate, onAfterChange, showAlert, teacherId],
    );

    const handleRequestDelete = useCallback(
        (homeworkId: string, title: string) => {
            setPendingDelete({ homeworkId, title });
        },
        [],
    );

    const handleCancelDelete = useCallback(() => {
        setPendingDelete(null);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!pendingDelete) return;

        const { homeworkId } = pendingDelete;
        setPendingDelete(null);

        await handleDeleteAction(
            homeworkId,
            teacherId,
            softDeleteHomework,
            showAlert,
            mutate,
            onAfterChange,
        );
    }, [mutate, onAfterChange, pendingDelete, showAlert, teacherId]);

    const columns = useMemo(
        () => buildColumns(onEdit, handlePublish, handleUnpublish, handleRequestDelete),
        [handlePublish, handleRequestDelete, handleUnpublish, onEdit],
    );

    const deleteDialogTitle = pendingDelete?.title
        ? `Delete "${pendingDelete.title}"?`
        : 'Delete module?';

    const deleteDialogDescription = pendingDelete
        ? `You are about to delete the draft module "${pendingDelete.title}". It will be removed from this course and cannot be recovered.`
        : undefined;

    const NoRowsOverlay = useMemo(
        () =>
            function CustomNoRowsOverlay() {
                return (
                    <NoRowsContainer>
                        <Typography variant="subtitle1">No modules yet.</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Click <strong>Create module</strong> above to build your first
                            homework assignment.
                        </Typography>
                    </NoRowsContainer>
                );
            },
        [],
    );

    const dataGridSlotProps = useMemo(
        () => ({
            loadingOverlay: {
                variant: 'skeleton' as const,
                noRowsVariant: 'skeleton' as const,
            },
        }),
        [],
    );

    const handleRowClick = useCallback(
        (params: any) => {
            const moduleId = resolveModuleId(params.row);
            if (moduleId && onRowClick) {
                onRowClick(moduleId);
            }
        },
        [onRowClick],
    );

    return (
        <>
            <EDataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.__gridId}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                loading={isLoading}
                onRowClick={handleRowClick}
                mobileHiddenFields={['description', 'expiryDate', 'completions']}
                sx={{
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                    },
                }}
                slots={{ noRowsOverlay: NoRowsOverlay }}
                slotProps={dataGridSlotProps}
            />
            <ConfirmDialog
                open={Boolean(pendingDelete)}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title={deleteDialogTitle}
                description={deleteDialogDescription}
                confirmText="Delete"
            />
        </>
    );
};

export default ModulesDataGrid;
