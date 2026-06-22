'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { Chip, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { LibraryFileDto } from '@/app/_lib/interfaces/types';
import {
  extractTextbookName,
  formatLinkedCoursesTooltip,
  formatTextbookFileSize,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';

interface LibraryTableProps {
  files: LibraryFileDto[];
  rowCount: number;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onRead: (file: LibraryFileDto) => void;
}

function buildCourseUrl(classroom: { id: string; name: string }): string {
  return `/dashboard/courses/${encodeURIComponent(`${classroom.name}~${classroom.id}`)}`;
}

function linkedCoursesLabel(file: LibraryFileDto): string {
  const linked = file.linkedClassrooms ?? [];
  if (linked.length === 0) return 'Unlinked';
  if (linked.length === 1) return linked[0].name;
  return `${linked.length} courses`;
}

function gradesLabel(file: LibraryFileDto): string {
  const grades = [
    ...new Set(
      (file.linkedClassrooms ?? [])
        .map((c) => c.academicLevelName)
        .filter(Boolean)
    ),
  ];
  return grades.length ? grades.join(', ') : '—';
}

export default function LibraryTable({
  files,
  rowCount,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onRead,
}: LibraryTableProps) {
  const router = useRouter();

  const handleRead = useCallback(
    (file: LibraryFileDto) => () => onRead(file),
    [onRead]
  );

  const columns = useMemo<GridColDef<LibraryFileDto>[]>(
    () => [
      {
        field: 'fileName',
        headerName: 'Textbook',
        flex: 1.4,
        minWidth: 180,
        valueGetter: (_, row) => extractTextbookName(row),
      },
      {
        field: 'fileSizeBytes',
        headerName: 'Size',
        flex: 0.6,
        minWidth: 110,
        valueGetter: (_, row) => getFileSizeBytes(row),
        renderCell: ({ row }) => {
          const size = getFileSizeBytes(row);
          return (
            <Chip
              size="small"
              variant="outlined"
              label={size != null ? formatTextbookFileSize(size) : 'Size unknown'}
            />
          );
        },
      },
      {
        field: 'linkedClassrooms',
        headerName: 'Linked courses',
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        renderCell: ({ row }) => (
          <Tooltip title={formatLinkedCoursesTooltip(row)}>
            <Chip
              size="small"
              icon={<MenuBookIcon />}
              label={linkedCoursesLabel(row)}
              variant="outlined"
              sx={{ maxWidth: '100%' }}
            />
          </Tooltip>
        ),
      },
      {
        field: 'grades',
        headerName: 'Grade',
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        renderCell: ({ row }) => {
          const label = gradesLabel(row);
          return label === '—' ? (
            <Chip size="small" label="—" variant="outlined" />
          ) : (
            <Tooltip title={label}>
              <Chip size="small" label={label} variant="outlined" sx={{ maxWidth: '100%' }} />
            </Tooltip>
          );
        },
      },
      {
        field: 'isPublic',
        headerName: 'Visibility',
        flex: 0.7,
        minWidth: 100,
        renderCell: ({ value }) => (
          <Chip
            size="small"
            label={value ? 'Public' : 'Private'}
            color={value ? 'success' : 'default'}
            variant="outlined"
          />
        ),
      },
      {
        field: 'uploadedAt',
        headerName: 'Uploaded',
        flex: 0.8,
        minWidth: 120,
        valueFormatter: (value: string | null) =>
          value ? new Date(value).toLocaleDateString() : '—',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        minWidth: 100,
        getActions: ({ row }: GridRowParams<LibraryFileDto>) => {
          const actions = [
            <GridActionsCellItem
              key="read"
              icon={
                <Tooltip title="Read textbook" arrow>
                  <VisibilityIcon color="primary" />
                </Tooltip>
              }
              label="Read"
              onClick={handleRead(row)}
            />,
          ];

          const firstCourse = (row.linkedClassrooms ?? [])[0];
          if (firstCourse) {
            actions.push(
              <GridActionsCellItem
                key="course"
                icon={
                  <Tooltip title={`Open ${firstCourse.name}`} arrow>
                    <SchoolIcon color="action" />
                  </Tooltip>
                }
                label="Course"
                onClick={() => router.push(buildCourseUrl(firstCourse) as any)}
              />
            );
          }

          return actions;
        },
      },
    ],
    [handleRead, router]
  );

  const dataGridSlotProps = useMemo(
    () => ({
      loadingOverlay: {
        variant: 'skeleton' as const,
        noRowsVariant: 'skeleton' as const,
      },
    }),
    []
  );

  const getRowClassName = useCallback(
    (params: { indexRelativeToCurrentPage: number }) =>
      params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd',
    []
  );

  return (
    <EDataGrid
      rows={files}
      columns={columns}
      getRowId={(row) => row.id}
      getRowClassName={getRowClassName}
      loading={loading}
      rowCount={rowCount}
      paginationMode="server"
      sortingMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      pageSizeOptions={[10, 20, 50]}
      disableRowSelectionOnClick
      slotProps={dataGridSlotProps}
    />
  );
}
