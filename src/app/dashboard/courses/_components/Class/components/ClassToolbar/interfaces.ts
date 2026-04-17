export interface ClassToolbarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  notesOpen: boolean;
  onToggleNotes: () => void;
  examMode?: boolean;
}
