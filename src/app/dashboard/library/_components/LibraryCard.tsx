'use client';

import { memo, useCallback } from 'react';
import {
    Box,
    Button,
    CardActionArea,
    CardMedia,
    Chip,
    Skeleton,
    Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import { FileDto } from '@/app/_lib/interfaces/types';
import {
    StyledCard,
    StyledCardContent,
} from '@/app/_lib/components/website/components/styled/StyledComponents';

interface LibraryCardProps {
    file: FileDto;
    thumbnail?: string;
    isLoadingThumbnail: boolean;
    onPreview: (file: FileDto) => void;
}

const extractName = (fileKey: string) => {
    return fileKey.split('_').pop() ?? fileKey;
};

function LibraryCard({
    file,
    thumbnail,
    isLoadingThumbnail,
    onPreview,
}: LibraryCardProps) {
    const handlePreview = useCallback(() => {
        onPreview(file);
    }, [file, onPreview]);

    return (
        <StyledCard variant="outlined" tabIndex={0}>
            <CardActionArea sx={{ flexGrow: 1 }}>
                {isLoadingThumbnail || !thumbnail ? (
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            width: '100%',
                            height: '75.5%',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 1px 4px #0002',
                            objectFit: 'cover',
                        }}
                        animation="wave"
                    />
                ) : (
                    <CardMedia
                        component="img"
                        alt={`${extractName(file.fileKey)} image`}
                        src={thumbnail}
                        sx={{
                            aspectRatio: '16 / 9',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                )}
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
                        onClick={handlePreview}
                    >
                        View
                    </Button>
                </Box>
            </CardActionArea>
        </StyledCard>
    );
}

export default memo(LibraryCard);