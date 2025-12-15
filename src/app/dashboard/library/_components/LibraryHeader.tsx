'use client';

import { Stack, Typography, Button } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';

interface LibraryHeaderProps {
    canManage: boolean;
    isFetching: boolean;
    onRefresh: () => void;
    onPublishClick: () => void;
}

export default function LibraryHeader({
    canManage,
    isFetching,
    onRefresh,
    onPublishClick,
}: LibraryHeaderProps) {
    return (
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
                    onClick={onRefresh}
                    disabled={isFetching}
                >
                    Refresh
                </Button>
                {canManage && (
                    <Button
                        variant="contained"
                        startIcon={<PublishIcon />}
                        onClick={onPublishClick}
                    >
                        Publish books
                    </Button>
                )}
            </Stack>
        </Stack>
    );
}
