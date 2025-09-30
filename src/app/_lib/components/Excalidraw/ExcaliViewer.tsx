// components/ExcaliDrawViewer.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((m) => m.Excalidraw),
  { ssr: false }
);

export function ExcaliDrawViewer({
  elements,
}: {
  elements: ExcalidrawElement[];
}) {
  return (
    <Excalidraw
      initialData={{ elements }}
      viewModeEnabled={true} // 🔑 read-only
    />
  );
}
