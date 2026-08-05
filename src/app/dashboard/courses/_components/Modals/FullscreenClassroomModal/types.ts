import type { PdfNoteLinkOptions } from '@/app/_lib/components/PDFViewer/types';
import type { EditorHandle } from '@/app/_lib/components/TipTapEditor/Editor';
import type { NoteDto } from '@/app/_lib/interfaces/types';
import type { PdfNoteLinkSummary } from '@/app/_lib/utils/pdfNoteLinks';

export type FullScreenClassroomModalProps = {
  open: boolean;
  canEdit: boolean;
  fileUrl: string;
  isLoading: boolean;
  note: NoteDto | undefined;
  handleSaveNote: (noteContent: string) => void | Promise<void>;
  handleClose: () => void;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  classId: string;
  pdfState: {
    currentPage: number;
    zoom: number;
    outline: boolean;
    onPageChange: (page: number) => void;
    onZoomChange: (zoom: number) => void;
    onOutlineChange: (show: boolean) => void;
  };
  noteLinkOptions?: PdfNoteLinkOptions;
  editorRef?:
    | React.RefObject<EditorHandle | null>
    | React.MutableRefObject<EditorHandle | null>;
  onEditorContentChange?: (html: string) => void;
  onPdfLinkClick?: (link: PdfNoteLinkSummary) => void;
  notesOpen: boolean;
  onToggleNotes: () => void;
  splitSizes: number[];
  onSplitResizeFinished: (gutterIdx: number, sizes: number[]) => void;
  examMode?: boolean;
  onExamModeChange?: (isExamMode: boolean) => void;
}
