'use client';

import {
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FileDto } from '@/app/_lib/interfaces/types';
import { useLazyCardThumbnail } from '@/app/dashboard/library/_components/hooks/useLazyCardThumbnail';
import {
  extractTextbookName,
  formatTextbookFileSize,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';

const previewAccent = '#3B82F6';

export interface TextbookPreviewPanelProps {
  file?: FileDto | null;
  title?: string;
  fileSizeBytes?: number;
  localPreviewUrl?: string | null;
  showReadyChip?: boolean;
  onReplace?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function TextbookPreviewPanel({
  file,
  title,
  fileSizeBytes,
  localPreviewUrl,
  showReadyChip = true,
  onReplace,
  onRemove,
  disabled = false,
  compact = false,
}: TextbookPreviewPanelProps) {
  const thumbnailFile =
    file?.id && file?.url && !localPreviewUrl && !file.previewImageUrl
      ? file
      : ({ id: '', fileKey: '', url: '', hash: '', isPublic: false, institutionId: '' } as FileDto);

  const { ref, thumbnail, isLoading } = useLazyCardThumbnail(thumbnailFile);
  const displayTitle = title ?? (file ? extractTextbookName(file) : 'Textbook');
  const size =
    fileSizeBytes ?? (file ? getFileSizeBytes(file) : undefined) ?? undefined;
  const previewSrc =
    localPreviewUrl ?? file?.previewImageUrl ?? thumbnail ?? null;

  return (
    <Stack spacing={compact ? 1 : 1.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <PictureAsPdfIcon sx={{ color: '#E53935' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} noWrap>
            {displayTitle}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
          <Chip
            size="small"
            variant="outlined"
            label={size != null ? formatTextbookFileSize(size) : 'Size unknown'}
          />
          {showReadyChip ? (
            <Chip
              color="success"
              icon={<CheckCircleOutlineIcon />}
              label="Ready"
              size="small"
            />
          ) : null}
        </Stack>
      </Stack>

      <Box
        ref={file?.id && !localPreviewUrl && !file.previewImageUrl ? ref : undefined}
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid',
          borderColor: alpha(previewAccent, 0.15),
          background:
            isLoading || !previewSrc
              ? `linear-gradient(135deg, ${alpha(previewAccent, 0.05)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`
              : 'transparent',
        }}
      >
        {isLoading && !previewSrc ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            animation="wave"
          />
        ) : null}
        {!previewSrc && !isLoading ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PictureAsPdfIcon
              sx={{ fontSize: 40, color: alpha(previewAccent, 0.4) }}
            />
          </Box>
        ) : null}
        {previewSrc ? (
          <Box
            component="img"
            src={previewSrc}
            alt={`${displayTitle} preview`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : null}
      </Box>

      {(onReplace || onRemove) && (
        <Stack direction="row" spacing={1}>
          {onReplace ? (
            <Button
              variant="outlined"
              size="small"
              onClick={onReplace}
              startIcon={<ReplayIcon />}
              disabled={disabled}
            >
              Replace PDF
            </Button>
          ) : null}
          {onRemove ? (
            <Button
              variant="text"
              size="small"
              color="error"
              onClick={onRemove}
              disabled={disabled}
            >
              Remove
            </Button>
          ) : null}
        </Stack>
      )}
    </Stack>
  );
}
