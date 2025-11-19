'use client';

import { useState } from 'react';
import {
  registerRepositoryFile,
  uploadTextbook,
} from '@/app/_lib/actions/storage';
import { generatePdfThumbnail } from '@/app/_lib/utils/pdfThumbnail';

export const useFileUpload = (institutionId?: string) => {
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null
  );
  const [uploadIsPublic, setUploadIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null);

  const handleFileSelection = async (file: File | null) => {
    setSelectedUploadFile(file);
    setUploadThumbnail(null);
    if (file) {
      try {
        const thumb = await generatePdfThumbnail(file);
        setUploadThumbnail(thumb);
      } catch (err) {
        console.error('Failed to generate PDF thumbnail', err);
        setUploadThumbnail(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedUploadFile) {
      throw new Error('No file selected');
    }

    setUploading(true);
    try {
      const uploadResult = await uploadTextbook(selectedUploadFile);
      const payload: any = {
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

      setSelectedUploadFile(null);
      setUploadIsPublic(true);
      setUploadThumbnail(null);

      return selectedUploadFile.name;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setSelectedUploadFile(null);
    setUploadIsPublic(true);
    setUploadThumbnail(null);
  };

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
