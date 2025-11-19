import React from 'react';
import { Stack, IconButton, Tooltip, Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface ClassToolbarProps {
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    notesOpen: boolean;
    onToggleNotes: () => void;
}

export const ClassToolbar: React.FC<ClassToolbarProps> = ({
    isFullscreen,
    onToggleFullscreen,
    notesOpen,
    onToggleNotes,
}) => {
    return (
        <Stack spacing={1} direction="row" alignItems="center">
            <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <IconButton onClick={onToggleFullscreen}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
            </Tooltip>

            <Button variant="outlined" onClick={onToggleNotes}>
                {notesOpen ? 'Hide' : 'Show'} notes
            </Button>
        </Stack>
    );
};
