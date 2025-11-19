import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

export interface BookmarkDialogPayload {
    title: string;
    color: string;
}

interface BookmarkDialogProps {
    open: boolean;
    mode: 'create' | 'edit';
    suggestedTitle: string;
    initialTitle?: string;
    initialColor?: string;
    onCancel: () => void;
    onConfirm: (payload: BookmarkDialogPayload) => void;
}

const MAX_TITLE_LENGTH = 100;

const PaperComponent = (props: PaperProps) => {
    const nodeRef = React.useRef<HTMLDivElement>(null);
    return (
        <Draggable
            nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
            handle="#bookmark-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} ref={nodeRef} />
        </Draggable>
    );
};

const BookmarkDialog: React.FC<BookmarkDialogProps> = ({
    open,
    mode,
    suggestedTitle,
    initialTitle,
    initialColor,
    onCancel,
    onConfirm,
}) => {
    const [title, setTitle] = useState(initialTitle ?? suggestedTitle);
    const [color, setColor] = useState(initialColor ?? '#2e7d32');
    const [colorPickerActive, setColorPickerActive] = useState(false);

    React.useEffect(() => {
        if (open) {
            setTitle(initialTitle ?? suggestedTitle);
            setColor(initialColor ?? '#2e7d32');
            setColorPickerActive(false);
        }
    }, [open, initialTitle, initialColor, suggestedTitle]);

    const isSubmitDisabled = title.trim().length === 0;

    const handleSubmit = () => {
        if (isSubmitDisabled) return;
        onConfirm({ title: title.trim(), color });
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="xs"
            PaperComponent={PaperComponent}
            aria-labelledby="bookmark-dialog-title"
            hideBackdrop={colorPickerActive}
        >
            <DialogTitle id="bookmark-dialog-title" sx={{ cursor: 'move' }}>
                {mode === 'create' ? 'Add Bookmark to notes' : 'Edit Bookmark'}
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1 } }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        autoFocus

                        label="Bookmark title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value.slice(0, MAX_TITLE_LENGTH))}
                        helperText={`${title.length}/${MAX_TITLE_LENGTH}`}
                        slotProps={{ htmlInput: { maxLength: MAX_TITLE_LENGTH } }}
                    />
                    <TextField
                        label="Color"
                        type="color"
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                        sx={{ width: 80 }}
                        slotProps={{
                            htmlInput: {
                                onFocus: () => setColorPickerActive(true),
                                onBlur: () => setColorPickerActive(false),
                                sx: {
                                    padding: 0.5,
                                    height: 30,
                                    cursor: 'pointer',
                                },
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isSubmitDisabled}>
                    {mode === 'create' ? 'Add Bookmark' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookmarkDialog;
