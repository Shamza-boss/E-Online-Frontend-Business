'use client';

import React, { useCallback, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteIcon from '@mui/icons-material/Delete';
import useSWR from 'swr';
import { format } from 'date-fns';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Homework } from '../../../_lib/interfaces/types';
import {
  listTeacherClassroomModules,
  publishHomework,
  unpublishHomework,
  softDeleteHomework,
} from '../../../_lib/actions/homework';
import { useAlert } from '../../../_lib/components/alert/AlertProvider';
import EDataGrid from '../../_components/EDataGrid';

type HomeworkRow = Homework & { __gridId: string };

interface ModulesPanelProps {
  teacherId: string;
  classroomId: string;
  refreshIndex: number;
  onEdit: (homeworkId: string) => void | Promise<void>;
  onAfterChange?: () => void;
}

const ModulesPanel: React.FC<ModulesPanelProps> = ({
  teacherId,
  classroomId,
  refreshIndex,
  onEdit,
  onAfterChange,
}) => {
  const { showAlert } = useAlert();
  const { data, isLoading, mutate } = useSWR<Homework[]>(
    teacherId && classroomId
      ? ['teacher-drafts', teacherId, classroomId, refreshIndex]
      : null,
    () => listTeacherClassroomModules(teacherId, classroomId)
  );

  const modules = useMemo(() => {
    if (!data) return [] as Homework[];
    return data.filter((module) => module.isActive ?? true);
  }, [data]);

  const rows = useMemo<HomeworkRow[]>(
    () =>
      modules.map((module, index) => ({
        ...module,
        __gridId:
          module.homeworkId ??
          module.id ??
          `${module.title || 'module'}-${index}`,
      })),
    [modules]
  );

  const resolveModuleId = useCallback(
    (module: HomeworkRow) => module.homeworkId ?? module.id ?? '',
    []
  );

  const handlePublish = useCallback(
    async (homeworkId: string) => {
      try {
        await publishHomework(teacherId, homeworkId);
        showAlert('success', 'Module published successfully');
        await mutate();
        onAfterChange?.();
      } catch (error: any) {
        console.error('Failed to publish module', error);
        showAlert(
          'error',
          "Couldn't publish the module. Please try again in a moment."
        );
      }
    },
    [mutate, onAfterChange, showAlert, teacherId]
  );

  const handleUnpublish = useCallback(
    async (homeworkId: string) => {
      try {
        await unpublishHomework(teacherId, homeworkId);
        showAlert('success', 'Module moved back to draft');
        await mutate();
        onAfterChange?.();
      } catch (error: any) {
        console.error('Failed to unpublish module', error);
        showAlert(
          'error',
          "Couldn't unpublish the module. Please try again in a moment."
        );
      }
    },
    [mutate, onAfterChange, showAlert, teacherId]
  );

  const handleDelete = useCallback(
    async (homeworkId: string) => {
      try {
        await softDeleteHomework(teacherId, homeworkId);
        showAlert('success', 'Module deleted successfully');
        await mutate();
        onAfterChange?.();
      } catch (error: any) {
        console.error('Failed to delete module', error);
        showAlert(
          'error',
          "Couldn't delete the module. Please try again in a moment."
        );
      }
    },
    [mutate, onAfterChange, showAlert, teacherId]
  );

  const columns = useMemo<GridColDef<HomeworkRow>[]>(
    () => [
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
          row.dueDate ? `${format(new Date(row.dueDate), 'MMM d, yyyy')}` : '—',
      },
      {
        field: 'expiryDate',
        headerName: 'Expiry',
        width: 140,
        renderCell: ({ row }) =>
          row.hasExpiry && row.expiryDate ? (
            <Chip
              size="small"
              label={format(new Date(row.expiryDate), 'MMM d, yyyy')}
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
          const actionStyle = {
            border: 0,
            backgroundColor: 'transparent',
          } as const;

          return [
            <GridActionsCellItem
              key={`edit-${moduleId}`}
              icon={<EditIcon fontSize="small" />}
              label="Edit module"
              onClick={() => moduleId && onEdit(moduleId)}
              disabled={disabled}
              showInMenu={false}
              style={actionStyle}
            />,
            row.isPublished ? (
              <GridActionsCellItem
                key={`unpublish-${moduleId}`}
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
                style={actionStyle}
              />
            ) : (
              <GridActionsCellItem
                key={`publish-${moduleId}`}
                icon={<PublishIcon fontSize="small" />}
                label="Publish module"
                onClick={() => moduleId && handlePublish(moduleId)}
                disabled={disabled}
                showInMenu={false}
                style={actionStyle}
              />
            ),
            <GridActionsCellItem
              key={`delete-${moduleId}`}
              icon={<DeleteIcon fontSize="small" />}
              label="Delete draft"
              onClick={() => moduleId && handleDelete(moduleId)}
              disabled={disabled}
              showInMenu={false}
              style={{
                ...actionStyle,
                color: 'var(--mui-palette-error-main)',
              }}
            />,
          ];
        },
      },
    ],
    [handleDelete, handlePublish, handleUnpublish, onEdit, resolveModuleId]
  );

  const NoRowsOverlay = useMemo(
    () =>
      function CustomNoRowsOverlay() {
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1,
              p: 2,
            }}
          >
            <Typography variant="subtitle1">No modules yet.</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new module or edit one of your drafts to get started.
            </Typography>
          </Box>
        );
      },
    []
  );

  return (
    <EDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.__gridId}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      loading={isLoading}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 },
        },
      }}
      slots={{ noRowsOverlay: NoRowsOverlay }}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
      }}
    />
  );
};

export default ModulesPanel;
