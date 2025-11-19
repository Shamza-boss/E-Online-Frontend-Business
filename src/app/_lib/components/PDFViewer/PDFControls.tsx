import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClearIcon from '@mui/icons-material/Clear';
import BrushIcon from '@mui/icons-material/Brush';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { MenuButton, MenuControlsContainer, MenuDivider } from 'mui-tiptap';

interface PDFControlsProps {
  numPages: number;
  pageNumber: number;
  isHighlighting: boolean;
  hasHighlights: boolean;
  onToggleOutline: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleHighlight: () => void;
  onClearHighlights: () => void;
  canCreateNoteLinks?: boolean;
  onCreateNoteLink?: () => void;
}

const PDFControls: React.FC<PDFControlsProps> = ({
  numPages,
  pageNumber,
  isHighlighting,
  hasHighlights,
  onToggleOutline,
  onZoomOut,
  onZoomIn,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onToggleHighlight,
  onClearHighlights,
  canCreateNoteLinks,
  onCreateNoteLink,
}) => {
  return (
    <MenuControlsContainer>
      <MenuButton
        value="outline"
        tooltipLabel="Toggle Outline"
        onClick={onToggleOutline}
        IconComponent={MenuBookIcon}
      />

      <MenuDivider />

      <MenuButton
        value="zoomOut"
        tooltipLabel="Zoom Out"
        onClick={onZoomOut}
        IconComponent={ZoomOutIcon}
      />

      <MenuButton
        value="zoomIn"
        tooltipLabel="Zoom In"
        onClick={onZoomIn}
        IconComponent={ZoomInIcon}
      />

      <MenuDivider />

      <MenuButton
        value="highlight"
        tooltipLabel={
          isHighlighting ? 'Disable highlighting' : 'Enable highlighting'
        }
        onClick={onToggleHighlight}
        selected={isHighlighting}
        IconComponent={BrushIcon}
      />

      <MenuButton
        value="clearHighlights"
        tooltipLabel="Clear all highlights"
        onClick={onClearHighlights}
        disabled={!hasHighlights}
        IconComponent={ClearIcon}
      />

      {canCreateNoteLinks && (
        <>
          <MenuDivider />
          <MenuButton
            value="createNoteLink"
            tooltipLabel="Add a Bookmark to your active notes"
            onClick={onCreateNoteLink}
            IconComponent={BookmarkAddIcon}
          />
        </>
      )}

      <MenuDivider />

      <MenuButton
        value="previousPage"
        tooltipLabel="Previous Page"
        onClick={onPreviousPage}
        disabled={pageNumber <= 1}
        IconComponent={NavigateBeforeIcon}
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'nowrap', minWidth: '60px' }}
        >
          {numPages > 0 ? `${pageNumber} of ${numPages}` : 'Loading...'}
        </Typography>
      </Box>

      <MenuButton
        value="nextPage"
        tooltipLabel="Next Page"
        onClick={onNextPage}
        disabled={pageNumber >= numPages}
        IconComponent={NavigateNextIcon}
      />
      <TextField
        sx={{ width: '100px' }}
        placeholder="Go to"
        type="number"
        size="small"
        onChange={onPageChange}
        slotProps={{ input: { minRows: 1, maxRows: numPages } }}
      />
    </MenuControlsContainer>
  );
};

export default React.memo(PDFControls);
