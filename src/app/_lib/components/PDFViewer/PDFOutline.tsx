import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface OutlineNode {
  title: string;
  dest: string | any[];
  items?: OutlineNode[];
  pageNumber?: number;
}

interface PDFOutlineProps {
  outline: OutlineNode[];
  onNavigate: (item: OutlineNode) => void;
  currentPage?: number;
}

const PDFOutline: React.FC<PDFOutlineProps> = ({ outline, onNavigate, currentPage }) => {
  if (!outline) {
    return (
      <Box p={2}>
        <Typography variant="body2">Loading outline...</Typography>
      </Box>
    );
  }

  if (outline.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body2">No outline available</Typography>
      </Box>
    );
  }

  // Filter out items that target the same page as their siblings
  const filterDuplicatePages = (nodes: OutlineNode[]): OutlineNode[] => {
    const pageMap = new Map<number, number>();

    return nodes.filter((node, index) => {
      if (node.pageNumber !== undefined) {
        const firstIndex = pageMap.get(node.pageNumber);
        if (firstIndex === undefined) {
          pageMap.set(node.pageNumber, index);
          return true;
        }
        // Keep only the first item for each page number
        return false;
      }
      return true;
    }).map(node => ({
      ...node,
      items: node.items ? filterDuplicatePages(node.items) : undefined
    }));
  };

  const filteredOutline = filterDuplicatePages(outline);

  const renderTree = (nodes: OutlineNode[]) => {
    return nodes.map((node, index) => {
      const isCurrentPage = node.pageNumber === currentPage;
      const hasChildren = node.items && node.items.length > 0;
      const hasPageNumber = node.pageNumber !== undefined;

      return (
        <TreeItem
          key={`${node.title}-${index}-${node.pageNumber || 'no-page'}`}
          itemId={`${node.title}-${index}-${node.pageNumber || 'no-page'}`}
          label={
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNavigate(node);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.75,
                px: 1,
                cursor: 'pointer',
                borderRadius: 1,
                backgroundColor: isCurrentPage ? 'primary.main' : 'transparent',
                color: isCurrentPage ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  backgroundColor: isCurrentPage ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {hasChildren && (
                <FolderIcon
                  sx={{
                    fontSize: 18,
                    opacity: 0.5,
                  }}
                />
              )}

              <Tooltip title={node.title} enterDelay={500} placement="top">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrentPage ? 600 : 400,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.title}
                </Typography>
              </Tooltip>

              {hasPageNumber && (
                <Chip
                  label={node.pageNumber}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: isCurrentPage ? 600 : 500,
                    backgroundColor: isCurrentPage
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'action.hover',
                    color: isCurrentPage ? 'inherit' : 'text.secondary',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
          }
        >
          {hasChildren && renderTree(node.items!)}
        </TreeItem>
      );
    });
  };

  return (
    <Box sx={{ height: '100%', width: '100%', overflowY: 'auto' }}>
      <SimpleTreeView
        aria-label="document outline"
        slots={{
          expandIcon: ChevronRightIcon,
          collapseIcon: ExpandMoreIcon,
        }}
      >
        {renderTree(filteredOutline)}
      </SimpleTreeView>
    </Box>
  );
};

export default PDFOutline;
