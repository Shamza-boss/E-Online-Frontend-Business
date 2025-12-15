'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { FileDto } from '@/app/_lib/interfaces/types';

import { useLibraryFiles } from './hooks/useLibraryFiles';
import { useFileUpload } from './hooks/useFileUpload';
import { useThumbnails } from './hooks/useThumbnails';
import { useUserPermissions } from './hooks/useUserPermissions';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import ManageDialog from './ManageDialog';
import PreviewDialog from './PreviewDialog';

const extractName = (fileKey: string) => {
  return fileKey.split('_').pop() ?? fileKey;
};

export default function LibraryView() {
  const { showAlert } = useAlert();
  const { canManage, institutionId } = useUserPermissions();
  const { files, isFetching, mutate } = useLibraryFiles();
  const { thumbnails, loadingThumbnails } = useThumbnails(files);
  const {
    selectedUploadFile,
    uploadIsPublic,
    uploading,
    uploadThumbnail,
    setUploadIsPublic,
    handleFileSelection,
    handleUpload,
  } = useFileUpload(institutionId);

  const [manageOpen, setManageOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileDto | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleVisibility = async (file: FileDto) => {
    try {
      setTogglingId(file.id);
      const { useToggleFileVisibility } = await import('./hooks/useLibraryFiles');
      const { handleToggle } = useToggleFileVisibility();
      await handleToggle(file);
      await mutate();
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      await mutate();
    } catch (error) {
      console.error('[UploadRepositoryFile]', error);
      showAlert('error', 'File upload failed. Please try again.');
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 }, width: '100%' }}>
      <LibraryHeader
        canManage={canManage}
        isFetching={isFetching}
        onRefresh={() => mutate()}
        onPublishClick={() => setManageOpen(true)}
      />

      <LibraryGrid
        files={files}
        isFetching={isFetching}
        thumbnails={thumbnails}
        loadingThumbnails={loadingThumbnails}
        onFilePreview={setPreviewFile}
      />

      <ManageDialog
        open={manageOpen}
        files={files}
        togglingId={togglingId}
        selectedFile={selectedUploadFile}
        uploadIsPublic={uploadIsPublic}
        uploading={uploading}
        uploadThumbnail={uploadThumbnail}
        onClose={() => setManageOpen(false)}
        onToggleVisibility={handleToggleVisibility}
        onPreview={setPreviewFile}
        onFileChange={handleFileChange}
        onPublicToggle={setUploadIsPublic}
        onUpload={handleUploadClick}
      />

      <PreviewDialog file={previewFile} onClose={() => setPreviewFile(null)} />
    </Box>
  );
}
