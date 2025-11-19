export const PDF_NOTE_LINK_ATTRIBUTE = 'data-pdf-link';
export const PDF_NOTE_LINK_SALT = 'eo-pdf-link';
export const PDF_NOTE_LINK_SELECTOR = `[${PDF_NOTE_LINK_ATTRIBUTE}="true"], [data-pdf-salt="${PDF_NOTE_LINK_SALT}"]`;
export const PDF_NOTE_LINK_CLASS = 'pdf-note-chip';
export const PDF_NOTE_CHIP_MUI_CLASSNAMES = `${PDF_NOTE_LINK_CLASS} pdf-note-chip--section`;
export const PDF_NOTE_DEFAULT_COLOR = '#2563eb';
export const PDF_NOTE_PAYLOAD_ATTR = 'data-pdf-payload';
export const PDF_NOTE_CHECKSUM_ATTR = 'data-pdf-checksum';

export interface PdfNoteLinkSummary {
  id: string;
  pageNumber: number;
  label: string;
  outlineTitle?: string | null;
  noteId?: string;
  fileUrl?: string;
  snippet?: string;
  createdAt: string;
  bookmarkTitle?: string;
  bookmarkColor?: string;
}

export interface PdfNoteLinkRequest {
  pageNumber: number;
  pageLabel: string;
  outlineTitle?: string | null;
  fileUrl: string;
  snippet?: string;
  createdAt?: string;
  bookmarkTitle?: string;
  bookmarkColor?: string;
}

export interface PdfNoteLinkInsertResult {
  id: string;
  html: string;
  chipHtml: string;
  sentinelHtml: string;
  summary: PdfNoteLinkSummary;
  attrs: PdfNoteLinkNodeAttributes;
}

export type PdfNoteLinkNodeAttributes = {
  [PDF_NOTE_LINK_ATTRIBUTE]: 'true';
  'data-pdf-salt': string;
  'data-pdf-payload': string;
  'data-pdf-checksum': string;
  'data-link-id': string;
  'data-page-number': string;
  'data-label': string;
  'data-outline-title': string;
  'data-file-url': string;
  'data-snippet': string;
  'data-created-at': string;
  'data-chip-label': string;
  'data-chip-color': string;
  role: string;
  tabindex: string;
  draggable: 'false';
  contenteditable: 'false';
  title: string;
  'aria-label': string;
};

interface PdfNoteLinkEncodedPayload {
  id: string;
  pageNumber: number;
  label: string;
  outlineTitle?: string | null;
  fileUrl?: string;
  snippet?: string;
  createdAt: string;
  bookmarkTitle?: string;
  bookmarkColor?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const fallbackId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const resolveId = (explicit?: string) => {
  if (explicit) {
    return explicit;
  }

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return fallbackId();
};

const base64Encode = (value: string) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf-8').toString('base64');
  }

  if (typeof btoa === 'function') {
    if (typeof TextEncoder !== 'undefined') {
      const encoded = new TextEncoder().encode(value);
      let binary = '';
      encoded.forEach((code) => {
        binary += String.fromCharCode(code);
      });
      return btoa(binary);
    }
    return btoa(value);
  }

  return value;
};

const base64Decode = (value: string) => {
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(value, 'base64').toString('utf-8');
    }

    if (typeof atob === 'function') {
      const binary = atob(value);
      if (typeof TextDecoder !== 'undefined') {
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        return new TextDecoder().decode(bytes);
      }
      return binary;
    }
  } catch (error) {
    console.warn('Failed to decode PDF note link payload', error);
  }

  return '';
};

export const computeChecksum = (input: string) => {
  const salted = `${PDF_NOTE_LINK_SALT}:${input}`;
  let hash = 0x9e3779b1;

  for (let index = 0; index < salted.length; index += 1) {
    hash ^= salted.charCodeAt(index);
    hash = Math.imul(hash, 0x5bd1e995);
    hash ^= hash >>> 13;
  }

  hash = Math.imul(hash, 0x5bd1e995);
  hash ^= hash >>> 15;

  return (hash >>> 0).toString(16);
};

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeHexColor = (value: string) => {
  if (!HEX_COLOR_PATTERN.test(value)) {
    return null;
  }

  if (value.length === 4) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return value.toLowerCase();
};

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, value));

