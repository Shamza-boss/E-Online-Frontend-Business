import { Paper, Stack, Typography, Button, Box } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import type { Question } from '../../../../../../../_lib/interfaces/types';
import { formatFileSize } from '../../utils';

export interface PdfAttachmentProps {
  title: string;
  pdf?: Question['pdf'];
  compact?: boolean;
  onOpen: (title: string, pdf?: Question['pdf']) => void;
}

export default function PdfAttachment({
  title,
  pdf,
  compact = false,
  onOpen,
}: PdfAttachmentProps) {
  const mt = compact ? 1 : 2;

  if (!pdf?.url) {
    return (
      <Paper variant="outlined" sx={{ mt, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Document unavailable
        </Typography>
      </Paper>
    );
  }

  const sizeLabel = formatFileSize(pdf.sizeBytes);

  return (
    <Paper variant="outlined" sx={{ mt, p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PictureAsPdfIcon color="error" />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {pdf.title || title || 'PDF Document'}
            </Typography>
            {pdf.key && (
              <Typography variant="caption" color="text.secondary">
                {pdf.key}
              </Typography>
            )}
          </Box>
          <Box flexGrow={1} />
          <Button
            variant="contained"
            size="small"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => onOpen(title, pdf)}
          >
            Open PDF
          </Button>
        </Stack>
        {sizeLabel && (
          <Typography variant="caption" color="text.secondary">
            Size: {sizeLabel}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
