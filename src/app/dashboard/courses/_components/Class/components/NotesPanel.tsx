import React from 'react';
import { OutlinedWrapper } from '@/app/_lib/components/shared-theme/customizations/OutlinedWrapper';
import Editor, {
    type EditorHandle,
} from '@/app/_lib/components/TipTapEditor/Editor';
import type { NoteDto } from '@/app/_lib/interfaces/types';
import type { PdfNoteLinkSummary } from '@/app/_lib/utils/pdfNoteLinks';

interface NotesPanelProps {
    note?: NoteDto;
    loading: boolean;
    onSave: (content: string) => void | Promise<void>;
    sx?: Record<string, unknown>;
    editorRef?:
    | React.RefObject<EditorHandle | null>
    | React.MutableRefObject<EditorHandle | null>;
    onContentChange?: (html: string) => void;
    onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
}

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
            <Editor
                ref={editorRef as React.RefObject<EditorHandle> | undefined}
                note={note}
                loading={loading}
                onSave={onSave}
                onContentChange={onContentChange}
                onPdfLinkClick={onPdfLinkClick}
            />
        </OutlinedWrapper>
    );
};
