'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Stack,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileDto } from '@/app/_lib/interfaces/types';
import FileTable from './FileTable';
import UploadSection from './UploadSection';

interface ManageDialogProps {
    open: boolean;
    files: FileDto[];
    togglingId: string | null;
    selectedFile: File | null;
    uploadIsPublic: boolean;
    uploading: boolean;
    uploadThumbnail: string | null;
    onClose: () => void;
    onToggleVisibility: (file: FileDto) => void;
    onPreview: (file: FileDto) => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPublicToggle: (checked: boolean) => void;
    onUpload: () => void;
}

export default function ManageDialog({
    open,
    files,
    togglingId,
    selectedFile,
    uploadIsPublic,
    uploading,
    uploadThumbnail,
    onClose,
    onToggleVisibility,
    onPreview,
    onFileChange,
    onPublicToggle,
    onUpload,
}: ManageDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
                Publish books
                <IconButton aria-label="Close" onClick={onClose} sx={{ ml: 'auto' }}>
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
                        <FileTable
                            files={files}
                            togglingId={togglingId}
                            onToggleVisibility={onToggleVisibility}
                            onPreview={onPreview}
                        />
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
                        <UploadSection
                            selectedFile={selectedFile}
                            uploadIsPublic={uploadIsPublic}
                            uploading={uploading}
                            uploadThumbnail={uploadThumbnail}
                            onFileChange={onFileChange}
                            onPublicToggle={onPublicToggle}
                            onUpload={onUpload}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
