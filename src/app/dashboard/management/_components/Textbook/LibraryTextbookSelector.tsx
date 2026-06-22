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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { FileDto } from '@/app/_lib/interfaces/types';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import TextbookListRow from '@/app/_lib/components/textbook/TextbookListRow';
import { useLibraryFiles } from '@/app/dashboard/library/_components/hooks/useLibraryFiles';
import { extractTextbookName } from '@/app/_lib/utils/textbook';

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
          ) : filteredFiles.length === 0 ? (
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
              <MenuBookIcon color="disabled" sx={{ fontSize: 40 }} />
              <Typography variant="body2" color="text.secondary">
                {files.length === 0
                  ? 'No textbooks in your library yet — upload one using the Upload new tab, or from the Library page.'
                  : 'No textbooks match your search.'}
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {filteredFiles.map((file) => (
                <TextbookListRow
                  key={file.id}
                  file={file}
                  selected={selectedFileId === file.id}
                  disabled={disabled}
                  showSelectedChip
                  onClick={() => onSelect(file)}
                />
              ))}
            </List>
          )}
        </Box>
      </OutlinedWrapper>

      {!isFetching && files.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {filteredFiles.length} of {files.length} textbook
          {files.length === 1 ? '' : 's'} shown
        </Typography>
      ) : null}
    </Stack>
  );
}
