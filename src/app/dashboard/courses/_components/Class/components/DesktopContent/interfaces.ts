export interface DesktopContentProps {
  notesOpen: boolean;
  notesPanel: React.ReactNode;
  renderTabs: () => React.ReactNode;
  splitSizes: number[];
  onSplitResizeFinished: (gutterIdx: number, sizes: number[]) => void;
}