const lightenHexColor = (hex: string, amount: number) => {
  const normalized = normalizeHexColor(hex) ?? PDF_NOTE_DEFAULT_COLOR;
  const safeAmount = clamp(amount, 0, 1);
  const components = [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];

  const toHex = (value: number) => clamp(value).toString(16).padStart(2, '0');

  const lightened = components.map((component) =>
    Math.round(component + (255 - component) * safeAmount)
  );

  return `#${toHex(lightened[0])}${toHex(lightened[1])}${toHex(lightened[2])}`;
};

const darkenHexColor = (hex: string, amount: number) => {
  const normalized = normalizeHexColor(hex) ?? PDF_NOTE_DEFAULT_COLOR;
  const safeAmount = clamp(amount, 0, 1);
  const components = [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];

  const toHex = (value: number) => clamp(value).toString(16).padStart(2, '0');

  const darkened = components.map((component) =>
    Math.round(component * (1 - safeAmount))
  );

  return `#${toHex(darkened[0])}${toHex(darkened[1])}${toHex(darkened[2])}`;
};

const hexToRgb = (value: string) => {
  const normalized = normalizeHexColor(value) ?? PDF_NOTE_DEFAULT_COLOR;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
};

const srgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
};

export const PDF_NOTE_SENTINEL_PREFIX = '\u2063PDF_NOTE:';
export const PDF_NOTE_SENTINEL_SUFFIX = ':NOTE_PDF\u2063';
export const PDF_NOTE_SENTINEL_ATTRIBUTE = 'data-pdf-sentinel';

export const buildPdfNoteSentinelText = (encodedPayload: string) =>
  `${PDF_NOTE_SENTINEL_PREFIX}${encodedPayload}${PDF_NOTE_SENTINEL_SUFFIX}`;

const extractEncodedPayloadFromSentinelText = (text?: string | null) => {
  if (!text) {
    return null;
  }

  const trimmed = text.trim();
  const prefixIndex = trimmed.indexOf(PDF_NOTE_SENTINEL_PREFIX);
  if (prefixIndex === -1) {
    return null;
  }

  const suffixIndex = trimmed.indexOf(
    PDF_NOTE_SENTINEL_SUFFIX,
    prefixIndex + PDF_NOTE_SENTINEL_PREFIX.length
  );

  if (suffixIndex === -1) {
    return null;
  }

  const encoded = trimmed.slice(
    prefixIndex + PDF_NOTE_SENTINEL_PREFIX.length,
    suffixIndex
  );

  return encoded.trim() || null;
};

const isSentinelElement = (node: Element | null): node is HTMLElement =>
  !!node &&
  node instanceof HTMLElement &&
  node.getAttribute(PDF_NOTE_SENTINEL_ATTRIBUTE) === 'true';

export const findNearestPdfNoteSentinel = (
  element: HTMLElement
): HTMLElement | null => {
  const direct = element.querySelector<HTMLElement>(
    `[${PDF_NOTE_SENTINEL_ATTRIBUTE}="true"]`
  );
  if (direct) {
    return direct;
  }

  const siblings = [element.nextElementSibling, element.previousElementSibling];
  for (const sibling of siblings) {
    if (isSentinelElement(sibling)) {
      return sibling;
    }
  }

  const parent = element.parentElement;
  if (!parent) {
    return null;
  }

  const linkId = element.getAttribute('data-link-id');
  if (!linkId) {
    return null;
  }

  for (const sibling of Array.from(parent.children)) {
    if (
      isSentinelElement(sibling) &&
      sibling.getAttribute('data-link-id') === linkId
    ) {
      return sibling as HTMLElement;
    }
  }

  return null;
};

export const extractEncodedPayloadFromSentinelElement = (
  element: HTMLElement | null
): string | null => {
  if (!element) {
    return null;
  }

  return extractEncodedPayloadFromSentinelText(element.textContent);
};

