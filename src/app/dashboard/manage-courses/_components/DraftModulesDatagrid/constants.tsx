import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import type { HomeworkRow } from './types';
import { resolveModuleId } from './utils';
import { formatSaDate, formatSaDateTime } from '@/app/_lib/utils/datetime';

const ACTION_STYLE = {
    border: 0,
    backgroundColor: 'transparent',
} as const;

export const buildColumns = (
    onEdit: (homeworkId: string) => void | Promise<void>,
    handlePublish: (homeworkId: string) => void,
    handleUnpublish: (homeworkId: string) => void,
    onRequestDelete: (homeworkId: string, title: string) => void,
): GridColDef<HomeworkRow>[] => [
    {
        field: 'title',
        headerName: 'Title',
        flex: 1.2,
        minWidth: 200,
    },
    {
        field: 'description',
        headerName: 'Description',
        flex: 1.5,
        minWidth: 240,
        renderCell: ({ row }) => `${row.description ?? ''}`,
    },
    {
        field: 'dueDate',
        headerName: 'Due date',
        width: 140,
        renderCell: ({ row }) =>
            row.dueDate ? formatSaDate(row.dueDate, '—') : '—',
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        width: 140,
        renderCell: ({ row }) =>
            row.createdAt ? formatSaDateTime(row.createdAt, '—') : '—',
    },
    {
        field: 'updatedAt',
        headerName: 'Updated',
        width: 140,
        renderCell: ({ row }) =>
            row.updatedAt ? formatSaDateTime(row.updatedAt, '—') : '—',
    },
    {
        field: 'expiryDate',
        headerName: 'Expiry',
        width: 140,
        renderCell: ({ row }) =>
            row.hasExpiry && row.expiryDate ? (
                <Chip
                    size="small"
                    label={formatSaDate(row.expiryDate, '—')}
                    color="warning"
                />
            ) : (
                <Chip size="small" label="No expiry" />
            ),
    },
    {
        field: 'isPublished',
        headerName: 'Status',
        width: 120,
        renderCell: ({ row }) => (
            <Chip
                size="small"
                color={row.isPublished ? 'success' : 'default'}
                label={row.isPublished ? 'Published' : 'Draft'}
            />
        ),
    },
    {
        field: 'completions',
        headerName: 'Completions',
        width: 150,
        renderCell: ({ row }) =>
            `${row.completions ?? 0}/${row.totalStudents ?? 0}`,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 220,
        sortable: false,
        filterable: false,
        type: 'actions',
        getActions: ({ row }) => {
            const moduleId = resolveModuleId(row);
            const disabled = !moduleId;
            const isPublished = row.isPublished ?? false;

            return [
                <Tooltip
                    key={`edit-${moduleId}`}
                    title={
                        isPublished
                            ? 'Cannot edit published modules. Unpublish first to make changes.'
                            : 'Edit this module'
                    }
                    arrow
                >
                    <span>
                        <GridActionsCellItem
                            icon={<EditIcon fontSize="small" />}
                            label="Edit module"
                            onClick={() => moduleId && onEdit(moduleId)}
                            disabled={isPublished}
                            showInMenu={false}
                            style={ACTION_STYLE}
                        />
                    </span>
                </Tooltip>,
                isPublished ? (
                    <Tooltip
                        key={`unpublish-${moduleId}`}
                        title="Move this module back to draft status"
                        arrow
                    >
                        <span>
                            <GridActionsCellItem
                                icon={
                                    <PublishIcon
                                        fontSize="small"
                                        sx={{ transform: 'rotate(180deg)' }}
                                    />
                                }
                                label="Move back to draft"
                                onClick={() => moduleId && handleUnpublish(moduleId)}
                                disabled={disabled}
                                showInMenu={false}
                                style={ACTION_STYLE}
                            />
                        </span>
                    </Tooltip>
                ) : (
                    <Tooltip
                        key={`publish-${moduleId}`}
                        title="Publish this module to make it visible to students"
                        arrow
                    >
                        <span>
                            <GridActionsCellItem
                                icon={<PublishIcon fontSize="small" />}
                                label="Publish module"
                                onClick={() => moduleId && handlePublish(moduleId)}
                                disabled={isPublished}
                                showInMenu={false}
                                style={ACTION_STYLE}
                            />
                        </span>
                    </Tooltip>
                ),
                <Tooltip
                    key={`delete-${moduleId}`}
                    title={
                        isPublished
                            ? 'Only draft modules can be deleted. Unpublish first to delete.'
                            : 'Delete this draft module'
                    }
                    arrow
                >
                    <span>
                        <GridActionsCellItem
                            icon={<DeleteIcon fontSize="small" />}
                            label="Delete draft"
                            onClick={() =>
                                moduleId &&
                                onRequestDelete(
                                    moduleId,
                                    row.title?.trim() || 'Untitled module',
                                )
                            }
                            disabled={disabled || isPublished}
                            showInMenu={false}
                        />
                    </span>
                </Tooltip>,
            ];
        },
    },
];
