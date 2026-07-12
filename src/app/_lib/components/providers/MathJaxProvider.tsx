'use client';

import { MathJaxContext } from 'better-react-mathjax';
import type { ReactNode } from 'react';

export const MATHJAX_CONFIG = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  loader: { load: ['input/tex', 'output/chtml'] },
} as const;

export default function MathJaxProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MathJaxContext version={3} config={MATHJAX_CONFIG}>
      {children}
    </MathJaxContext>
  );
}
