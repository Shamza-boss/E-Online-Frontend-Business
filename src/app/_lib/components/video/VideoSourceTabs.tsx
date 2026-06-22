'use client';

import { RefObject } from 'react';
import {
  Box,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { VideoLibraryItem } from '@/app/_lib/interfaces/types';
import LibraryVideoSelector from './LibraryVideoSelector';

export type VideoSource = 'upload' | 'library';

interface VideoSourceTabsProps {
  source: VideoSource;
  onSourceChange: (source: VideoSource) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  selectedVideoId: string | null;
  onLibrarySelect: (video: VideoLibraryItem) => void;
  disabled?: boolean;
}

export default function VideoSourceTabs({
  source,
  onSourceChange,
  fileInputRef,
  onUploadClick,
  onFileChange,
  uploading,
  selectedVideoId,
  onLibrarySelect,
  disabled = false,
}: VideoSourceTabsProps) {
  return (
    <Box>
      <Tabs
        value={source}
        onChange={(_, value: VideoSource) => onSourceChange(value)}
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
          label="Choose existing"
          icon={<VideoLibraryIcon fontSize="small" />}
          iconPosition="start"
          disabled={disabled}
          sx={{ minHeight: 40, py: 0.5 }}
        />
      </Tabs>

      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept="video/*"
        onChange={onFileChange}
        disabled={disabled || uploading}
      />

      {source === 'upload' ? (
        <Box>
          <Box
            onClick={disabled || uploading ? undefined : onUploadClick}
            role="button"
            tabIndex={disabled || uploading ? -1 : 0}
            onKeyDown={(e) => {
              if (!disabled && !uploading && (e.key === 'Enter' || e.key === ' ')) {
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
              cursor: disabled || uploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled || uploading ? 0.6 : 1,
            }}
          >
            <CloudUploadIcon fontSize="large" color="primary" />
            <Typography variant="h6">Click to upload video</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a single video up to 500MB.
            </Typography>
          </Box>

          {uploading ? (
            <Box sx={{ mt: 1.5 }}>
              <LinearProgress sx={{ borderRadius: 999 }} />
              <Typography variant="caption" color="text.secondary">
                Uploading video…
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : (
        <LibraryVideoSelector
          selectedVideoId={selectedVideoId}
          onSelect={onLibrarySelect}
          disabled={disabled}
        />
      )}
    </Box>
  );
}
