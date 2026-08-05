'use client';

import React from 'react';
import {
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridRowId,
  type GridRowParams,
} from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import EditIcon from '@mui/icons-material/Edit';
import useSWR from 'swr';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { type InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import {
  activateInstitution,
  deactivateInstitution,
  getInstitutions,
} from '@/app/_lib/actions/institutions';
import { formatSaDate, formatSaDateTime } from '@/app/_lib/utils/datetime';
import { Chip, FormControlLabel } from '@mui/material';
import ManageInstitutionModal from '../Modals/ManageInstitutionModal';
import {
  type PagedResult,
  type PaginationParams,
} from '@/app/_lib/interfaces/pagination';
import { useRegisterSearch } from '@/app/_lib/context/SearchContext';
import type { InstitutionGridRow, InstitutionUserDataGridProps } from './types';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SEARCH_CONTEXT_ID,
  SEARCH_PLACEHOLDER,
  SEARCH_DEBOUNCE_MS,
  DATA_GRID_SLOT_PROPS,
} from './constants';
import {
  sanitizeOptionalInput,
  mapInstitutionsToRows,
  getRowClassName,
} from './utils';

export default function InstitutionUserDataGrid({
  initialInstitutionsPage,
}: InstitutionUserDataGridProps = {}) {
  const [statusUpdating, setStatusUpdating] = React.useState<Set<string>>(
    new Set()
  );
  const [selectedInstitutionId, setSelectedInstitutionId] = React.useState<
    string | null
  >(null);
  const [manageModalOpen, setManageModalOpen] = React.useState(false);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  const [searchTerm, setSearchTermState] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const { data: session } = useSession();
  const { showAlert } = useAlert();

  const handleSearch = React.useCallback((term: string) => {
    setSearchTermState(term);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  useRegisterSearch({
    id: SEARCH_CONTEXT_ID,
    placeholder: SEARCH_PLACEHOLDER,
    onSearch: handleSearch,
    debounceMs: SEARCH_DEBOUNCE_MS,
  });

  const normalizedSearchKey = React.useMemo(
    () => sanitizeOptionalInput(searchTerm) ?? '',
    [searchTerm]
  );

  const institutionsKey = React.useMemo(
    () =>
      [
        'institutions',
        paginationModel.page,
        paginationModel.pageSize,
        normalizedSearchKey,
      ] as const,
    [paginationModel.page, paginationModel.pageSize, normalizedSearchKey]
  );

  const {
    data: institutionsPage,
    isLoading: institutionsLoading,
    isValidating: institutionsValidating,
    mutate: mutateInstitutions,
  } = useSWR<PagedResult<InstitutionWithAdminDto>>(
    institutionsKey,
    () => {
      const pageIndex = paginationModel.page;
      const size = Number.isFinite(paginationModel.pageSize)
        ? paginationModel.pageSize
        : DEFAULT_PAGE_SIZE;

      const params: PaginationParams = {
        pageNumber: pageIndex + 1,
        pageSize: size,
      };

      if (normalizedSearchKey) {
        params.searchTerm = normalizedSearchKey;
      }

      return getInstitutions(params);
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: true,
      fallbackData:
        paginationModel.page === 0 && !normalizedSearchKey
          ? initialInstitutionsPage
          : undefined,
      revalidateOnMount:
        paginationModel.page !== 0 || !!normalizedSearchKey || !initialInstitutionsPage,
    }
  );

  React.useEffect(() => {
    if (typeof institutionsPage?.totalCount === 'number') {
      setRowCount(institutionsPage.totalCount);
    }
  }, [institutionsPage?.totalCount]);

  const currentUserRole = session?.user?.role as UserRole;

  const userRole = Number(currentUserRole);
  const isElevated = userRole === UserRole.PlatformAdmin;

  const openManageModal = React.useCallback((id: string) => {
    setSelectedInstitutionId(id);
    setManageModalOpen(true);
  }, []);

  const closeManageModal = React.useCallback(() => {
    setManageModalOpen(false);
    setSelectedInstitutionId(null);
  }, []);

  const handleModalUpdated = React.useCallback(() => {
    void mutateInstitutions();
  }, [mutateInstitutions]);

  const handleEditClick = React.useCallback(
    (id: GridRowId) => () => {
      if (!isElevated) return;
      openManageModal(String(id));
    },
    [isElevated, openManageModal]
  );

  const handleRowDoubleClick = React.useCallback(
    (params: GridRowParams<InstitutionGridRow>) => {
      if (!isElevated) return;
      openManageModal(String(params.id));
    },
    [isElevated, openManageModal]
  );

  const handleStatusToggle = React.useCallback(
    async (id: string, nextStatus: boolean) => {
      if (!isElevated || !id) return;

      setStatusUpdating((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });

      mutateInstitutions(
        (previous) =>
          previous
            ? {
              ...previous,
              items: previous.items.map((entry) =>
                entry.institution?.id === id
                  ? {
                    ...entry,
                    institution: {
                      ...entry.institution,
                      isActive: nextStatus,
                    },
                  }
                  : entry
              ),
            }
            : previous,
        false
      );

      try {
        if (nextStatus) {
          await activateInstitution(id);
          showAlert('success', 'Institution activated successfully.');
        } else {
          await deactivateInstitution(id);
          showAlert('success', 'Institution deactivated successfully.');
        }
        await mutateInstitutions();
      } catch (error) {
        console.error('Failed to toggle institution status', error);
        showAlert('error', 'Unable to update institution status.');
        await mutateInstitutions();
      } finally {
        setStatusUpdating((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [isElevated, mutateInstitutions, showAlert]
  );

  const rows = React.useMemo<InstitutionGridRow[]>(
    () => mapInstitutionsToRows(institutionsPage?.items),
    [institutionsPage?.items]
  );

  const columns: GridColDef<InstitutionGridRow>[] = [
    {
      field: 'name',
      headerName: 'Institution Name',
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: 'adminName',
      headerName: 'Admin Name',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => params.row.adminName || '—',
    },
    {
      field: 'adminEmail',
      headerName: 'Admin Email',
      flex: 1,
      minWidth: 200,
      editable: false,
    },
    {
      field: 'plan',
      headerName: 'Plan',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          size="small"
          color="primary"
          variant="outlined"
          label={params.value ?? '—'}
          sx={{ ml: 1 }}
        />
      ),
    },
    {
      field: 'creatorEnabled',
      headerName: 'Creator Add-on',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value ? 'success' : 'default'}
          label={params.value ? 'Enabled' : 'Disabled'}
          sx={{ ml: 1 }}
        />
      ),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const active = Boolean(params.row.isActive);

        return (
          <Chip
            size="small"
            color={active ? 'success' : 'error'}
            label={active ? 'Active' : 'Inactive'}
            sx={{ ml: 1 }}
          />
        );
      },
    },
    {
      field: 'statusToggle',
      headerName: 'Activate/Deactivate',
      flex: 1,
      minWidth: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const institutionId = params.row.id;
        const checked = Boolean(params.row.isActive);
        const isUpdating = statusUpdating.has(institutionId);

        return (
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                size="small"
                onChange={(_, value) =>
                  handleStatusToggle(institutionId, value)
                }
                disabled={!isElevated || isUpdating || !institutionId}
              />
            }
            label={isUpdating ? <CircularProgress size={16} /> : ''}
          />
        );
      },
    },
    {
      field: 'lastActiveAt',
      headerName: 'Last active',
      flex: 1,
      minWidth: 140,
      editable: false,
      renderCell: (params) => {
        const value = params.row.lastActiveAt;
        if (!value) return '—';
        return formatSaDateTime(value, '—');
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 120,
      editable: false,
      renderCell: (params) => {
        const value = params.row.updatedAt;
        if (!value) return '';
        return formatSaDate(value, '');
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          disabled={!isElevated}
          onClick={handleEditClick(id)}
          color="primary"
          style={{ border: 0, backgroundColor: 'transparent' }}
        />,
      ],
    },
  ];

  return (
    <>
      <EDataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        getRowClassName={(params) =>
          getRowClassName(params.indexRelativeToCurrentPage)
        }
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{
          pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
        }}
        pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
        rowCount={rowCount}
        mobileHiddenFields={[
          'adminEmail',
          'creatorEnabled',
          'statusToggle',
          'updatedAt',
        ]}
        loading={institutionsLoading || institutionsValidating}
        onRowDoubleClick={handleRowDoubleClick}
        slotProps={DATA_GRID_SLOT_PROPS}
      />
      <ManageInstitutionModal
        open={manageModalOpen}
        institutionId={selectedInstitutionId}
        onClose={closeManageModal}
        onUpdated={handleModalUpdated}
      />
    </>
  );
}
