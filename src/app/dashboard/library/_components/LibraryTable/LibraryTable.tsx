'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import { Box, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SchoolIcon from '@mui/icons-material/School';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import { LibraryFileDto } from '@/app/_lib/interfaces/types';
import {
  extractTextbookName,
  formatLinkedCoursesDisplay,
  formatLinkedCoursesTooltip,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';
import { LibrarySizeChip, LibraryVisibilityChip, formatLibraryDate } from '../LibraryChips';
import { TABLE_PAGE_SIZE_OPTIONS } from './constants';
import { GridCellText } from './elements';
import { buildCourseUrl, gradesLabel } from './utils';
import type { LibraryTableProps } from './interfaces';

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
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <LibrarySizeChip sizeBytes={getFileSizeBytes(row)} />
          </Box>
        ),
      },
      {
        field: 'linkedClassrooms',
        headerName: 'Linked courses',
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        valueGetter: (_, row) => formatLinkedCoursesDisplay(row),
        renderCell: ({ row }) => (
          <GridCellText title={formatLinkedCoursesTooltip(row)}>
            {formatLinkedCoursesDisplay(row)}
          </GridCellText>
        ),
      },
      {
        field: 'grades',
        headerName: 'Grade',
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        valueGetter: (_, row) => gradesLabel(row),
        renderCell: ({ row }) => {
          const label = gradesLabel(row);
          return (
            <GridCellText title={label === '—' ? undefined : label}>
              {label}
            </GridCellText>
          );
        },
      },
      {
        field: 'isPublic',
        headerName: 'Visibility',
        flex: 0.7,
        minWidth: 100,
        renderCell: ({ row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <LibraryVisibilityChip isPublic={row.isPublic} />
          </Box>
        ),
      },
      {
        field: 'uploadedAt',
        headerName: 'Uploaded',
        flex: 0.8,
        minWidth: 120,
        valueFormatter: (value: string | null) => formatLibraryDate(value),
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
      pageSizeOptions={[...TABLE_PAGE_SIZE_OPTIONS]}
      disableRowSelectionOnClick
      slotProps={dataGridSlotProps}
      sx={{
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    />
  );
}
