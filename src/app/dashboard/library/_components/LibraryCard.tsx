'use client';

import { memo, useCallback } from 'react';
import {
  Box,
  Button,
  Skeleton,
  Typography,
  Tooltip,
  Stack,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { LibraryFileDto } from '@/app/_lib/interfaces/types';
import {
  StyledCard,
  StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';
import { useLazyCardThumbnail } from './hooks/useLazyCardThumbnail';
import {
  extractTextbookName,
  formatLinkedCoursesDisplay,
  formatLinkedCoursesTooltip,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';
import { LibrarySizeChip, LibraryVisibilityChip } from './LibraryChips';

interface LibraryCardProps {
  file: LibraryFileDto;
  onRead: (file: LibraryFileDto) => void;
}

const libraryAccent = '#3B82F6';

function LibraryCard({ file, onRead }: LibraryCardProps) {
  const { ref, thumbnail, isLoading } = useLazyCardThumbnail(file);
  const fileSize = getFileSizeBytes(file);
  const linked = file.linkedClassrooms ?? [];

  const handleRead = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onRead(file);
    },
    [file, onRead]
  );

  return (
    <StyledCard
      variant="outlined"
      tabIndex={0}
      onClick={() => onRead(file)}
      sx={{
        borderWidth: 1.5,
        borderColor: alpha(libraryAccent, 0.15),
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          borderColor: alpha(libraryAccent, 0.4),
          backgroundColor: alpha(libraryAccent, 0.02),
          boxShadow: `0 4px 20px ${alpha(libraryAccent, 0.1)}`,
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          ref={ref}
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderBottom: '1px solid',
            borderColor: alpha(libraryAccent, 0.1),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden',
            position: 'relative',
            background:
              isLoading || !thumbnail
                ? `linear-gradient(135deg, ${alpha(libraryAccent, 0.05)} 0%, ${alpha('#8B5CF6', 0.05)} 100%)`
                : 'transparent',
          }}
        >
          {isLoading || !thumbnail ? (
            <>
              <Skeleton
                variant="rectangular"
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bgcolor: alpha(libraryAccent, 0.08),
                }}
                animation="wave"
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    background: alpha(libraryAccent, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PictureAsPdfIcon
                    sx={{ fontSize: 40, color: alpha(libraryAccent, 0.4) }}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <Box
              component="img"
              alt={`${extractTextbookName(file)} preview`}
              src={thumbnail}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}
        </Box>

        <StyledCardContent sx={{ padding: 2, flexGrow: 1 }}>
          <Tooltip title={extractTextbookName(file)} placement="top">
            <Typography
              variant="h6"
              sx={{ pr: 1, minWidth: 0, fontSize: '1rem', fontWeight: 600 }}
              noWrap
            >
              {extractTextbookName(file)}
            </Typography>
          </Tooltip>

          <Stack direction="row" spacing={0.75} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <LibrarySizeChip sizeBytes={fileSize} />
          </Stack>

          <Tooltip title={formatLinkedCoursesTooltip(file)} placement="top">
            <Typography
              variant="caption"
              noWrap
              sx={{
                mt: 1,
                display: 'block',
                color: linked.length ? 'text.secondary' : 'text.disabled',
                fontStyle: linked.length ? 'normal' : 'italic',
              }}
            >
              {formatLinkedCoursesDisplay(file)}
            </Typography>
          </Tooltip>
        </StyledCardContent>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1.5,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px 20px',
            borderTop: '1px solid',
            borderColor: alpha(libraryAccent, 0.08),
          }}
        >
          <Tooltip
            title={
              file.isPublic
                ? 'Visible to all trainees in your organization'
                : 'Only accessible by instructors and admins'
            }
          >
            <Box component="span">
              <LibraryVisibilityChip isPublic={file.isPublic} />
            </Box>
          </Tooltip>
          <Button size="small" variant="contained" onClick={handleRead}>
            Read
          </Button>
        </Box>
      </Box>
    </StyledCard>
  );
}

export default memo(LibraryCard);
