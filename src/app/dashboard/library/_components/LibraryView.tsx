'use client';
import NextImage from '@/app/_lib/components/shared-theme/NextImage';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishIcon from '@mui/icons-material/Publish';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

import { useAlert } from '@/app/_lib/components/alert/AlertProvider';
import { FileDto } from '@/app/_lib/interfaces/types';
import {
  getRepositoryFiles,
  toggleRepositoryFileVisibility,
  registerRepositoryFile,
  uploadTextbook,
} from '@/app/_lib/actions/storage';
import { UserRole } from '@/app/_lib/Enums/UserRole';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';

import { generatePdfThumbnail } from '@/app/_lib/utils/pdfThumbnail';
import {
  StyledCard,
  StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';

interface ManagedFile extends FileDto { }

const extractName = (fileKey: string) => {
  return fileKey.split('_').pop() ?? fileKey;
};

export default function LibraryView() {
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const { data, isLoading, isValidating, mutate } = useSWR<FileDto[]>(
    'repository-files',
    getRepositoryFiles,
    { revalidateOnMount: true }
  );

  const roleValue: UserRole | null = useMemo(() => {
    const rawRole = session?.user?.role;
    if (typeof rawRole === 'number') return rawRole as UserRole;
    if (typeof rawRole === 'string') {
      const parsed = Number.parseInt(rawRole, 10);
      return Number.isNaN(parsed) ? null : (parsed as UserRole);
    }
    return null;
  }, [session?.user?.role]);

  const canManage = useMemo(
    () =>
      roleValue === UserRole.Admin ||
      roleValue === UserRole.Instructor ||
      roleValue === UserRole.PlatformAdmin,
    [roleValue]
  );

  const files = data ?? [];
  const isFetching = isLoading || isValidating;

  const [manageOpen, setManageOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<ManagedFile | null>(null);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null
  );
  const [uploadIsPublic, setUploadIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  // Store generated thumbnail as data URL
  const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  const institutionId =
    typeof session?.user?.institutionId === 'string'
      ? session?.user?.institutionId
      : undefined;

  const handleToggleVisibility = async (file: ManagedFile) => {
    try {
      setTogglingId(file.id);
      await toggleRepositoryFileVisibility(file.id);
      await mutate();
      showAlert(
        'success',
        `${extractName(file.fileKey)} is now ${file.isPublic ? 'private' : 'public'}.`
      );
    } catch (error) {
      console.error('[ToggleFileVisibility]', error);
      showAlert('error', 'Unable to update file visibility. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleFileSelection: React.ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedUploadFile(file);
    setUploadThumbnail(null);
    if (file) {
      try {
        // Generate thumbnail from first page
        const thumb = await generatePdfThumbnail(file);
        setUploadThumbnail(thumb);
      } catch (err) {
        console.error('Failed to generate PDF thumbnail', err);
        setUploadThumbnail(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedUploadFile) {
      showAlert('warning', 'Select a PDF before uploading.');
      return;
    }

    setUploading(true);
    try {
      // Upload PDF file
      const uploadResult = await uploadTextbook(selectedUploadFile);
      // Prepare payload for backend (add thumbnail if supported)
      const payload: any = {
        fileKey: uploadResult.key,
        url: uploadResult.proxyDownload,
        hash: uploadResult.hash,
        isPublic: uploadIsPublic,
        institutionId,
      };
      if (uploadThumbnail) {
        payload.thumbnail = uploadThumbnail;
      }
      await registerRepositoryFile(payload);

      showAlert(
        'success',
        `${selectedUploadFile.name} uploaded to the repository.`
      );
      setSelectedUploadFile(null);
      setUploadIsPublic(true);
      setUploadThumbnail(null);
      await mutate();
    } catch (error) {
      console.error('[UploadRepositoryFile]', error);
      showAlert('error', 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function generateMissingThumbnails() {
      if (!files.length) return;
      const newThumbs: Record<string, string> = {};
      await Promise.all(
        files.map(async (file) => {
          if (!thumbnails[file.id]) {
            try {
              const response = await fetch(file.url);
              const blob = await response.blob();
              const pdfFile = new File(
                [blob],
                file.fileName || extractName(file.fileKey),
                { type: blob.type }
              );
              const thumb = await generatePdfThumbnail(pdfFile, 500, 560); // ClassCard size
              newThumbs[file.id] = thumb;
            } catch { }
          }
        })
      );
      if (Object.keys(newThumbs).length > 0)
        setThumbnails((prev) => ({ ...prev, ...newThumbs }));
    }
    generateMissingThumbnails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.map((f) => f.id).join(','), files.map((f) => f.url).join(',')]);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 }, width: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LibraryBooksIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            Library Repository
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => mutate()}
            disabled={isFetching}
          >
            Refresh
          </Button>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={() => setManageOpen(true)}
            >
              Publish books
            </Button>
          )}
        </Stack>
      </Stack>

      {isFetching && files.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No books yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload your first PDF to populate the library.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} columns={12}>
          {files.map((file) => (
            <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StyledCard variant="outlined" tabIndex={0}>
                <CardActionArea sx={{ flexGrow: 1 }}>
                  <CardMedia
                    component="img"
                    alt={`${extractName(file.fileKey)} image`}
                    src={thumbnails[file.id]}
                    sx={{
                      aspectRatio: '16 / 9',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <StyledCardContent sx={{ padding: 2 }}>
                    <Typography variant="h6" sx={{ pr: 1, minWidth: 0 }} noWrap>
                      {file.fileName || extractName(file.fileKey)}
                    </Typography>
                  </StyledCardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 2,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                    }}
                  >
                    <Chip
                      size="small"
                      label={file.isPublic ? 'Public' : 'Private'}
                      color={file.isPublic ? 'success' : 'default'}
                      icon={file.isPublic ? <PublicIcon /> : <LockIcon />}
                    />
                    {file.sizeBytes != null && (
                      <Typography variant="body2" color="text.secondary">
                        {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    )}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setPreviewFile(file)}
                    >
                      View
                    </Button>
                  </Box>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
          Publish books
          <IconButton
            aria-label="Close"
            onClick={() => setManageOpen(false)}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={0}
            sx={{ height: { xs: 'auto', md: 480 } }}
          >
            <Box sx={{ flex: 2, p: 3, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Repository files
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Hash</TableCell>
                      <TableCell align="center">Public</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No files uploaded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      files.map((file) => (
                        <TableRow key={file.id} hover>
                          <TableCell sx={{ maxWidth: 220 }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              {file.thumbnail ? (
                                <NextImage
                                  src={file.thumbnail}
                                  alt="PDF thumbnail"
                                  width={32}
                                  height={44}
                                  style={{
                                    borderRadius: 3,
                                    boxShadow: '0 1px 4px #0002',
                                    objectFit: 'cover',
                                  }}
                                  unoptimized
                                />
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  sx={{
                                    aspectRatio: '16 / 9',
                                    width: '100%',
                                    height: '100%',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                  }}
                                  animation="wave"
                                />
                              )}
                              <Typography variant="body2" noWrap>
                                {file.fileName || extractName(file.fileKey)}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 120 }}>
                            {file.sizeBytes != null ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            ) : null}
                          </TableCell>
                          <TableCell align="center">
                            <Switch
                              size="small"
                              color="primary"
                              checked={file.isPublic}
                              onChange={() => handleToggleVisibility(file)}
                              disabled={togglingId === file.id}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Preview">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => setPreviewFile(file)}
                                  disabled={togglingId === file.id}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', md: 'block' } }}
            />

            <Box
              sx={{
                flex: 1,
                p: 3,
                bgcolor: 'background.default',
                borderLeft: { md: '1px solid', xs: 'none' },
                borderColor: { md: 'divider' },
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Upload a book
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                >
                  {selectedUploadFile ? 'Replace PDF' : 'Select PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileSelection}
                  />
                </Button>
                {selectedUploadFile && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {selectedUploadFile.name}
                    </Typography>
                    {uploadThumbnail && (
                      <NextImage
                        src={uploadThumbnail}
                        alt="PDF thumbnail preview"
                        width={48}
                        height={67}
                        style={{
                          borderRadius: 4,
                          boxShadow: '0 1px 4px #0002',
                          objectFit: 'cover',
                        }}
                        unoptimized
                      />
                    )}
                  </Stack>
                )}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    checked={uploadIsPublic}
                    onChange={(_, checked) => setUploadIsPublic(checked)}
                    color="primary"
                  />
                  <Typography variant="body2">
                    Default to {uploadIsPublic ? 'public' : 'private'}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  disabled={!selectedUploadFile || uploading}
                  onClick={handleUpload}
                >
                  {uploading ? 'Uploading…' : 'Upload book'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setManageOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
          {previewFile
            ? previewFile.fileName || extractName(previewFile.fileKey)
            : 'Preview'}
          <IconButton
            aria-label="Close preview"
            onClick={() => setPreviewFile(null)}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 0,
            height: { xs: '85vh', md: '75vh' },
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
          }}
        >
          <Box sx={{ flex: 1, minHeight: 0, p: 0 }}>
            {previewFile && (
              <PDFViewer fileUrl={previewFile.url} initialPage={1} />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
