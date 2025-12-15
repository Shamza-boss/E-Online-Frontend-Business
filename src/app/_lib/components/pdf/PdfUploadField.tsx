'use client';

import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { PdfMeta } from '../../interfaces/types';
import { uploadPdfAsset } from '../../services/storageUpload';
import PDFViewer from '../PDFViewer/PDFViewer';

interface PdfUploadFieldProps {
  value?: PdfMeta;
  onChange: (pdf: PdfMeta | undefined) => void;
  disabled?: boolean;
}

const MAX_SIZE_MB = 50;

const prettyFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
};

export const PdfUploadField: React.FC<PdfUploadFieldProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      resetInput();
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      resetInput();
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await uploadPdfAsset(file);

      const nextMeta: PdfMeta = {
        provider: value?.provider?.trim() || 'r2',
        key: result.key,
        url: result.presignedGet,
        hash: result.hash,
        sizeBytes: file.size,
        title: file.name,
      };

      onChange(nextMeta);
    } catch (err) {
      console.error('Failed to upload PDF asset', err);
      setError(
        err instanceof Error ? err.message : 'Unable to upload the PDF file.'
      );
    } finally {
      setUploading(false);
      resetInput();
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
    resetInput();
  };

  return (
    <Box sx={{ mt: 1 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {!value && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleSelectFile}
          disabled={disabled || uploading}
          sx={{ py: 1.5 }}
        >
          Upload PDF
        </Button>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploading document…
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {value && !uploading && (
        <Paper sx={{ mt: 2, p: 2 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PictureAsPdfIcon color="error" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {value.title || 'Uploaded document'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.key}
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <Button
                size="small"
                color="primary"
                onClick={handleSelectFile}
                disabled={disabled}
              >
                Replace PDF
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemove}
                disabled={disabled}
              >
                Remove
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                size="small"
                label={`Provider: ${value.provider || 'r2'}`}
                variant="outlined"
              />
              <Chip
                size="small"
                label={prettyFileSize(value.sizeBytes)}
                variant="outlined"
              />
            </Stack>
            <Box
              sx={{
                height: 360,
                borderRadius: 1,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {value.url ? (
                <PDFViewer
                  key={value.key}
                  fileUrl={value.url}
                  initialPage={1}
                  initialZoom={1}
                />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Document preview unavailable. The PDF will still attach to
                    this question.
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default PdfUploadField;
