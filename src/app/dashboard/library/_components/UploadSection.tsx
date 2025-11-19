'use client';

import { Stack, Typography, Button, Switch } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NextImage from '@/app/_lib/components/shared-theme/NextImage';

interface UploadSectionProps {
    selectedFile: File | null;
    uploadIsPublic: boolean;
    uploading: boolean;
    uploadThumbnail: string | null;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPublicToggle: (checked: boolean) => void;
    onUpload: () => void;
}

export default function UploadSection({
    selectedFile,
    uploadIsPublic,
    uploading,
    uploadThumbnail,
    onFileChange,
    onPublicToggle,
    onUpload,
}: UploadSectionProps) {
    return (
        <Stack spacing={2}>
            <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                disabled={uploading}
            >
                {selectedFile ? 'Replace PDF' : 'Select PDF'}
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={onFileChange}
                />
            </Button>
            {selectedFile && (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: 'break-all' }}
                    >
                        {selectedFile.name}
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
                    onChange={(_, checked) => onPublicToggle(checked)}
                    color="primary"
                />
                <Typography variant="body2">
                    Default to {uploadIsPublic ? 'public' : 'private'}
                </Typography>
            </Stack>
            <Button
                variant="contained"
                disabled={!selectedFile || uploading}
                onClick={onUpload}
            >
                {uploading ? 'Uploading…' : 'Upload book'}
            </Button>
        </Stack>
    );
}
