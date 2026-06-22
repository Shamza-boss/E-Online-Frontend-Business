'use client';

import {
  Avatar,
  Box,
  Chip,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import { VideoLibraryItem } from '@/app/_lib/interfaces/types';
import {
  extractVideoTitle,
  formatVideoDuration,
} from '@/app/_lib/utils/media';
import { formatTextbookFileSize } from '@/app/_lib/utils/textbook';

interface VideoListRowProps {
  video: VideoLibraryItem;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  showSelectedChip?: boolean;
}

function statusChipColor(
  status: string
): 'default' | 'success' | 'warning' | 'error' {
  const lowered = status.toLowerCase();
  if (lowered === 'ready') return 'success';
  if (lowered === 'processing' || lowered === 'uploading') return 'warning';
  if (lowered === 'failed' || lowered === 'error') return 'error';
  return 'default';
}

export default function VideoListRow({
  video,
  selected = false,
  disabled = false,
  onClick,
  showSelectedChip = false,
}: VideoListRowProps) {
  const title = extractVideoTitle(video);
  const duration = formatVideoDuration(video.durationSeconds);
  const size =
    video.sizeBytes != null ? formatTextbookFileSize(Number(video.sizeBytes)) : null;

  return (
    <ListItemButton
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      sx={{
        py: 1,
        px: 1.5,
        gap: 1.5,
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Avatar
        variant="rounded"
        src={video.posterUrl ?? undefined}
        sx={{ width: 48, height: 36, flexShrink: 0, bgcolor: 'action.hover' }}
      >
        <VideocamIcon fontSize="small" color="action" />
      </Avatar>

      <Typography
        variant="body2"
        fontWeight={600}
        noWrap
        sx={{ flex: 1, minWidth: 0 }}
      >
        {title}
      </Typography>

      <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
        {duration ? (
          <Chip size="small" variant="outlined" label={duration} />
        ) : null}
        {size ? <Chip size="small" variant="outlined" label={size} /> : null}
        <Chip
          size="small"
          color={statusChipColor(video.status)}
          variant={statusChipColor(video.status) === 'default' ? 'outlined' : 'filled'}
          label={video.status}
        />
        {showSelectedChip && selected ? (
          <Chip size="small" color="primary" label="Selected" />
        ) : null}
      </Stack>
    </ListItemButton>
  );
}
