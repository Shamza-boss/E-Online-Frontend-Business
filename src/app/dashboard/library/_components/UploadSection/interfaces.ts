export interface UploadSectionProps {
  selectedFile: File | null;
  uploadIsPublic: boolean;
  uploading: boolean;
  uploadThumbnail: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPublicToggle: (checked: boolean) => void;
  onUpload: () => void;
}
