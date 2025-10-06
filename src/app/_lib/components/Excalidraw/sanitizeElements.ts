import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

export const sanitizeExcalidrawElements = (
  list: readonly ExcalidrawElement[] | any[]
): ExcalidrawElement[] => {
  if (!Array.isArray(list)) {
    return [];
  }

  return list.filter((element): element is ExcalidrawElement => {
    if (!element || typeof element !== 'object') {
      return false;
    }

    const type = (element as { type?: unknown }).type;
    return type !== 'image';
  });
};
