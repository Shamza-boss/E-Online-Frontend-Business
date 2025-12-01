'use client';

import React from 'react';
import type { UploadResult } from '../interfaces/types';
import { uploadTextbook } from '../services/storageUpload';
import { generatePdfThumbnail } from '../utils/pdfThumbnail';

export type UploadStage = 'idle' | 'preview' | 'uploading';

export interface AssetUploadMetadata extends UploadResult {
  name: string;
  size: number;
}

export interface UseAssetUploadOptions {
  accept?: string[];
  maxSizeMb?: number;
  autoUpload?: boolean;
  uploadFn?: (file: File) => Promise<UploadResult>;
  getPreview?: (file: File) => Promise<string | null>;
  onUploaded?: (asset: AssetUploadMetadata, file: File) => void;
  onError?: (error: Error) => void;
}

export interface AssetUploadController {
  file: File | null;
  asset: AssetUploadMetadata | null;
  preview: string | null;
  stage: UploadStage;
  error: string | null;
  selectFile: (file: File | null) => Promise<void>;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  uploadSelected: () => Promise<UploadResult | null>;
  removeAsset: () => void;
  reset: () => void;
}

const DEFAULT_ACCEPT = ['application/pdf'];
const DEFAULT_MAX_SIZE = 100; // MB

const defaultPreviewGenerator = async (file: File) => {
  if (file.type !== 'application/pdf') {
    return null;
  }
  try {
    return await generatePdfThumbnail(file);
  } catch (error) {
    console.warn('[useAssetUpload] preview generation failed', error);
    return null;
  }
};

export function useAssetUpload(
  options: UseAssetUploadOptions = {}
): AssetUploadController {
  const {
    accept = DEFAULT_ACCEPT,
    maxSizeMb = DEFAULT_MAX_SIZE,
    autoUpload = true,
    uploadFn = uploadTextbook,
    getPreview = defaultPreviewGenerator,
    onUploaded,
    onError,
  } = options;

  const [file, setFile] = React.useState<File | null>(null);
  const [asset, setAsset] = React.useState<AssetUploadMetadata | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<UploadStage>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const reset = React.useCallback(() => {
    setFile(null);
    setAsset(null);
    setPreview(null);
    setStage('idle');
    setError(null);
  }, []);

  const removeAsset = React.useCallback(() => {
    setAsset(null);
    setFile(null);
    setPreview(null);
    setStage('idle');
  }, []);

  const runUpload = React.useCallback(
    async (targetFile: File): Promise<UploadResult> => {
      setStage('uploading');
      try {
        const uploaded = await uploadFn(targetFile);
        const metadata: AssetUploadMetadata = {
          ...uploaded,
          name: targetFile.name,
          size: targetFile.size,
        };
        setAsset(metadata);
        setStage('idle');
        onUploaded?.(metadata, targetFile);
        return uploaded;
      } catch (err) {
        const normalizedError =
          err instanceof Error ? err : new Error('Unable to upload file.');
        setError(normalizedError.message);
        setStage('idle');
        setAsset(null);
        onError?.(normalizedError);
        throw normalizedError;
      }
    },
    [onError, onUploaded, uploadFn]
  );

  const validateFile = React.useCallback(
    (incoming: File) => {
      if (accept && accept.length > 0 && !accept.includes(incoming.type)) {
        throw new Error('Unsupported file type.');
      }
      if (maxSizeMb && incoming.size > maxSizeMb * 1024 * 1024) {
        throw new Error(`File exceeds ${maxSizeMb}MB limit.`);
      }
    },
    [accept, maxSizeMb]
  );

  const selectFile = React.useCallback(
    async (incoming: File | null) => {
      if (!incoming) {
        reset();
        return;
      }

      try {
        validateFile(incoming);
      } catch (validationError) {
        const normalizedError =
          validationError instanceof Error
            ? validationError
            : new Error('Invalid file provided.');
        setError(normalizedError.message);
        onError?.(normalizedError);
        return;
      }

      setFile(incoming);
      setAsset(null);
      setError(null);
      setPreview(null);

      if (getPreview) {
        setStage('preview');
        try {
          const previewUrl = await getPreview(incoming);
          setPreview(previewUrl);
        } catch (previewError) {
          console.warn('[useAssetUpload] preview failed', previewError);
          setPreview(null);
        }
      }

      if (autoUpload) {
        await runUpload(incoming);
      } else {
        setStage('idle');
      }
    },
    [autoUpload, getPreview, onError, reset, runUpload, validateFile]
  );

  const handleInputChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const incomingFile = event.target.files?.[0] ?? null;
      await selectFile(incomingFile);
      event.target.value = '';
    },
    [selectFile]
  );

  const uploadSelected = React.useCallback(async () => {
    if (!file) {
      return null;
    }
    return runUpload(file);
  }, [file, runUpload]);

  return {
    file,
    asset,
    preview,
    stage,
    error,
    selectFile,
    handleInputChange,
    uploadSelected,
    removeAsset,
    reset,
  };
}
