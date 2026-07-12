'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  Link,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { type LibraryFileDto } from '@/app/_lib/interfaces/types';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import {
  extractTextbookName,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';
import { LibrarySizeChip, LibraryVisibilityChip, formatLibraryDate } from '../LibraryChips';
import { FlexOutlinedWrapper } from '@/app/dashboard/courses/_components/Modals/FullscreenClassroomModal/elements';
import { buildCourseUrl, getLinkedClassrooms } from './utils';
import type { PreviewDialogProps } from './types';

export default function PreviewDialog({
  file,
  onClose,
  onOpenFullReader,
}: PreviewDialogProps) {
  const fileSize = file ? getFileSizeBytes(file) : null;
  const linkedClassrooms = file ? getLinkedClassrooms(file) : [];

  const handleOpenFullReader = () => {
    if (!file || !onOpenFullReader) return;
    onOpenFullReader(file as LibraryFileDto);
  };

  return (
    <Dialog open={Boolean(file)} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
        {file ? extractTextbookName(file) : 'Preview'}
        <IconButton
          aria-label="Close preview"
          onClick={onClose}
          sx={{ ml: 'auto' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 0,
          height: { xs: '85vh', md: '80vh' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 0,
          overflow: 'hidden',
        }}
      >
        {file ? (
          <>
            <Box
              sx={{
                width: { xs: '100%', md: 280 },
                flexShrink: 0,
                p: 2,
                borderRight: { md: '1px solid' },
                borderBottom: { xs: '1px solid', md: 'none' },
                borderColor: 'divider',
                overflow: 'auto',
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Details
                </Typography>
                <LibrarySizeChip sizeBytes={fileSize} />
                {file.uploadedAt ? (
                  <Typography variant="body2">
                    Uploaded: {formatLibraryDate(file.uploadedAt)}
                  </Typography>
                ) : null}
                <LibraryVisibilityChip isPublic={file.isPublic} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ pt: 1 }}>
                  Linked courses
                </Typography>
                {linkedClassrooms.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Not linked to any course yet.
                  </Typography>
                ) : (
                  <Stack spacing={0.5}>
                    {linkedClassrooms.map((classroom) => (
                      <Link
                        key={classroom.id}
                        href={buildCourseUrl(classroom)}
                        underline="hover"
                        variant="body2"
                      >
                        {classroom.name}
                        {classroom.academicLevelName
                          ? ` · ${classroom.academicLevelName}`
                          : ''}
                      </Link>
                    ))}
                  </Stack>
                )}

                {onOpenFullReader ? (
                  <Button
                    variant="contained"
                    startIcon={<OpenInFullIcon />}
                    onClick={handleOpenFullReader}
                    sx={{ mt: 1 }}
                  >
                    Open full reader
                  </Button>
                ) : null}
              </Stack>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, p: 1, display: 'flex' }}>
              <FlexOutlinedWrapper sx={{ flex: 1, minHeight: 0 }}>
                <PDFViewer fileUrl={file.url} initialPage={1} />
              </FlexOutlinedWrapper>
            </Box>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