export interface DecodedPayloadResult {
  encoded: string;
  decoded: string;
  payload: PdfNoteLinkEncodedPayload;
}

export const decodePdfNotePayload = (
  encoded?: string | null,
  checksum?: string | null
): DecodedPayloadResult | null => {
  if (!encoded) {
    return null;
  }

  const decoded = base64Decode(encoded);
  if (!decoded) {
    return null;
  }

  if (checksum && computeChecksum(decoded) !== checksum) {
    return null;
  }

  try {
    const payload = JSON.parse(decoded) as PdfNoteLinkEncodedPayload;
    return {
      encoded,
      decoded,
      payload,
    };
  } catch (error) {
    console.warn('Unable to parse PDF note link payload', error);
  }

  return null;
};

const contrastRatio = (first: string, second: string) => {
  const lumA = relativeLuminance(first);
  const lumB = relativeLuminance(second);
  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);
  return (brightest + 0.05) / (darkest + 0.05);
};

const ensureReadableTextColor = (
  color: string,
  backgrounds: string[] = ['#ffffff', '#0f172a']
) => {
  const candidates = [
    color,
    lightenHexColor(color, 0.25),
    darkenHexColor(color, 0.25),
    lightenHexColor(color, 0.45),
    darkenHexColor(color, 0.45),
  ];

  let bestColor = '#1f2937';
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const score = Math.min(
      ...backgrounds.map((bg) => contrastRatio(candidate, bg))
    );

    if (score > bestScore) {
      bestScore = score;
      bestColor = candidate;
    }
  }

  return bestColor;
};

export interface PdfNoteLinkPalette {
  accent: string;
  muted: string;
  border: string;
  surface: string;
  halo: string;
}

export const sanitizeBookmarkColor = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : '';
};

export const getPdfNoteLinkPalette = (
  value?: string | null
): PdfNoteLinkPalette => {
  const accent = sanitizeBookmarkColor(value) || PDF_NOTE_DEFAULT_COLOR;
  const readable = ensureReadableTextColor(accent);
  return {
    accent,
    muted: readable,
    border: lightenHexColor(accent, 0.78),
    surface: 'transparent',
    halo: lightenHexColor(accent, 0.3),
  };
};

export const formatPdfNoteTimestamp = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  } catch {
    return parsed.toLocaleString('en-US');
  }
};

