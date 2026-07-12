'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pagination, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid';
import useSWR from 'swr';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import { type FileDto, type LibraryFileDto } from '@/app/_lib/interfaces/types';
import { getAllAcademics } from '@/app/_lib/actions/academics';

import {
  useLibraryFiles,
  useLibraryFilesPaged,
  useToggleFileVisibility,
} from '../hooks/useLibraryFiles';
import { useFileUpload } from '../hooks/useFileUpload';
import { useUserPermissions } from '../hooks/useUserPermissions';
import LibraryHeader from '../LibraryHeader';
import LibraryGrid from '../LibraryGrid';
import LibraryTable from '../LibraryTable';
import LibraryToolbar, { type LibraryViewMode } from '../LibraryToolbar';
import ManageDialog from '../ManageDialog';
import PreviewDialog from '../PreviewDialog';
import LibraryReaderFullscreenModal from '../LibraryReaderFullscreenModal';
import {
  TABLE_PAGE_SIZE,
  CARD_DEFAULT_PAGE_SIZE,
  CARD_MAX_PAGE_SIZE,
  librarySwrKeys,
  SEARCH_DEBOUNCE_MS,
  VIEW_MODE_KEY,
} from './constants';
import {
  extractName,
  useDebouncedValue,
  readStoredViewMode,
} from './utils';
import {
  LibraryRoot,
  LibraryHeaderSection,
  LibraryContentSection,
  LibraryCardsScrollArea,
  LibraryPaginationBar,
} from './elements';
import type { LibraryViewProps } from './types';

