'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  VideoMeta,
  VideoUploadResponse,
  VideoMetaResponse,
  CreateUploadDto,
} from '../../interfaces/types';
import { createDirectUpload, getVideoMeta } from '../../actions/stream';
import StudentClassCardSkeleton from '@/app/dashboard/_components/_skeletonLoaders/StudentClassCardSkeleton';
import VideoCardThumbnail from '@/app/_lib/components/video/VideoCardThumbnail';
import { useCreatorAccess } from '@/app/_lib/hooks/useCreatorAccess';

interface Props {
  value?: VideoMeta;
  onChange: (video: VideoMeta | undefined) => void;
  disabled?: boolean;
}

export const VideoUploadField: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const { creatorEnabled, loading: accessLoading } = useCreatorAccess();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      // 500MB limit
      setError('File size must be less than 500MB');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get upload URL
      const createUploadDto: CreateUploadDto = {
        filename: file.name,
        size: file.size,
      };

      const uploadData: VideoUploadResponse =
        await createDirectUpload(createUploadDto);

      // Step 2: Upload the file
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          // Step 3: Set initial video metadata
          const videoMeta: VideoMeta = {
            provider: 'cloudflare',
            uid: uploadData.uid,
            status: 'processing',
            sizeBytes: file.size,
          };

          onChange(videoMeta);
          setProcessingStatus('processing');
          setUploading(false);

          // Step 4: Poll for video processing completion
          pollVideoStatus(uploadData.uid);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.open('POST', uploadData.uploadURL);
      xhr.send(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const pollVideoStatus = async (uid: string) => {
    const maxAttempts = 30; // Poll for up to 5 minutes (30 * 10 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const metaData: VideoMetaResponse = await getVideoMeta(uid);

        if (metaData.status === 'ready') {
          // Video is ready
          const updatedVideo: VideoMeta = {
            provider: 'cloudflare',
            uid,
            status: metaData.status,
            posterUrl: metaData.posterUrl,
            durationSeconds: metaData.durationSeconds,
            playbackId: metaData.playbackId,
            sizeBytes: value?.sizeBytes,
          };
          onChange(updatedVideo);
          setProcessingStatus('ready');
          return;
        }

        attempts++;
        if (attempts < maxAttempts && metaData.status === 'processing') {
          setProcessingStatus('processing');
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else if (metaData.status === 'error') {
          setError('Video processing failed');
          setProcessingStatus('error');
        }
      } catch (err) {
        console.error('Error polling video status:', err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        }
      }
    };

    poll();
  };

  const handleRemoveVideo = () => {
    onChange(undefined);
    setProcessingStatus('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const isProcessing =
    uploading ||
    processingStatus === 'processing' ||
    value?.status === 'processing';

  const formattedDuration = value?.durationSeconds
    ? `${Math.floor((value.durationSeconds || 0) / 60)}:${String(
      Math.floor((value.durationSeconds || 0) % 60)
    ).padStart(2, '0')}`
    : null;

  const sizeLabel = value?.sizeBytes
    ? `${(value.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : null;

  const isError = processingStatus === 'error' || value?.status === 'error';

  const statusLabelRaw = (processingStatus || value?.status || 'ready').replace(
    /\s+/g,
    ' '
  );
  const statusLabel =
    statusLabelRaw
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Ready';

  const videoIdLabel = value?.playbackId || value?.uid || '—';
  const instructionsMessage =
    'Your video has been successfully uploaded. To play it, please click the preview on the right-hand side of your screen that shows a play icon.';

  const statusColor = (() => {
    const lowered = statusLabel.toLowerCase();
    if (lowered === 'ready') return 'success' as const;
    if (lowered === 'processing') return 'warning' as const;
    if (lowered === 'error') return 'error' as const;
    return 'default' as const;
  })();

  const statusChip = (
    <Chip
      label={statusLabel}
      color={statusColor}
      size="small"
      variant={statusColor === 'default' ? 'outlined' : 'filled'}
      sx={{ fontWeight: 600 }}
    />
  );

  if (accessLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Checking video permissions…
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (!creatorEnabled) {
    return (
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon fontSize="small" />}
        sx={{ mt: 1 }}
      >
        Video uploads are unavailable because your institution's subscription does not include the Creator add-on.
        Contact an administrator to enable video creation and playback.
      </Alert>
    );
  }

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />

      {!value && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleSelectFile}
          disabled={disabled || uploading}
          sx={{ py: 2, mb: 1 }}
        >
          Upload Video
        </Button>
      )}

      {isProcessing && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {uploading ? 'Uploading video…' : 'Processing video…'}
          </Typography>
          {uploading && (
            <>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {Math.round(uploadProgress)}%
              </Typography>
            </>
          )}
          <Box sx={{ mt: 2 }}>
            <StudentClassCardSkeleton count={1} />
          </Box>
        </Box>
      )}

      {value && !isProcessing && !isError && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack spacing={2}>
            <VideoCardThumbnail
              mediaUrl={value.posterUrl}
              mediaAlt="Uploaded video thumbnail"
              metadataLabel={
                formattedDuration
                  ? `Duration ${formattedDuration}`
                  : 'Duration unavailable'
              }
              titleContent={statusChip}
              subtitle={instructionsMessage}
              avatarLabel="Embedded assessment video"
              footerAction={
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveVideo}
                  disabled={disabled}
                  size="small"
                >
                  Delete
                </Button>
              }
            />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                Video ID: {videoIdLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {statusLabel}
              </Typography>
              {sizeLabel && (
                <Typography variant="body2" color="text.secondary">
                  Size: {sizeLabel}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Paper>
      )}

      {processingStatus === 'processing' && !uploading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Video is being processed. This may take a few minutes.
        </Alert>
      )}

      {isError && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            Video processing failed. Please try uploading again.
          </Alert>
          {value && (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveVideo}
              disabled={disabled}
            >
              Remove video
            </Button>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