export const buildPdfNoteLinkHtml = (
  request: PdfNoteLinkRequest,
  explicitId?: string
): PdfNoteLinkInsertResult => {
  const id = resolveId(explicitId);
  const createdAt = request.createdAt ?? new Date().toISOString();
  const dataLabel =
    (request.pageLabel || '').trim() || `Page ${request.pageNumber}`;
  const outlineDisplay = request.outlineTitle?.trim() || '';
  const snippetDisplay = request.snippet?.trim() || '';
  const fileUrlValue = request.fileUrl ?? '';
  const chipLabelRaw = outlineDisplay
    ? `See ${outlineDisplay}`
    : `Open on Page ${request.pageNumber}`;
  const resolvedBookmarkTitle =
    (request.bookmarkTitle || '').trim() || chipLabelRaw;
  const chipDisplayText = resolvedBookmarkTitle;
  const palette = getPdfNoteLinkPalette(request.bookmarkColor);
  const timestampDisplay =
    formatPdfNoteTimestamp(createdAt) || 'Recently linked';
  const safeTimestamp = escapeHtml(timestampDisplay);
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

  const ariaLabel = `PDF link to ${dataLabel}`;
  const titleText = `Jump to ${dataLabel} (Page ${request.pageNumber})`;

  const payload: PdfNoteLinkEncodedPayload = {
    id,
    pageNumber: request.pageNumber,
    label: dataLabel,
    outlineTitle: outlineDisplay || undefined,
    fileUrl: fileUrlValue || undefined,
    snippet: snippetDisplay || undefined,
    createdAt,
    bookmarkTitle: resolvedBookmarkTitle,
    bookmarkColor: palette.accent,
  };

  const payloadJson = JSON.stringify(payload);
  const encodedPayload = base64Encode(payloadJson);
  const checksum = computeChecksum(payloadJson);

  const nodeAttrs: PdfNoteLinkNodeAttributes = {
    [PDF_NOTE_LINK_ATTRIBUTE]: 'true',
    'data-pdf-salt': PDF_NOTE_LINK_SALT,
    'data-pdf-payload': encodedPayload,
    'data-pdf-checksum': checksum,
    'data-link-id': id,
    'data-page-number': String(request.pageNumber),
    'data-label': dataLabel,
    'data-outline-title': outlineDisplay,
    'data-file-url': fileUrlValue,
    'data-snippet': snippetDisplay,
    'data-created-at': createdAt,
    'data-chip-label': resolvedBookmarkTitle,
    'data-chip-color': palette.accent,
    role: 'button',
    tabindex: '0',
    draggable: 'false',
    contenteditable: 'false',
    title: titleText,
    'aria-label': ariaLabel,
  };

  const inlineSegments = [
    `<span class="pdf-note-chip__segment pdf-note-chip__segment--primary">${escapeHtml(chipDisplayText)}</span>`,
    `<span class="pdf-note-chip__segment pdf-note-chip__segment--label">${escapeHtml(dataLabel)}</span>`,
    snippetDisplay
      ? `<span class="pdf-note-chip__segment pdf-note-chip__segment--snippet">${escapeHtml(snippetDisplay)}</span>`
      : '',
  ].filter(Boolean);

  const inlineContent = inlineSegments
    .map((segment, index) =>
      index === 0
        ? segment
        : `<span class="pdf-note-chip__separator" aria-hidden="true">•</span>${segment}`
    )
    .join('');

  const attributeString = Object.entries(nodeAttrs)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ');

  const chipHtml = `
    <span
      class="${PDF_NOTE_CHIP_MUI_CLASSNAMES}"
      ${attributeString}
      style="${wrapperStyle}"
    >
      <span
        class="pdf-note-chip__body"
        style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;"
      >
        <span
          class="pdf-note-chip__dot"
          aria-hidden="true"
          style="width:12px;height:12px;border-radius:999px;background:${palette.accent};box-shadow:0 0 0 4px ${palette.halo}33;flex-shrink:0;"
        ></span>
        <span
          class="pdf-note-chip__inline"
          style="display:flex;flex-wrap:wrap;gap:8px;row-gap:4px;align-items:center;color:${palette.muted};flex:1;min-width:0;"
        >
          ${inlineContent}
        </span>
      </span>
      <span
        class="pdf-note-chip__divider"
        aria-hidden="true"
        style="display:block;border-bottom:1px solid ${palette.border};margin-top:12px;"
      ></span>
      <span
        class="pdf-note-chip__footer"
        style="display:flex;align-items:center;justify-content:flex-end;gap:8px;font-size:0.75rem;font-weight:600;color:${palette.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:10px;"
      >
        <svg
          class="pdf-note-chip__link-icon"
          viewBox="0 0 24 24"
          focusable="false"
          aria-hidden="true"
          style="width:16px;height:16px;fill:${palette.muted};"
        >
          <path d="M10.59 13.41a1 1 0 0 0 1.41 0l4.59-4.59a3 3 0 0 0-4.24-4.24L11.4 5.14a1 1 0 0 0 1.42 1.41l1-1a1 1 0 1 1 1.41 1.41l-4.58 4.59a1 1 0 0 0 0 1.41Zm-4.24 4.25a3 3 0 0 0 4.24 0l1.54-1.54a1 1 0 0 0-1.41-1.41L9.18 16.75a1 1 0 1 1-1.41-1.41l4.58-4.59a1 1 0 1 0-1.41-1.41l-4.59 4.58a3 3 0 0 0 0 4.24Z" />
        </svg>
        <span class="pdf-note-chip__timestamp">${safeTimestamp}</span>
      </span>
    </span>`.trim();

  const sentinelText = buildPdfNoteSentinelText(encodedPayload);
  const sentinelHtml = `
    <span ${PDF_NOTE_SENTINEL_ATTRIBUTE}="true" data-link-id="${escapeHtml(
      id
    )}" hidden aria-hidden="true" style="display:none!important;visibility:hidden;width:0;height:0;overflow:hidden;padding:0;margin:0;">${escapeHtml(
      sentinelText
    )}</span>
  `.trim();

  const html = `${chipHtml}${sentinelHtml}`;

  return {
    id,
    html,
    chipHtml,
    sentinelHtml,
    summary: {
      id,
      pageNumber: request.pageNumber,
      label: request.pageLabel,
      outlineTitle: request.outlineTitle,
      fileUrl: request.fileUrl,
      snippet: request.snippet,
      createdAt,
      bookmarkTitle: resolvedBookmarkTitle,
      bookmarkColor: palette.accent || undefined,
    },
    attrs: nodeAttrs,
  };
};

