'use client';

import { Stack, Typography, Button, Box, Alert, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishIcon from '@mui/icons-material/Publish';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

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
        <Box sx={{ mb: 4 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{ mb: 2 }}
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
            
            {/* Explanatory section */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 700 }}>
                Your organization's centralized document library. PDFs uploaded here are available to trainees 
                enrolled in your institution's courses. Instructors and admins can publish training materials, 
                policies, and reference documents.
            </Typography>
            
            {/* Visibility legend */}
            <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ gap: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                        size="small"
                        icon={<PublicIcon />}
                        label="Public"
                        sx={{
                            bgcolor: alpha('#10B981', 0.1),
                            color: '#10B981',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Visible to all trainees in your organization
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                        size="small"
                        icon={<LockIcon />}
                        label="Private"
                        sx={{
                            bgcolor: alpha('#6B7280', 0.1),
                            color: '#6B7280',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Only accessible by instructors and admins
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}
