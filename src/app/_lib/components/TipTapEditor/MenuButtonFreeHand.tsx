// MenuButtonFreeHand.tsx
'use client';

import React, { useState } from 'react';
// ← import this instead of useCurrentEditor
import { MenuButton, useRichTextEditorContext } from 'mui-tiptap';
import DrawIcon from '@mui/icons-material/Gesture';
import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import ExcalidrawModal from '../Excalidraw/ExcaliDrawModal.client';

export default function DrawingButton() {
  const editor = useRichTextEditorContext();
  const [modalOpen, setModalOpen] = useState(false);
  const isEditable = editor?.options.editable ?? false;

  const handleSave = (elements: ExcalidrawElement[]) => {
    if (!editor) {
      console.warn('⚠️ no editor instance');
      return;
    }

    const json = JSON.stringify(elements);

    const didInsert = editor
      .chain()
      .focus()
      .insertContent({
        type: 'excaliBlock',
        attrs: { data: json },
      })
      .run();

    setModalOpen(false);
  };

  return (
    <>
      <MenuButton
        tooltipLabel="Insert Drawing"
        IconComponent={DrawIcon}
        onClick={() => setModalOpen(true)}
        value="drawing"
        disabled={!isEditable}
      />
      {modalOpen && (
        <ExcalidrawModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialElements={[]}
          onSave={handleSave}
          readonly={!isEditable}
        />
      )}
    </>
  );
}