export const extractPdfNoteLinks = (
  html?: string | null,
  noteId?: string
): PdfNoteLinkSummary[] => {
  if (
    !html ||
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return [];
  }

  const container = document.createElement('div');
  container.innerHTML = html;

  return Array.from(
    container.querySelectorAll<HTMLElement>(PDF_NOTE_LINK_SELECTOR)
  )
    .map((el) => parsePdfNoteLinkElement(el, noteId))
    .filter((value): value is PdfNoteLinkSummary => Boolean(value));
};

const buildSummaryFromPayload = (
  payload: PdfNoteLinkEncodedPayload,
  noteId?: string
): PdfNoteLinkSummary => ({
  id: payload.id || fallbackId(),
  pageNumber: payload.pageNumber || 1,
  label: payload.label || 'Page',
  outlineTitle: payload.outlineTitle ?? undefined,
  fileUrl: payload.fileUrl ?? undefined,
  snippet: payload.snippet ?? undefined,
  createdAt: payload.createdAt || new Date().toISOString(),
  bookmarkTitle: payload.bookmarkTitle ?? undefined,
  bookmarkColor:
    sanitizeBookmarkColor(payload.bookmarkColor ?? undefined) ?? undefined,
  noteId,
});

export const parsePdfNoteLinkElement = (
  el: HTMLElement,
  noteId?: string
): PdfNoteLinkSummary | null => {
  const saltAttr = el.getAttribute('data-pdf-salt');
  const isPdfLink =
    el.getAttribute(PDF_NOTE_LINK_ATTRIBUTE) === 'true' ||
    saltAttr === PDF_NOTE_LINK_SALT;

  if (!isPdfLink) {
    return null;
  }

  const payloadAttr = el.getAttribute(PDF_NOTE_PAYLOAD_ATTR);
  const checksumAttr = el.getAttribute(PDF_NOTE_CHECKSUM_ATTR);
  const decodedFromAttrs = decodePdfNotePayload(payloadAttr, checksumAttr);

  if (decodedFromAttrs) {
    return buildSummaryFromPayload(decodedFromAttrs.payload, noteId);
  }

  const sentinelElement = findNearestPdfNoteSentinel(el);
  const sentinelEncoded = extractEncodedPayloadFromSentinelElement(
    sentinelElement
  );
  const decodedFromSentinel = decodePdfNotePayload(sentinelEncoded);

  if (decodedFromSentinel) {
    return buildSummaryFromPayload(decodedFromSentinel.payload, noteId);
  }

  const base = {
    id: el.getAttribute('data-link-id') ?? fallbackId(),
    pageNumber: Number(el.getAttribute('data-page-number') ?? 1) || 1,
    label: el.getAttribute('data-label') ?? 'Page',
    outlineTitle: el.getAttribute('data-outline-title') ?? undefined,
    fileUrl: el.getAttribute('data-file-url') ?? undefined,
    snippet: el.getAttribute('data-snippet') ?? undefined,
    createdAt: el.getAttribute('data-created-at') ?? new Date().toISOString(),
    bookmarkTitle: el.getAttribute('data-chip-label') ?? undefined,
    bookmarkColor:
      sanitizeBookmarkColor(el.getAttribute('data-chip-color') ?? undefined) ||
      undefined,
  } satisfies Omit<PdfNoteLinkSummary, 'noteId'>;

  return {
    ...base,
    noteId,
  };
};
