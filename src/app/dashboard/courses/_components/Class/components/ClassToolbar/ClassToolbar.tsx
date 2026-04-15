import React from 'react';
import { Stack, Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { ClassToolbarProps } from './interfaces';

export const ClassToolbar: React.FC<ClassToolbarProps> = ({
    isFullscreen,
    onToggleFullscreen,
    notesOpen,
    onToggleNotes,
}) => {
    return (
        <Stack spacing={1} direction="row" alignItems="center">
            <Button
                variant="outlined"
                startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                onClick={onToggleFullscreen}
            >
                Toggle Fullscreen
            </Button>

            <Button variant="contained" onClick={onToggleNotes}>
                {notesOpen ? 'Hide' : 'Show'} notes
            </Button>
        </Stack>
    );
};
