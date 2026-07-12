'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import type { Question } from '@/app/_lib/interfaces/types';
import { IsValidChild, isChoiceType } from '../questionUtils';
import { SUBQUESTION_DND_MIME } from './constants';
import {
  isSectionType,
  cleanupDragPreview,
  setSolidDragPreview,
} from './utils';
import { PaletteSlotBox, ReorderSlotBox } from './elements';

type SubDragState = {
  dragging: string | null;
  parentId: string | null;
  fromIndex: number;
  over: string | null;
  slot: number | null;
};

type UseQuestionEditorDnDArgs = {
  paletteMimeType?: string;
  paletteDragType?: Question['type'] | null;
  onInsertSubquestionFromPalette?: (
    parentId: string,
    insertIndex: number,
    type: Question['type'],
  ) => void;
  onReorderSubquestions?: (
    parentId: string,
    fromIdx: number,
    toIdx: number,
  ) => void;
  onDragHandleStart?: (event: React.DragEvent<HTMLElement>) => void;
  onDragHandleEnd?: () => void;
};

export function useQuestionEditorDnD({
  paletteMimeType,
  paletteDragType,
  onInsertSubquestionFromPalette,
  onReorderSubquestions,
  onDragHandleStart,
  onDragHandleEnd,
}: UseQuestionEditorDnDArgs) {
  const [subDragState, setSubDragState] = useState<SubDragState>({
    dragging: null,
    parentId: null,
    fromIndex: -1,
    over: null,
    slot: null,
  });
  const [paletteDropTarget, setPaletteDropTarget] = useState<{
    parentId: string;
    slot: number;
  } | null>(null);
  const [paletteContainerTargetId, setPaletteContainerTargetId] = useState<
    string | null
  >(null);
  const dragPreviewRef = useRef<HTMLElement | null>(null);

  const paletteMime = paletteMimeType ?? 'application/x-eonline-question-type';
  const isComponentPaletteDrag = Boolean(paletteDragType);

  useEffect(() => {
    if (!isComponentPaletteDrag && paletteDropTarget) {
      setPaletteDropTarget(null);
    }
    if (!isComponentPaletteDrag && paletteContainerTargetId) {
      setPaletteContainerTargetId(null);
    }
  }, [isComponentPaletteDrag, paletteDropTarget, paletteContainerTargetId]);

  const canReceivePaletteDrop = (parent: Question, _parentDepth: number) => {
    const parentHasSubquestions =
      parent.subquestions && parent.subquestions.length > 0;
    if (!isSectionType(parent.type) && !parentHasSubquestions) return false;
    if (!isSectionType(parent.type) && !isChoiceType(parent.type)) return false;
    if (!paletteDragType) return false;
    return IsValidChild(parent.type, paletteDragType);
  };

  const canReceivePaletteDropType = (
    parent: Question,
    type: Question['type'],
  ) => {
    const parentHasSubquestions =
      parent.subquestions && parent.subquestions.length > 0;
    if (!isSectionType(parent.type) && !parentHasSubquestions) return false;
    if (!isSectionType(parent.type) && !isChoiceType(parent.type)) return false;
    return IsValidChild(parent.type, type);
  };

  const handlePaletteContainerDragOver = (
    event: React.DragEvent,
    parent: Question,
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    if (!canReceivePaletteDropType(parent, type)) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setPaletteContainerTargetId(parent.id);
  };

  const handlePaletteContainerDragLeave = (
    event: React.DragEvent,
    parentId: string,
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setPaletteContainerTargetId((prev) => (prev === parentId ? null : prev));
  };

  const handlePaletteContainerDrop = (
    event: React.DragEvent,
    parent: Question,
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    if (!canReceivePaletteDropType(parent, type)) return;

    event.preventDefault();
    event.stopPropagation();
    setPaletteContainerTargetId(null);

    const insertIndex = (parent.subquestions ?? []).length;
    onInsertSubquestionFromPalette?.(parent.id, insertIndex, type);
  };

  const handlePaletteSlotDragOver = (
    event: React.DragEvent,
    parent: Question,
    parentDepth: number,
    slotIndex: number,
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
    if (!canReceivePaletteDrop(parent, parentDepth)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setPaletteDropTarget((prev) => {
      if (prev && prev.parentId === parent.id && prev.slot === slotIndex)
        return prev;
      return { parentId: parent.id, slot: slotIndex };
    });
  };

  const handlePaletteSlotDragLeave = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number,
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setPaletteDropTarget((prev) => {
      if (!prev) return prev;
      if (prev.parentId === parentId && prev.slot === slotIndex) return null;
      return prev;
    });
  };

  const handlePaletteSlotDrop = (
    event: React.DragEvent,
    parent: Question,
    parentDepth: number,
    slotIndex: number,
  ) => {
    if (!paletteMime || !event.dataTransfer.types.includes(paletteMime)) return;
    if (!canReceivePaletteDrop(parent, parentDepth)) return;
    event.preventDefault();
    event.stopPropagation();
    setPaletteDropTarget(null);
    const type = event.dataTransfer.getData(paletteMime) as Question['type'];
    if (!type) return;
    onInsertSubquestionFromPalette?.(parent.id, slotIndex, type);
  };

  const renderPaletteSlot = (
    parent: Question,
    parentDepth: number,
    slotIndex: number,
  ): React.ReactNode => {
    if (!onInsertSubquestionFromPalette) return null;
    if (!isComponentPaletteDrag) return null;
    if (!canReceivePaletteDrop(parent, parentDepth)) return null;

    const isActive =
      paletteDropTarget?.parentId === parent.id &&
      paletteDropTarget.slot === slotIndex;

    return (
      <PaletteSlotBox
        key={`${parent.id}-palette-slot-${slotIndex}`}
        $isActive={isActive}
        onDragOver={(event) =>
          handlePaletteSlotDragOver(event, parent, parentDepth, slotIndex)
        }
        onDragLeave={(event) =>
          handlePaletteSlotDragLeave(event, parent.id, slotIndex)
        }
        onDrop={(event) =>
          handlePaletteSlotDrop(event, parent, parentDepth, slotIndex)
        }
      >
        <Typography variant="caption" color="primary.dark">
          Drop here
        </Typography>
      </PaletteSlotBox>
    );
  };

  const handleSubDragStart = (
    event: React.DragEvent,
    parentId: string,
    index: number,
    subId: string,
  ) => {
    event.stopPropagation();
    setSolidDragPreview(event as React.DragEvent<HTMLElement>, dragPreviewRef);
    event.dataTransfer.setData(
      SUBQUESTION_DND_MIME,
      JSON.stringify({ parentId, index }),
    );
    event.dataTransfer.effectAllowed = 'move';
    setSubDragState({
      dragging: subId,
      parentId,
      fromIndex: index,
      over: null,
      slot: null,
    });
  };

  const handleSubDragOver = (event: React.DragEvent, subId: string) => {
    if (!subDragState.dragging) return;
    event.preventDefault();
    if (subDragState.over !== subId) {
      setSubDragState((prev) => ({ ...prev, over: subId, slot: null }));
    }
  };

  const handleSubDrop = (
    event: React.DragEvent,
    parentId: string,
    targetIndex: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = event.dataTransfer.getData(SUBQUESTION_DND_MIME);
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
    if (!payload) return;
    try {
      const { parentId: sourceParent, index } = JSON.parse(payload) as {
        parentId: string;
        index: number;
      };
      if (sourceParent === parentId) {
        onReorderSubquestions?.(parentId, index, targetIndex);
      }
    } catch {
      /* noop */
    }
  };

  const handleSubDragEnd = () => {
    cleanupDragPreview(dragPreviewRef);
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
  };

  const handleQuestionDragStart = (event: React.DragEvent<HTMLElement>) => {
    setSolidDragPreview(event, dragPreviewRef);
    onDragHandleStart?.(event);
  };

  const handleQuestionDragEnd = () => {
    cleanupDragPreview(dragPreviewRef);
    onDragHandleEnd?.();
  };

  const handleSubSlotDragOver = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number,
  ) => {
    if (
      !subDragState.dragging ||
      subDragState.parentId !== parentId ||
      !event.dataTransfer.types.includes(SUBQUESTION_DND_MIME)
    ) {
      return;
    }
    event.preventDefault();
    setSubDragState((prev) => {
      if (prev.slot === slotIndex) return prev;
      return { ...prev, slot: slotIndex, over: null };
    });
  };

  const handleSubSlotDragLeave = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number,
  ) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setSubDragState((prev) => {
      if (prev.parentId === parentId && prev.slot === slotIndex) {
        return { ...prev, slot: null };
      }
      return prev;
    });
  };

  const handleSubSlotDrop = (
    event: React.DragEvent,
    parentId: string,
    slotIndex: number,
  ) => {
    if (
      !subDragState.dragging ||
      subDragState.parentId !== parentId ||
      !event.dataTransfer.types.includes(SUBQUESTION_DND_MIME)
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const fromIndex = subDragState.fromIndex;
    if (fromIndex === -1) return;
    const targetIndex = fromIndex < slotIndex ? slotIndex - 1 : slotIndex;
    onReorderSubquestions?.(parentId, fromIndex, targetIndex);
    setSubDragState({
      dragging: null,
      parentId: null,
      fromIndex: -1,
      over: null,
      slot: null,
    });
  };

  const renderSubReorderSlot = (
    parentId: string,
    slotIndex: number,
  ): React.ReactNode => {
    if (!subDragState.dragging || subDragState.parentId !== parentId)
      return null;
    const isActive =
      subDragState.slot === slotIndex && subDragState.parentId === parentId;

    return (
      <ReorderSlotBox
        key={`${parentId}-reorder-slot-${slotIndex}`}
        $isActive={isActive}
        onDragOver={(event) =>
          handleSubSlotDragOver(event, parentId, slotIndex)
        }
        onDragLeave={(event) =>
          handleSubSlotDragLeave(event, parentId, slotIndex)
        }
        onDrop={(event) => handleSubSlotDrop(event, parentId, slotIndex)}
      >
        {isActive && (
          <Typography
            variant="caption"
            color="primary.dark"
            display="block"
            textAlign="center"
            sx={{ py: 0.5 }}
          >
            Drop to reorder
          </Typography>
        )}
      </ReorderSlotBox>
    );
  };

  return {
    subDragState,
    paletteContainerTargetId,
    isComponentPaletteDrag,
    renderPaletteSlot,
    renderSubReorderSlot,
    handlePaletteContainerDragOver,
    handlePaletteContainerDragLeave,
    handlePaletteContainerDrop,
    handleSubDragStart,
    handleSubDragOver,
    handleSubDrop,
    handleSubDragEnd,
    handleQuestionDragStart,
    handleQuestionDragEnd,
  };
}
