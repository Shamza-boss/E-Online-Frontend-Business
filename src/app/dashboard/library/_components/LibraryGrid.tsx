'use client';

import { Box, CircularProgress, Paper, Typography, Grid } from '@mui/material';
import { FileDto } from '@/app/_lib/interfaces/types';
import LibraryCard from './LibraryCard';

interface LibraryGridProps {
    files: FileDto[];
    isFetching: boolean;
    thumbnails: Record<string, string>;
    loadingThumbnails: Set<string>;
    onFilePreview: (file: FileDto) => void;
}

export default function LibraryGrid({
    files,
    isFetching,
    thumbnails,
    loadingThumbnails,
    onFilePreview,
}: LibraryGridProps) {
    if (isFetching && files.length === 0) {
        return (
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
        );
    }

    if (files.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    No books yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Upload your first PDF to populate the library.
                </Typography>
            </Paper>
        );
    }

    return (
        <Grid container spacing={2} columns={12}>
            {files.map((file) => (
                <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <LibraryCard
                        file={file}
                        thumbnail={thumbnails[file.id]}
                        isLoadingThumbnail={loadingThumbnails.has(file.id)}
                        onPreview={onFilePreview}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
