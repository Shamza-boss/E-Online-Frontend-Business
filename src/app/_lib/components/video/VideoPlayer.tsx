'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { VideoMeta } from '../../interfaces/types';
import { signPlayback } from '../../actions/stream';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useCreatorAccess } from '@/app/_lib/hooks/useCreatorAccess';

interface Props {
  video: VideoMeta;
  title?: string;
}

export const VideoPlayer: React.FC<Props> = ({ video, title }) => {
  const { creatorEnabled, loading: accessLoading } = useCreatorAccess();
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessLoading) return;

    if (!creatorEnabled) {
      setIframeSrc(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPlaybackUrl = async () => {
      //   if (video.status !== 'ready' || !video.uid) {
      //     // For non-ready videos, still attempt to show something useful
      //     if (video.status === 'processing') {
      //       setError('Video is being processed...');
      //     } else if (!video.uid) {
      //       setError('Video UID missing');
      //     } else {
      //       setError('Video is not ready for playback');
      //     }
      //     setLoading(false);
      //     return;
      //   }

      try {
        const data = await signPlayback(video.uid);
        setIframeSrc(data.iframeSrc);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
        setLoading(false);
      }
    };

    fetchPlaybackUrl();
  }, [accessLoading, creatorEnabled, video.uid, video.status]);

  if (accessLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading video permissions…</Typography>
      </Box>
    );
  }

  if (!creatorEnabled) {
    return (
      <Alert
        severity="info"
        icon={<InfoOutlinedIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        Video playback is disabled because this institution&apos;s subscription does not include the Creator add-on.
        Contact your administrator to enable video streaming.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading video...</Typography>
      </Box>
    );
  }

  if (video.status === 'processing') {
    return (
      <Box sx={{ mb: 2 }}>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}

        {/* Show poster if available while processing */}
        {video.posterUrl ? (
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: 1,
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src={video.posterUrl}
              alt="Video thumbnail"
              fill
              style={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={20} color="inherit" />
              <Typography variant="body2">Processing...</Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Video is being processed. Please check back later.
          </Alert>
        )}

        {video.durationSeconds && (
          <Typography variant="caption" color="text.secondary">
            Duration: {Math.floor(video.durationSeconds / 60)}:
            {String(video.durationSeconds % 60).padStart(2, '0')}
          </Typography>
        )}
      </Box>
    );
  }

  if (error && !video.posterUrl) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!iframeSrc && video.posterUrl) {
    // Show poster with error state
    return (
      <Box sx={{ mb: 2 }}>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: 1,
            backgroundColor: '#000',
          }}
        >
          <Image
            src={video.posterUrl}
            alt="Video thumbnail"
            fill
            style={{ objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              color: 'white',
              padding: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              {error || 'Video not available for playback'}
            </Typography>
          </Box>
        </Box>
        {video.durationSeconds && (
          <Typography variant="caption" color="text.secondary">
            Duration: {Math.floor(video.durationSeconds / 60)}:
            {String(video.durationSeconds % 60).padStart(2, '0')}
          </Typography>
        )}
      </Box>
    );
  }

  if (!iframeSrc) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Video playback URL not available.
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: 1,
          backgroundColor: '#000',
        }}
      >
        <iframe
          src={iframeSrc}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </Box>
      {video.durationSeconds && (
        <Typography variant="caption" color="text.secondary">
          Duration: {Math.floor(video.durationSeconds / 60)}:
          {String(video.durationSeconds % 60).padStart(2, '0')}
        </Typography>
      )}
    </Box>
  );
};
