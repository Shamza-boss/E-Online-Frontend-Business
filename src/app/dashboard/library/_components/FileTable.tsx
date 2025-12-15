'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    IconButton,
    Tooltip,
    Stack,
    Typography,
    Skeleton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NextImage from '@/app/_lib/components/shared-theme/NextImage';
import { FileDto } from '@/app/_lib/interfaces/types';

interface FileTableProps {
    files: FileDto[];
    togglingId: string | null;
    onToggleVisibility: (file: FileDto) => void;
    onPreview: (file: FileDto) => void;
}

const extractName = (fileKey: string) => {
    return fileKey.split('_').pop() ?? fileKey;
};

export default function FileTable({
    files,
    togglingId,
    onToggleVisibility,
    onPreview,
}: FileTableProps) {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
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
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body2" noWrap>
                                            {file.fileName || extractName(file.fileKey)}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align="center">
                                    <Switch
                                        size="small"
                                        color="primary"
                                        checked={file.isPublic}
                                        onChange={() => onToggleVisibility(file)}
                                        disabled={togglingId === file.id}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Preview">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() => onPreview(file)}
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
    );
}
