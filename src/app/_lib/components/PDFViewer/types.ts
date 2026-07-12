import type {
  PdfNoteLinkSummary,
  PdfNoteLinkRequest,
} from '@/app/_lib/utils/pdfNoteLinks';
import type { BookmarkDialogPayload } from './BookmarkDialog';

export type PdfNoteLinkOptions = {
  enabled: boolean;
  links: PdfNoteLinkSummary[];
  activeLinkId?: string | null;
  onSelectLink?: (link: PdfNoteLinkSummary) => void;
  onOpenNote?: (link: PdfNoteLinkSummary) => void;
  onCreateLink?: (payload: PdfNoteLinkRequest) => void;
  onUpdateLink?: (link: PdfNoteLinkSummary, payload: BookmarkDialogPayload) => void;
};

export type { PdfNoteLinkSummary, PdfNoteLinkRequest };
