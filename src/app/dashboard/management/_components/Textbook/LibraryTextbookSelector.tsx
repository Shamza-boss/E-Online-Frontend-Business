'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { FileDto } from '@/app/_lib/interfaces/types';
import { useLibraryFiles } from '@/app/dashboard/library/_components/hooks/useLibraryFiles';
import {
  extractTextbookName,
  formatTextbookFileSize,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';

interface LibraryTextbookSelectorProps {
  selectedFileId: string | null;
  onSelect: (file: FileDto) => void;
  disabled?: boolean;
}

export default function LibraryTextbookSelector({
  selectedFileId,
  onSelect,
  disabled = false,
}: LibraryTextbookSelectorProps) {
  const { files, isFetching } = useLibraryFiles();
  const [search, setSearch] = useState('');

  const filteredFiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return files;
    return files.filter((file) => {
      const name = extractTextbookName(file).toLowerCase();
      const key = file.fileKey.toLowerCase();
      return name.includes(query) || key.includes(query);
    });
  }, [files, search]);

  return (
    <Stack spacing={1.5} sx={{ minHeight: 200 }}>
      <TextField
        size="small"
        placeholder="Search textbooks…"
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

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          maxHeight: 280,
          overflow: 'auto',
          borderRadius: 2,
        }}
      >
        {isFetching ? (
          <Stack spacing={0} sx={{ p: 1 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={56} sx={{ borderRadius: 1, mb: 0.5 }} />
            ))}
          </Stack>
        ) : filteredFiles.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <MenuBookIcon color="disabled" sx={{ fontSize: 40 }} />
            <Typography variant="body2" color="text.secondary">
              {files.length === 0
                ? 'No textbooks in your library yet — upload one using the Upload new tab, or from the Library page.'
                : 'No textbooks match your search.'}
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {filteredFiles.map((file) => {
              const size = getFileSizeBytes(file);
              const isSelected = selectedFileId === file.id;
              return (
                <ListItemButton
                  key={file.id}
                  selected={isSelected}
                  disabled={disabled}
                  onClick={() => onSelect(file)}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <PictureAsPdfIcon
                    sx={{ mr: 1.5, color: '#E53935', flexShrink: 0 }}
                  />
                  <ListItemText
                    primary={extractTextbookName(file)}
                    secondary={
                      size != null ? formatTextbookFileSize(size) : 'PDF'
                    }
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Paper>

      {!isFetching && files.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {filteredFiles.length} of {files.length} textbook
          {files.length === 1 ? '' : 's'} shown
        </Typography>
      ) : null}
    </Stack>
  );
}
