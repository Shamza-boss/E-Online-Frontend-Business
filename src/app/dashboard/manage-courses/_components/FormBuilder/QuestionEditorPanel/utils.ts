import type { Question } from '@/app/_lib/interfaces/types';

export const isSectionType = (type: Question['type']) =>
  type === 'video' || type === 'pdf' || type === 'group';

export const isContainerType = (type: Question['type']) =>
  isSectionType(type) || type === 'single-select' || type === 'multi-select';

export const allowedTypeHint = (parentType: Question['type']) => {
  if (parentType === 'video' || parentType === 'pdf') {
    return 'Single Choice or Multiple Choice';
  }
  if (parentType === 'group') {
    return 'Video Section, PDF Section, Single Choice, or Multiple Choice';
  }
  if (parentType === 'single-select' || parentType === 'multi-select') {
    return 'Single Choice or Multiple Choice';
  }
  return '';
};

export const getTypeVisual = (type: Question['type']) => {
  if (type === 'pdf') {
    return {
      label: 'PDF Section',
      borderColor: 'warning.main',
      headerBg: 'warning.50',
      chipColor: 'warning' as const,
    };
  }

  if (type === 'video') {
    return {
      label: 'Video Section',
      borderColor: 'info.main',
      headerBg: 'info.50',
      chipColor: 'info' as const,
    };
  }

  if (type === 'group') {
    return {
      label: 'Grouped Question',
      borderColor: 'secondary.main',
      headerBg: 'secondary.50',
      chipColor: 'secondary' as const,
    };
  }

  return {
    label: 'Question',
    borderColor: 'primary.main',
    headerBg: 'primary.50',
    chipColor: 'primary' as const,
  };
};

export const cleanupDragPreview = (
  ref: React.MutableRefObject<HTMLElement | null>
) => {
  if (ref.current) {
    ref.current.remove();
  }
  ref.current = null;
};

export const setSolidDragPreview = (
  event: React.DragEvent<HTMLElement>,
  ref: React.MutableRefObject<HTMLElement | null>
) => {
  cleanupDragPreview(ref);
  const sourceEl = event.currentTarget;
  const rect = sourceEl.getBoundingClientRect();
  const computed = globalThis.getComputedStyle(sourceEl);
  const clone = sourceEl.cloneNode(true) as HTMLElement;

  clone.style.position = 'fixed';
  clone.style.top = '-10000px';
  clone.style.left = '-10000px';
  clone.style.width = `${rect.width}px`;
  clone.style.maxWidth = `${rect.width}px`;
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '1';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.background = computed.backgroundColor || '#fff';
  clone.style.border = '2px solid #1976d2';
  clone.style.borderRadius = computed.borderRadius;
  clone.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';

  globalThis.document.body.appendChild(clone);
  ref.current = clone;

  const offsetX = Math.min(24, Math.max(0, event.clientX - rect.left));
  const offsetY = Math.min(24, Math.max(0, event.clientY - rect.top));
  event.dataTransfer.setDragImage(clone, offsetX, offsetY);
};
