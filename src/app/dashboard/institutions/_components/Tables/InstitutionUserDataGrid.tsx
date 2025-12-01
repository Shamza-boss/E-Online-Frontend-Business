'use client';
import React from 'react';
import {
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
  GridRowParams,
} from '@mui/x-data-grid';
import { useSession } from 'next-auth/react';
import EditIcon from '@mui/icons-material/Edit';
import useSWR from 'swr';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import { InstitutionWithAdminDto } from '@/app/_lib/interfaces/types';
import EDataGrid from '@/app/dashboard/_components/EDataGrid';
import {
  activateInstitution,
  deactivateInstitution,
  getInstitutions,
} from '@/app/_lib/actions/institutions';
import { format } from 'date-fns';
import { Chip, FormControlLabel, FormLabel } from '@mui/material';
import ManageInstitutionModal from '../Modals/ManageInstitutionModal';
import {
  PagedResult,
  PaginationParams,
} from '@/app/_lib/interfaces/pagination';
import { useRegisterSearch } from '@/app/_lib/context/SearchContext';

const DEFAULT_PAGE_SIZE = 20;

const sanitizeOptionalInput = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower === 'undefined' ||
    lower === 'null' ||
    lower === '$undefined' ||
    lower === '$null'
  ) {
    return undefined;
  }

  return trimmed;
};

type InstitutionGridRow = {
  id: string;
  name: string;
  adminEmail: string;
  isActive: boolean;
  updatedAt?: string | null;
  adminFirstName?: string;
  adminLastName?: string;
  adminName: string;
};

export default function InstitutionUserDataGrid() {
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
    id: 'dashboard-institutions',
    placeholder: 'Search institutions',
    onSearch: handleSearch,
    debounceMs: 300,
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

  const rows = React.useMemo<InstitutionGridRow[]>(() => {
    if (!institutionsPage?.items) {
      return [];
    }

    return institutionsPage.items
      .filter((entry) => entry.institution?.id)
      .map((entry) => {
        const { institution, admin } = entry;
        const adminEmail = admin?.email ?? institution.adminEmail ?? '';
        const adminName = [admin?.firstName, admin?.lastName]
          .filter(Boolean)
          .join(' ')
          .trim();

        return {
          id: institution.id,
          name: institution.name,
          adminEmail,
          adminName,
          isActive: Boolean(institution.isActive),
          updatedAt: institution.updatedAt,
          adminFirstName: admin?.firstName ?? '',
          adminLastName: admin?.lastName ?? '',
        };
      });
  }, [institutionsPage?.items]);

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
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 120,
      editable: false,
      renderCell: (params) => {
        const value = params.row.updatedAt;
        if (!value) return '';
        return format(new Date(value), 'MM/dd/yyyy');
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

  const dataGridSlotProps = React.useMemo(
    () => ({
      loadingOverlay: {
        variant: 'linear-progress' as const,
        noRowsVariant: 'linear-progress' as const,
      },
    }),
    []
  );

  return (
    <>
      <EDataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{
          pagination: { paginationModel: { pageSize: DEFAULT_PAGE_SIZE } },
        }}
        pageSizeOptions={[10, 20, 50]}
        rowCount={rowCount}
        loading={institutionsLoading || institutionsValidating}
        onRowDoubleClick={handleRowDoubleClick}
        slotProps={dataGridSlotProps}
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
