'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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

interface ManagedFile extends FileDto {}

const extractName = (fileKey: string) => fileKey.split('/').pop() ?? fileKey;

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

  const handleFileSelection: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedUploadFile(file);
  };

  const handleUpload = async () => {
    if (!selectedUploadFile) {
      showAlert('warning', 'Select a PDF before uploading.');
      return;
    }

    setUploading(true);
    try {
      const uploadResult = await uploadTextbook(selectedUploadFile);
      await registerRepositoryFile({
        fileKey: uploadResult.key,
        url: uploadResult.proxyDownload,
        hash: uploadResult.hash,
        isPublic: uploadIsPublic,
        institutionId,
      });

      showAlert(
        'success',
        `${selectedUploadFile.name} uploaded to the repository.`
      );
      setSelectedUploadFile(null);
      setUploadIsPublic(true);
      await mutate();
    } catch (error) {
      console.error('[UploadRepositoryFile]', error);
      showAlert('error', 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" sx={{ pr: 1 }} noWrap>
                        {extractName(file.fileKey)}
                      </Typography>
                      <Chip
                        size="small"
                        label={file.isPublic ? 'Public' : 'Private'}
                        color={file.isPublic ? 'success' : 'default'}
                        icon={file.isPublic ? <PublicIcon /> : <LockIcon />}
                      />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {file.hash}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setPreviewFile(file)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        maxWidth="lg"
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
                            <Typography variant="body2" noWrap>
                              {extractName(file.fileKey)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ wordBreak: 'break-all' }}
                            >
                              {file.fileKey}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 240 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ wordBreak: 'break-all' }}
                            >
                              {file.hash}
                            </Typography>
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {selectedUploadFile.name}
                  </Typography>
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
          {previewFile ? extractName(previewFile.fileKey) : 'Preview'}
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
            flexDirection: 'column',
          }}
        >
          {previewFile && (
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <PDFViewer fileUrl={previewFile.url} initialPage={1} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
