import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
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
}

const PDFOutline: React.FC<PDFOutlineProps> = ({ outline, onNavigate }) => {
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

  const renderTree = (nodes: OutlineNode[]) => {
    return nodes.map((node, index) => {
      return (
        <TreeItem
          key={`${node.title}-${index}-${node.dest}`}
          itemId={`${node.title}-${index}-${node.dest}`}
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
                p: 0.5,
                cursor: 'pointer',
              }}
            >
              <Typography variant="body2">
                {node.title} {node.pageNumber ? `(${node.pageNumber})` : ''}
              </Typography>
            </Box>
          }
        >
          {node.items && node.items.length > 0 && renderTree(node.items)}
        </TreeItem>
      );
    });
  };

  if (!outline || outline.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body2">No outline available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', p: 1 }}>
      <SimpleTreeView
        aria-label="document outline"
        slots={{
          expandIcon: ChevronRightIcon,
          collapseIcon: ExpandMoreIcon,
        }}
        sx={{
          height: '100%',
          flexGrow: 1,
          maxWidth: 300,
          overflowY: 'auto',
        }}
      >
        {renderTree(outline)}
      </SimpleTreeView>
    </Box>
  );
};

export default PDFOutline;
