import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Image from 'next/image';
import {
  VideoMeta,
  VideoUploadResponse,
  VideoMetaResponse,
  CreateUploadDto,
} from '../../interfaces/types';
import { createDirectUpload, getVideoMeta } from '../../actions/stream';

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
          fullWidth
          sx={{ py: 2 }}
        >
          Upload Video
        </Button>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploading video...
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {value && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Video: {value.uid}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {processingStatus || value.status}
                {value.durationSeconds &&
                  ` • Duration: ${Math.round(value.durationSeconds)}s`}
                {value.sizeBytes &&
                  ` • Size: ${(value.sizeBytes / (1024 * 1024)).toFixed(1)}MB`}
              </Typography>
              {value.posterUrl && (
                <Box
                  sx={{ mt: 1, position: 'relative', width: 200, height: 100 }}
                >
                  <Image
                    src={value.posterUrl}
                    alt="Video thumbnail"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
            {value.status === 'ready' && value.playbackId && (
              <IconButton
                color="primary"
                onClick={() => {
                  // You can implement video preview here if needed
                  console.log('Play video:', value.playbackId);
                }}
              >
                <PlayArrowIcon />
              </IconButton>
            )}
            <IconButton
              color="error"
              onClick={handleRemoveVideo}
              disabled={disabled}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Paper>
      )}

      {processingStatus === 'processing' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Video is being processed. This may take a few minutes.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};
