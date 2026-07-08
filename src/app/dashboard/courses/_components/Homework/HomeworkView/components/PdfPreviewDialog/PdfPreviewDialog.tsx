import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import type { PdfPreviewState } from '../../interfaces';
import { PdfViewerBox } from '../../elements';

export interface PdfPreviewDialogProps {
  preview: PdfPreviewState | null;
  onClose: () => void;
}

export default function PdfPreviewDialog({
  preview,
  onClose,
}: PdfPreviewDialogProps) {
  return (
    <Dialog
      open={Boolean(preview)}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            height: { xs: '95vh', md: '90vh' },
            maxHeight: { xs: '95vh', md: '90vh' },
          },
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {preview?.title || 'PDF Document'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {preview?.url && (
          <PdfViewerBox>
            <PDFViewer fileUrl={preview.url} initialPage={1} />
          </PdfViewerBox>
        )}
      </DialogContent>
    </Dialog>
  );
}
