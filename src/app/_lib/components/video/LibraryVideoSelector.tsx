'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  InputAdornment,
  List,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VideocamIcon from '@mui/icons-material/Videocam';
import { type VideoLibraryItem } from '@/app/_lib/interfaces/types';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import { useInstitutionVideos } from '@/app/_lib/hooks/useInstitutionVideos';
import { extractVideoTitle } from '@/app/_lib/utils/media';
import VideoListRow from './VideoListRow';

type LibraryVideoSelectorProps = {
  selectedVideoId: string | null;
  onSelect: (video: VideoLibraryItem) => void;
  disabled?: boolean;
}

export default function LibraryVideoSelector({
  selectedVideoId,
  onSelect,
  disabled = false,
}: LibraryVideoSelectorProps) {
  const [search, setSearch] = useState('');
  const { videos, totalCount, isFetching } = useInstitutionVideos({ pageSize: 50 });

  const filteredVideos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return videos;
    return videos.filter((video) => {
      const title = extractVideoTitle(video).toLowerCase();
      return title.includes(query) || video.uid.toLowerCase().includes(query);
    });
  }, [videos, search]);

  return (
    <Stack spacing={1.5} sx={{ minHeight: 200 }}>
      <TextField
        size="small"
        placeholder="Search videos…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={disabled || isFetching}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      <OutlinedWrapper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0,
          maxHeight: 280,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isFetching ? (
            <Stack spacing={0} sx={{ p: 1 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={56} sx={{ borderRadius: 1, mb: 0.5 }} />
              ))}
            </Stack>
          ) : filteredVideos.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <VideocamIcon color="disabled" sx={{ fontSize: 40 }} />
              <Typography variant="body2" color="text.secondary">
                {videos.length === 0
                  ? 'No videos in your institution yet — upload one in a module and save it, or use Upload new.'
                  : 'No videos match your search.'}
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {filteredVideos.map((video) => (
                <VideoListRow
                  key={video.id}
                  video={video}
                  selected={selectedVideoId === video.id}
                  disabled={disabled}
                  showSelectedChip
                  onClick={() => onSelect(video)}
                />
              ))}
            </List>
          )}
        </Box>
      </OutlinedWrapper>

      {!isFetching && videos.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {filteredVideos.length} of {videos.length} video
          {videos.length === 1 ? '' : 's'} shown
        </Typography>
      ) : null}
    </Stack>
  );
}
