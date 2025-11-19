import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {
  PDF_NOTE_LINK_ATTRIBUTE,
  PDF_NOTE_LINK_SALT,
  PDF_NOTE_CHIP_MUI_CLASSNAMES,
  PDF_NOTE_ELEMENT_TAG,
  findNearestPdfNoteSentinel,
  extractEncodedPayloadFromSentinelElement,
  decodePdfNotePayload,
  computeChecksum,
  sanitizeBookmarkColor,
} from '@/app/_lib/utils/pdfNoteLinks';
import PdfNoteChipNodeView from '../PdfNoteChipNodeView';

const SELECTORS = [
  PDF_NOTE_ELEMENT_TAG,
  `[${PDF_NOTE_LINK_ATTRIBUTE}="true"]`,
  `[data-pdf-salt="${PDF_NOTE_LINK_SALT}"]`,
];

const getAttr = (
  element: HTMLElement,
  attr: string,
  fallback: string | null = null
) => element.getAttribute(attr) ?? fallback;

const recoverPayloadFromSentinel = (element: HTMLElement) => {
  const sentinel = findNearestPdfNoteSentinel(element);
  if (!sentinel) {
    return null;
  }

  const encoded = extractEncodedPayloadFromSentinelElement(sentinel);
  if (!encoded) {
    return null;
  }

  return decodePdfNotePayload(encoded);
};

export const PdfNoteLink = Node.create({
  name: 'pdfNoteLink',
  group: 'block',
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
      'data-pdf-payload': {
        default: null,
      },
      'data-pdf-checksum': {
        default: null,
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

        const payloadAttr = getAttr(node, 'data-pdf-payload');
        const checksumAttr = getAttr(node, 'data-pdf-checksum');
        const decodedFromAttrs = decodePdfNotePayload(
          payloadAttr,
          checksumAttr
        );
        const decodedFromSentinel = decodedFromAttrs
          ? null
          : recoverPayloadFromSentinel(node);
        const recovered = decodedFromAttrs ?? decodedFromSentinel ?? null;
        const fallbackPayload = recovered?.payload;
        const resolvedPayloadAttr = recovered?.encoded ?? payloadAttr ?? null;
        const resolvedChecksumAttr =
          checksumAttr ??
          (recovered ? computeChecksum(recovered.decoded) : null);
        const fallbackPageNumber =
          typeof fallbackPayload?.pageNumber === 'number'
            ? String(fallbackPayload.pageNumber)
            : null;
        const fallbackLabel = fallbackPayload?.label ?? null;
        const fallbackOutline = fallbackPayload?.outlineTitle ?? null;
        const fallbackFileUrl = fallbackPayload?.fileUrl ?? null;
        const fallbackSnippet = fallbackPayload?.snippet ?? null;
        const fallbackCreatedAt = fallbackPayload?.createdAt ?? null;
        const fallbackBookmarkTitle =
          fallbackPayload?.bookmarkTitle ?? fallbackLabel ?? null;
        const fallbackBookmarkColor = sanitizeBookmarkColor(
          fallbackPayload?.bookmarkColor ?? undefined
        );

        return {
          [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
          'data-pdf-salt': getAttr(node, 'data-pdf-salt', PDF_NOTE_LINK_SALT),
          'data-pdf-payload': resolvedPayloadAttr,
          'data-pdf-checksum': resolvedChecksumAttr,
          'data-link-id': getAttr(node, 'data-link-id') ?? fallbackPayload?.id,
          'data-page-number':
            getAttr(node, 'data-page-number') ?? fallbackPageNumber,
          'data-label': getAttr(node, 'data-label') ?? fallbackLabel,
          'data-outline-title':
            getAttr(node, 'data-outline-title') ?? fallbackOutline,
          'data-file-url': getAttr(node, 'data-file-url') ?? fallbackFileUrl,
          'data-snippet': getAttr(node, 'data-snippet') ?? fallbackSnippet,
          'data-created-at':
            getAttr(node, 'data-created-at') ?? fallbackCreatedAt,
          'data-chip-label':
            getAttr(node, 'data-chip-label') ?? fallbackBookmarkTitle,
          'data-chip-color':
            getAttr(node, 'data-chip-color') ?? fallbackBookmarkColor ?? null,
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
    const {
      style: _legacyStyle,
      class: legacyClass,
      ...restAttributes
    } = (HTMLAttributes as Record<string, unknown>) ?? {};

    const attrs = mergeAttributes(
      {
        class: legacyClass ?? PDF_NOTE_CHIP_MUI_CLASSNAMES,
        [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
        'data-pdf-salt': PDF_NOTE_LINK_SALT,
      },
      restAttributes
    );

    return [PDF_NOTE_ELEMENT_TAG, attrs];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PdfNoteChipNodeView);
  },
});
