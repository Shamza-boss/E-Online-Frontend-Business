import type { FileDto } from '@/app/_lib/interfaces/types';

export interface ManageDialogProps {
  open: boolean;
  files: FileDto[];
  togglingId: string | null;
  selectedFile: File | null;
  uploadIsPublic: boolean;
  uploading: boolean;
  uploadThumbnail: string | null;
  onClose: () => void;
  onToggleVisibility: (file: FileDto) => void;
  onPreview: (file: FileDto) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPublicToggle: (checked: boolean) => void;
  onUpload: () => void;
}
