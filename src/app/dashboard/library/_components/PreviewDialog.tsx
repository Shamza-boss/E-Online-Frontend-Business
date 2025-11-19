'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileDto } from '@/app/_lib/interfaces/types';
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';

interface PreviewDialogProps {
    file: FileDto | null;
    onClose: () => void;
}

const extractName = (fileKey: string) => {
    return fileKey.split('_').pop() ?? fileKey;
};

export default function PreviewDialog({ file, onClose }: PreviewDialogProps) {
    return (
        <Dialog open={Boolean(file)} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
                {file ? file.fileName || extractName(file.fileKey) : 'Preview'}
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
                    height: { xs: '85vh', md: '75vh' },
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0,
                }}
            >
                <Box sx={{ flex: 1, minHeight: 0, p: 0 }}>
                    {file && <PDFViewer fileUrl={file.url} initialPage={1} />}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
