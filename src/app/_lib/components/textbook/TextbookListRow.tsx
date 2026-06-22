'use client';

import {
  Box,
  Chip,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FileDto } from '@/app/_lib/interfaces/types';
import {
  extractTextbookName,
  formatTextbookFileSize,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';

interface TextbookListRowProps {
  file: FileDto;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  showSelectedChip?: boolean;
}

export default function TextbookListRow({
  file,
  selected = false,
  disabled = false,
  onClick,
  showSelectedChip = false,
}: TextbookListRowProps) {
  const size = getFileSizeBytes(file);
  const name = extractTextbookName(file);

  return (
    <ListItemButton
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none' },
        py: 1.25,
      }}
    >
      <PictureAsPdfIcon
        sx={{ mr: 1.5, color: '#E53935', flexShrink: 0, fontSize: 22 }}
      />
      <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1, minWidth: 0 }}>
        {name}
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ ml: 1, flexShrink: 0 }}>
        {showSelectedChip && selected ? (
          <Chip size="small" label="Selected" color="primary" variant="outlined" />
        ) : null}
        <Chip
          size="small"
          label={size != null ? formatTextbookFileSize(size) : 'Size unknown'}
          variant="outlined"
        />
      </Stack>
    </ListItemButton>
  );
}
