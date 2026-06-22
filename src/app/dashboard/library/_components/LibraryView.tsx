'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Pagination } from '@mui/material';
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import useSWR from 'swr';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import { FileDto, LibraryFileDto } from '@/app/_lib/interfaces/types';
import { getAllAcademics } from '@/app/_lib/actions/academics';

import {
  useLibraryFiles,
  useLibraryFilesPaged,
  useToggleFileVisibility,
} from './hooks/useLibraryFiles';
import { useFileUpload } from './hooks/useFileUpload';
import { useUserPermissions } from './hooks/useUserPermissions';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import LibraryTable from './LibraryTable';
import LibraryToolbar, { type LibraryViewMode } from './LibraryToolbar';
import ManageDialog from './ManageDialog';
import PreviewDialog from './PreviewDialog';
import LibraryReaderFullscreenModal from './LibraryReaderFullscreenModal';

const DEFAULT_PAGE_SIZE = 20;
const VIEW_MODE_KEY = 'library-view-mode';

const extractName = (fileKey: string) => fileKey.split('_').pop() ?? fileKey;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function readStoredViewMode(): LibraryViewMode {
  if (typeof window === 'undefined') return 'cards';
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  return stored === 'table' ? 'table' : 'cards';
}

export default function LibraryView() {
  const { showAlert } = useAlert();
  const { canManage, institutionId } = useUserPermissions();

  const [viewMode, setViewMode] = useState<LibraryViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [academicLevelId, setAcademicLevelId] = useState('');
  const [unlinkedOnly, setUnlinkedOnly] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
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

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, academicLevelId, unlinkedOnly]);

  const sortField = sortModel[0]?.field ?? 'uploadedAt';
  const sortDirection = sortModel[0]?.sort ?? 'desc';

  const { files, totalCount, isFetching, mutate } = useLibraryFilesPaged({
    pageNumber: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    searchTerm: debouncedSearch || undefined,
    sortBy: sortField,
    sortDirection: sortDirection === 'asc' ? 'asc' : 'desc',
    academicLevelId: academicLevelId || undefined,
    unlinkedOnly: unlinkedOnly || undefined,
  });

  const { files: manageFiles, mutate: mutateManageFiles } = useLibraryFiles();

  const { data: academicOptions = [] } = useSWR('academics-library', getAllAcademics);

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

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 4 },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
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
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {viewMode === 'cards' ? (
          <>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <LibraryGrid
                files={files}
                isFetching={isFetching}
                onRead={handleRead}
              />
            </Box>
            {rowCount > paginationModel.pageSize ? (
              <Box
                sx={{
                  flexShrink: 0,
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Pagination
                  count={Math.max(
                    1,
                    Math.ceil(rowCount / paginationModel.pageSize)
                  )}
                  page={paginationModel.page + 1}
                  onChange={(_, page) =>
                    setPaginationModel((prev) => ({ ...prev, page: page - 1 }))
                  }
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
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
      </Box>

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
    </Box>
  );
}
