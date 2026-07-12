import React from 'react';
import Editor, {
    type EditorHandle,
} from '@/app/_lib/components/TipTapEditor/Editor';
import type { NotesPanelProps } from './types';
import { FlexOutlinedWrapper } from './elements';

export const NotesPanel: React.FC<NotesPanelProps> = ({
    note,
    loading,
    onSave,
    sx,
    editorRef,
    onContentChange,
    onPdfLinkClick,
}) => {
    return (
        <FlexOutlinedWrapper sx={sx}>
            <Editor
                ref={editorRef as React.RefObject<EditorHandle> | undefined}
                note={note}
                loading={loading}
                onSave={onSave}
                onContentChange={onContentChange}
                onPdfLinkClick={onPdfLinkClick}
            />
        </FlexOutlinedWrapper>
    );
};
