import React from 'react';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import Editor from '@/app/_lib/components/TipTapEditor/Editor';
import type { NoteDto } from '@/app/_lib/interfaces/types';

interface NotesPanelProps {
    note?: NoteDto;
    loading: boolean;
    onSave: (content: string) => void | Promise<void>;
    sx?: Record<string, unknown>;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
    note,
    loading,
    onSave,
    sx,
}) => {
    return (
        <OutlinedWrapper
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
                ...sx,
            }}
        >
            <Editor note={note} loading={loading} onSave={onSave} />
        </OutlinedWrapper>
    );
};
