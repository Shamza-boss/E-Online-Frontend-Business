'use client';

import { Node } from '@tiptap/core';
import ExcaliDrawPreview from '../components/Excalidraw/ExcalidrawPreview';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const ExcalidrawNode = Node.create({
  name: 'excaliBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      data: { default: '[]' },
    };
  },

  parseHTML() {
    return [{ tag: 'excali-block' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['excali-block', HTMLAttributes];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcaliDrawPreview);
  },
});
