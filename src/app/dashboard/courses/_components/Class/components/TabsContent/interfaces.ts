import type { PdfNoteLinkOptions } from '@/app/_lib/components/PDFViewer/PDFViewer';
import type { PdfViewState } from '../../hooks/useClassroomLayout';

export interface TabsContentProps {
  variant: 'mobile' | 'desktop';
  tabValue: string;
  onTabChange: (value: string) => void;
  classId: string;
  canEdit: boolean;
  fileUrl: string;
  pdfState: PdfViewState;
  noteLinkOptions?: PdfNoteLinkOptions;
  examMode?: boolean;
  onExamModeChange?: (isExamMode: boolean) => void;
}
