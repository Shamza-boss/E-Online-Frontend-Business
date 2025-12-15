'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  registerRepositoryFile,
  type RegisterRepositoryFilePayload,
} from '@/app/_lib/actions/storage';
import { useAssetUpload } from '@/app/_lib/hooks/useAssetUpload';

export const useFileUpload = (institutionId?: string) => {
  const [uploadIsPublic, setUploadIsPublic] = useState(true);
  const {
    file: selectedUploadFile,
    preview: uploadThumbnail,
    stage,
    selectFile,
    uploadSelected,
    reset: resetController,
  } = useAssetUpload({ autoUpload: false });

  const uploading = useMemo(() => stage === 'uploading', [stage]);

  const handleFileSelection = useCallback(
    async (file: File | null) => {
      await selectFile(file);
    },
    [selectFile]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedUploadFile) {
      throw new Error('No file selected');
    }
    const latestFileName = selectedUploadFile.name;
    const uploadResult = await uploadSelected();
    if (!uploadResult) {
      throw new Error('Upload failed');
    }

    const payload: RegisterRepositoryFilePayload & { thumbnail?: string } = {
      fileKey: uploadResult.key,
      url: uploadResult.proxyDownload,
      hash: uploadResult.hash,
      isPublic: uploadIsPublic,
      institutionId,
    };
    if (uploadThumbnail) {
      payload.thumbnail = uploadThumbnail;
    }
    await registerRepositoryFile(payload);

    resetController();
    setUploadIsPublic(true);
    return latestFileName;
  }, [
    institutionId,
    resetController,
    selectedUploadFile,
    uploadIsPublic,
    uploadSelected,
    uploadThumbnail,
  ]);

  const reset = useCallback(() => {
    resetController();
    setUploadIsPublic(true);
  }, [resetController]);

  return {
    selectedUploadFile,
    uploadIsPublic,
    uploading,
    uploadThumbnail,
    setUploadIsPublic,
    handleFileSelection,
    handleUpload,
    reset,
  };
};
