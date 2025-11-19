import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {
  PDF_NOTE_LINK_ATTRIBUTE,
  PDF_NOTE_LINK_SALT,
  PDF_NOTE_CHIP_MUI_CLASSNAMES,
  formatPdfNoteTimestamp,
  getPdfNoteLinkPalette,
} from '@/app/_lib/utils/pdfNoteLinks';
import PdfNoteChipNodeView from '../PdfNoteChipNodeView';

const SELECTORS = [
  `[${PDF_NOTE_LINK_ATTRIBUTE}="true"]`,
  `[data-pdf-salt="${PDF_NOTE_LINK_SALT}"]`,
];

const getAttr = (
  element: HTMLElement,
  attr: string,
  fallback: string | null = null
) => element.getAttribute(attr) ?? fallback;

export const PdfNoteLink = Node.create({
  name: 'pdfNoteLink',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  draggable: false,
  defining: true,
  addAttributes() {
    return {
      [PDF_NOTE_LINK_ATTRIBUTE]: {
        default: 'true',
      },
      'data-pdf-salt': {
        default: PDF_NOTE_LINK_SALT,
      },
      'data-link-id': {
        default: null,
      },
      'data-page-number': {
        default: null,
      },
      'data-label': {
        default: null,
      },
      'data-outline-title': {
        default: null,
      },
      'data-file-url': {
        default: null,
      },
      'data-snippet': {
        default: null,
      },
      'data-created-at': {
        default: null,
      },
      'data-chip-label': {
        default: null,
      },
      'data-chip-color': {
        default: null,
      },
      role: {
        default: 'button',
      },
      tabindex: {
        default: '0',
      },
      draggable: {
        default: 'false',
      },
      contenteditable: {
        default: 'false',
      },
      title: {
        default: null,
      },
      'aria-label': {
        default: null,
      },
    };
  },
  parseHTML() {
    return SELECTORS.map((tag) => ({
      tag,
      getAttrs: (node) => {
        if (!(node instanceof HTMLElement)) {
          return false;
        }

        return {
          [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
          'data-pdf-salt': getAttr(node, 'data-pdf-salt', PDF_NOTE_LINK_SALT),
          'data-link-id': getAttr(node, 'data-link-id'),
          'data-page-number': getAttr(node, 'data-page-number'),
          'data-label': getAttr(node, 'data-label'),
          'data-outline-title': getAttr(node, 'data-outline-title'),
          'data-file-url': getAttr(node, 'data-file-url'),
          'data-snippet': getAttr(node, 'data-snippet'),
          'data-created-at': getAttr(node, 'data-created-at'),
          'data-chip-label': getAttr(node, 'data-chip-label'),
          'data-chip-color': getAttr(node, 'data-chip-color'),
          role: getAttr(node, 'role', 'button'),
          tabindex: getAttr(node, 'tabindex', '0'),
          draggable: getAttr(node, 'draggable', 'false'),
          contenteditable: 'false',
          title: getAttr(node, 'title'),
          'aria-label': getAttr(node, 'aria-label'),
        };
      },
    }));
  },
  renderHTML({ HTMLAttributes }) {
    const label = HTMLAttributes['data-label'] ?? 'Page';
    const pageNumber = HTMLAttributes['data-page-number'];
    const chipAttrText = HTMLAttributes['data-chip-label'];
    const outlineTitle = HTMLAttributes['data-outline-title'];
    const snippet = HTMLAttributes['data-snippet'];
    const chipText = chipAttrText
      ? chipAttrText
      : outlineTitle
        ? `See: ${outlineTitle}`
        : pageNumber
          ? `See page ${pageNumber}`
          : 'Open in PDF';
    const bookmarkColor = HTMLAttributes['data-chip-color'];
    const createdAt = HTMLAttributes['data-created-at'];
    const palette = getPdfNoteLinkPalette(bookmarkColor);
    const timestamp = formatPdfNoteTimestamp(createdAt) || 'Recently linked';
    const wrapperStyle = [
      'display:block',
      'width:100%',
      'box-sizing:border-box',
      'text-decoration:none',
      'cursor:pointer',
      'margin:12px 0',
      'padding:8px 0',
      'border-radius:0',
      'background:transparent',
      'border:none',
      `color:${palette.muted}`,
    ].join(';');

    const { style: _legacyStyle, ...restAttributes } =
      (HTMLAttributes as Record<string, unknown>) ?? {};

    const attrs = mergeAttributes(
      {
        class: PDF_NOTE_CHIP_MUI_CLASSNAMES,
        [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
        'data-pdf-salt': PDF_NOTE_LINK_SALT,
        role: 'button',
        tabindex: '0',
        draggable: 'false',
        contenteditable: 'false',
        'aria-label': `PDF link to ${label}`,
        title: pageNumber
          ? `Jump to ${label} (Page ${pageNumber})`
          : `Jump to ${label}`,
      },
      restAttributes,
      {
        style: wrapperStyle,
        'data-chip-color': palette.accent,
      }
    );

    const inlineSegments: Array<[string, Record<string, string>, string]> = [];

    const pushSegment = (
      value: string | null | undefined,
      className: string,
      styleExtra = ''
    ) => {
      if (!value) {
        return;
      }

      if (inlineSegments.length > 0) {
        inlineSegments.push([
          'span',
          {
            class: 'pdf-note-chip__separator',
            'aria-hidden': 'true',
            style: 'opacity:0.6;',
          },
          '•',
        ]);
      }

      inlineSegments.push([
        'span',
        {
          class: className,
          style: `color:${palette.muted};${styleExtra}`,
        },
        value,
      ]);
    };

    pushSegment(
      chipText,
      'pdf-note-chip__segment pdf-note-chip__segment--primary',
      'font-weight:600;'
    );
    pushSegment(
      label,
      'pdf-note-chip__segment pdf-note-chip__segment--label',
      'font-weight:500;opacity:0.9;'
    );
    pushSegment(
      typeof snippet === 'string' ? snippet : null,
      'pdf-note-chip__segment pdf-note-chip__segment--snippet',
      'opacity:0.75;font-size:0.9em;'
    );

    return [
      'span',
      attrs,
      [
        'span',
        {
          class: 'pdf-note-chip__body',
          style: 'display:flex;align-items:center;gap:12px;flex-wrap:wrap;',
        },
        [
          'span',
          {
            class: 'pdf-note-chip__dot',
            'aria-hidden': 'true',
            style: `width:12px;height:12px;border-radius:999px;background:${palette.accent};box-shadow:0 0 0 4px ${palette.halo}33;flex-shrink:0;`,
          },
        ],
        [
          'span',
          {
            class: 'pdf-note-chip__inline',
            style:
              'display:flex;flex-wrap:wrap;gap:8px;row-gap:4px;flex:1;min-width:0;align-items:center;',
          },
          ...inlineSegments,
        ],
      ],
      [
        'span',
        {
          class: 'pdf-note-chip__divider',
          'aria-hidden': 'true',
          style: `display:block;border-bottom:1px solid ${palette.border};margin-top:12px;`,
        },
      ],
      [
        'span',
        {
          class: 'pdf-note-chip__footer',
          style: `display:flex;align-items:center;justify-content:flex-end;gap:8px;font-size:0.75rem;font-weight:600;color:${palette.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:10px;`,
        },
        [
          'svg',
          {
            class: 'pdf-note-chip__link-icon',
            viewBox: '0 0 24 24',
            focusable: 'false',
            'aria-hidden': 'true',
            style: `width:16px;height:16px;fill:${palette.muted};`,
          },
          [
            'path',
            {
              d: 'M10.59 13.41a1 1 0 0 0 1.41 0l4.59-4.59a3 3 0 0 0-4.24-4.24L11.4 5.14a1 1 0 0 0 1.42 1.41l1-1a1 1 0 1 1 1.41 1.41l-4.58 4.59a1 1 0 0 0 0 1.41Zm-4.24 4.25a3 3 0 0 0 4.24 0l1.54-1.54a1 1 0 0 0-1.41-1.41L9.18 16.75a1 1 0 1 1-1.41-1.41l4.58-4.59a1 1 0 1 0-1.41-1.41l-4.59 4.58a3 3 0 0 0 0 4.24Z',
            },
          ],
        ],
        [
          'span',
          {
            class: 'pdf-note-chip__timestamp',
          },
          timestamp,
        ],
      ],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PdfNoteChipNodeView);
  },
});
