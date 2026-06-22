'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Link,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { TransitionProps } from '@mui/material/transitions';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';
import { LibraryFileDto } from '@/app/_lib/interfaces/types';
import {
  extractTextbookName,
  formatLinkedCoursesTooltip,
  getFileSizeBytes,
} from '@/app/_lib/utils/textbook';
import { LibrarySizeChip, LibraryVisibilityChip } from './LibraryChips';
import { formatLibraryDate } from './libraryChipStyles';
import {
  ContentArea,
  FlexOutlinedWrapper,
  ToolbarSpacer,
} from '@/app/dashboard/courses/_components/Modals/FullscreenClassroomModal/elements';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<unknown> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface LibraryReaderFullscreenModalProps {
  file: LibraryFileDto | null;
  open: boolean;
  onClose: () => void;
}

function buildCourseUrl(classroom: { id: string; name: string }) {
  return `/dashboard/courses/${encodeURIComponent(`${classroom.name}~${classroom.id}`)}`;
}

export default function LibraryReaderFullscreenModal({
  file,
  open,
  onClose,
}: LibraryReaderFullscreenModalProps) {
  const storageKey = useMemo(
    () => (file ? `library-pdf-state-${file.id}` : null),
    [file?.id]
  );

  const [initialPage, setInitialPage] = useState(1);

  useEffect(() => {
    if (!open || !storageKey) {
      setInitialPage(1);
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setInitialPage(1);
        return;
      }
      const parsed = JSON.parse(raw) as { page?: number };
      setInitialPage(
        typeof parsed.page === 'number' && parsed.page > 0 ? parsed.page : 1
      );
    } catch {
      setInitialPage(1);
    }
  }, [open, storageKey]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (!storageKey) return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ page }));
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const fileSize = file ? getFileSizeBytes(file) : null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      slots={{ transition: Transition }}
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            variant="outlined"
            startIcon={<FullscreenExitIcon />}
            onClick={onClose}
          >
            Exit
          </Button>
          <ToolbarSpacer />
          {file ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mr: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}
            >
              <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ maxWidth: 280 }}>
                {extractTextbookName(file)}
              </Typography>
              <LibrarySizeChip sizeBytes={fileSize} />
              <LibraryVisibilityChip isPublic={file.isPublic} />
              {(file.linkedClassrooms ?? []).length === 0 ? (
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  Not linked
                </Typography>
              ) : (
                (file.linkedClassrooms ?? []).slice(0, 2).map((classroom) => (
                  <Tooltip key={classroom.id} title={formatLinkedCoursesTooltip(file)}>
                    <Link
                      href={buildCourseUrl(classroom)}
                      variant="caption"
                      underline="hover"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {classroom.name}
                    </Link>
                  </Tooltip>
                ))
              )}
            </Stack>
          ) : null}
        </Toolbar>
      </AppBar>

      <ContentArea>
        {file ? (
          <FlexOutlinedWrapper>
            <PDFViewer
              fileUrl={file.url}
              initialPage={initialPage}
              onPageChange={handlePageChange}
            />
          </FlexOutlinedWrapper>
        ) : (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary">No textbook selected.</Typography>
          </Box>
        )}
      </ContentArea>
    </Dialog>
  );
}
