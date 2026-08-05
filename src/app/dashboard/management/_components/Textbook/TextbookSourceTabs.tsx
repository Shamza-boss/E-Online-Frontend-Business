'use client';

import { type RefObject } from 'react';
import {
  Box,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { type FileDto } from '@/app/_lib/interfaces/types';
import LibraryTextbookSelector from './LibraryTextbookSelector';

export type TextbookSource = 'upload' | 'library';

type TextbookSourceTabsProps = {
  source: TextbookSource;
  onSourceChange: (source: TextbookSource) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadStage: 'idle' | 'preview' | 'uploading';
  selectedLibraryFileId: string | null;
  onLibrarySelect: (file: FileDto) => void;
  disabled?: boolean;
}

export default function TextbookSourceTabs({
  source,
  onSourceChange,
  fileInputRef,
  onUploadClick,
  onFileChange,
  uploadStage,
  selectedLibraryFileId,
  onLibrarySelect,
  disabled = false,
}: TextbookSourceTabsProps) {
  return (
    <Box>
      <Tabs
        value={source}
        onChange={(_, value: TextbookSource) => onSourceChange(value)}
        variant="fullWidth"
        sx={{ mb: 1.5, minHeight: 40 }}
      >
        <Tab
          value="upload"
          label="Upload new"
          icon={<CloudUploadIcon fontSize="small" />}
          iconPosition="start"
          disabled={disabled}
          sx={{ minHeight: 40, py: 0.5 }}
        />
        <Tab
          value="library"
          label="Choose from library"
          icon={<MenuBookIcon fontSize="small" />}
          iconPosition="start"
          disabled={disabled}
          sx={{ minHeight: 40, py: 0.5 }}
        />
      </Tabs>

      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        disabled={disabled}
      />

      {source === 'upload' ? (
        <Box>
          <Box
            onClick={disabled ? undefined : onUploadClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onUploadClick();
              }
            }}
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              p: 2,
              textAlign: 'center',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <CloudUploadIcon fontSize="large" color="primary" />
            <Typography variant="h6">Click to upload PDF</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a single PDF up to 100MB.
            </Typography>
          </Box>

          {uploadStage !== 'idle' ? (
            <Box sx={{ mt: 1.5 }}>
              <LinearProgress sx={{ borderRadius: 999 }} />
              <Typography variant="caption" color="text.secondary">
                {uploadStage === 'preview'
                  ? 'Rendering preview…'
                  : 'Uploading to secure storage…'}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : (
        <LibraryTextbookSelector
          selectedFileId={selectedLibraryFileId}
          onSelect={onLibrarySelect}
          disabled={disabled}
        />
      )}
    </Box>
  );
}
