import type { EditorHandle } from '@/app/_lib/components/TipTapEditor/Editor';
import type { NoteDto } from '@/app/_lib/interfaces/types';
import type { PdfNoteLinkSummary } from '@/app/_lib/utils/pdfNoteLinks';
import type { SxProps, Theme } from '@mui/material/styles';

export interface NotesPanelProps {
  note?: NoteDto;
  loading: boolean;
  onSave: (content: string) => void | Promise<void>;
  sx?: SxProps<Theme>;
  editorRef?:
    | React.RefObject<EditorHandle | null>
    | React.MutableRefObject<EditorHandle | null>;
  onContentChange?: (html: string) => void;
  onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
}