export default function LibraryView({ initialAcademics }: LibraryViewProps) {
  const { showAlert } = useAlert();
  const { canManage, institutionId } = useUserPermissions();

  const [viewMode, setViewMode] = useState<LibraryViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [academicLevelId, setAcademicLevelId] = useState('');
  const [unlinkedOnly, setUnlinkedOnly] = useState(false);
  const [cardPagination, setCardPagination] = useState({
    page: 0,
    pageSize: CARD_DEFAULT_PAGE_SIZE,
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'uploadedAt', sort: 'desc' },
  ]);
  const [rowCount, setRowCount] = useState(0);

  const [manageOpen, setManageOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileDto | null>(null);
  const [readerFile, setReaderFile] = useState<LibraryFileDto | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    setViewMode(readStoredViewMode());
  }, []);

  const debouncedSearch = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS);
  // Grade (and other filters) must debounce like search — each Select change was
  // firing a full paged repository query and stacking until the API timed out.
  const debouncedAcademicLevelId = useDebouncedValue(
    academicLevelId,
    SEARCH_DEBOUNCE_MS,
  );
  const debouncedUnlinkedOnly = useDebouncedValue(
    unlinkedOnly,
    SEARCH_DEBOUNCE_MS,
  );

  useEffect(() => {
    setCardPagination((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
    setPaginationModel((prev) =>
      prev.page === 0 ? prev : { ...prev, page: 0 },
    );
  }, [debouncedSearch, debouncedAcademicLevelId, debouncedUnlinkedOnly]);

  const sortField = sortModel[0]?.field ?? 'uploadedAt';
  const sortDirection = sortModel[0]?.sort ?? 'desc';

  const activePageNumber =
    viewMode === 'cards' ? cardPagination.page + 1 : paginationModel.page + 1;
  const activePageSize =
    viewMode === 'cards' ? cardPagination.pageSize : paginationModel.pageSize;

  const { files, totalCount, isFetching, mutate } = useLibraryFilesPaged({
    pageNumber: activePageNumber,
    pageSize: activePageSize,
    searchTerm: debouncedSearch || undefined,
    sortBy: sortField,
    sortDirection: sortDirection === 'asc' ? 'asc' : 'desc',
    academicLevelId: debouncedAcademicLevelId || undefined,
    unlinkedOnly: debouncedUnlinkedOnly || undefined,
  });

  const { files: manageFiles, mutate: mutateManageFiles } =
    useLibraryFiles(manageOpen);
  const { data: academicOptions = [] } = useSWR(librarySwrKeys.academics, getAllAcademics, {
    fallbackData: initialAcademics,
  });

  useEffect(() => {
    if (typeof totalCount === 'number') {
      setRowCount(totalCount);
    }
  }, [totalCount]);

  const {
    selectedUploadFile,
    uploadIsPublic,
    uploading,
    uploadThumbnail,
    setUploadIsPublic,
    handleFileSelection,
    handleUpload,
  } = useFileUpload(institutionId);

  const handleViewModeChange = useCallback((mode: LibraryViewMode) => {
    setViewMode(mode);
    window.localStorage.setItem(VIEW_MODE_KEY, mode);
  }, []);

  const handleRead = useCallback((file: LibraryFileDto) => {
    setReaderFile(file);
    setReaderOpen(true);
  }, []);

  const handleCloseReader = useCallback(() => {
    setReaderOpen(false);
    setReaderFile(null);
  }, []);

  const handleOpenFullReader = useCallback((file: LibraryFileDto) => {
    setPreviewFile(null);
    setReaderFile(file);
    setReaderOpen(true);
  }, []);

  const handleQuickPreview = useCallback((file: FileDto) => {
    setPreviewFile(file);
  }, []);

  const { handleToggle } = useToggleFileVisibility();

  const handleRefresh = useCallback(async () => {
    await Promise.all([mutate(), mutateManageFiles()]);
  }, [mutate, mutateManageFiles]);

  const handleToggleVisibility = async (file: FileDto) => {
    try {
      setTogglingId(file.id);
      await handleToggle(file);
      await handleRefresh();
      showAlert(
        'success',
        `${extractName(file.fileKey)} is now ${file.isPublic ? 'private' : 'public'}.`
      );
    } catch (error) {
      console.error('[ToggleFileVisibility]', error);
      showAlert('error', 'Unable to update file visibility. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    await handleFileSelection(file);
  };

  const handleUploadClick = async () => {
    if (!selectedUploadFile) {
      showAlert('warning', 'Select a PDF before uploading.');
      return;
    }

    try {
      const fileName = await handleUpload();
      showAlert('success', `${fileName} uploaded to the repository.`);
      await handleRefresh();
    } catch (error) {
      console.error('[UploadRepositoryFile]', error);
      showAlert('error', 'File upload failed. Please try again.');
    }
  };

  const manageDialogFiles = useMemo(
    () => (manageOpen ? manageFiles : []),
    [manageFiles, manageOpen]
  );

  const cardPageCount = Math.max(1, Math.ceil(rowCount / cardPagination.pageSize));

  const handleCardPageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCardPagination((prev) => ({ ...prev, page: page - 1 }));
    },
    []
  );

  const handleCardPageSizeChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, value: number | null) => {
      if (value !== CARD_DEFAULT_PAGE_SIZE && value !== CARD_MAX_PAGE_SIZE) return;
      setCardPagination({ page: 0, pageSize: value });
    },
    []
  );

  return (
    <LibraryRoot>
      <LibraryHeaderSection>
        <LibraryHeader
          canManage={canManage}
          isFetching={isFetching}
          onRefresh={() => void handleRefresh()}
          onPublishClick={() => setManageOpen(true)}
        />

        <LibraryToolbar
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          academicLevelId={academicLevelId}
          onAcademicLevelChange={setAcademicLevelId}
          academicOptions={academicOptions}
          unlinkedOnly={unlinkedOnly}
          onUnlinkedOnlyChange={setUnlinkedOnly}
        />
      </LibraryHeaderSection>

      <LibraryContentSection>
        {viewMode === 'cards' ? (
          <>
            <LibraryCardsScrollArea>
              <LibraryGrid
                files={files}
                isFetching={isFetching}
                onRead={handleRead}
              />
            </LibraryCardsScrollArea>
            {rowCount > 0 ? (
              <LibraryPaginationBar>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={cardPagination.pageSize}
                    onChange={handleCardPageSizeChange}
                    aria-label="Cards per page"
                  >
                    <ToggleButton value={CARD_DEFAULT_PAGE_SIZE}>
                      5 per page
                    </ToggleButton>
                    <ToggleButton value={CARD_MAX_PAGE_SIZE}>
                      10 per page
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Pagination
                    count={cardPageCount}
                    page={cardPagination.page + 1}
                    onChange={handleCardPageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    disabled={isFetching}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {rowCount} textbook{rowCount === 1 ? '' : 's'} total
                  </Typography>
                </Stack>
              </LibraryPaginationBar>
            ) : null}
          </>
        ) : (
          <OutlinedWrapper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              width: '100%',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            <LibraryTable
              files={files}
              rowCount={rowCount}
              loading={isFetching}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              onRead={handleRead}
            />
          </OutlinedWrapper>
        )}
      </LibraryContentSection>

      <ManageDialog
        open={manageOpen}
        files={manageDialogFiles}
        togglingId={togglingId}
        selectedFile={selectedUploadFile}
        uploadIsPublic={uploadIsPublic}
        uploading={uploading}
        uploadThumbnail={uploadThumbnail}
        onClose={() => setManageOpen(false)}
        onToggleVisibility={handleToggleVisibility}
        onPreview={handleQuickPreview}
        onFileChange={handleFileChange}
        onPublicToggle={setUploadIsPublic}
        onUpload={handleUploadClick}
      />

      <PreviewDialog
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onOpenFullReader={handleOpenFullReader}
      />

      <LibraryReaderFullscreenModal
        file={readerFile}
        open={readerOpen}
        onClose={handleCloseReader}
      />
    </LibraryRoot>
  );
}
