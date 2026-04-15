import type { EditorHandle } from '@/app/_lib/components/TipTapEditor/Editor';
import type {
  PdfNoteLinkRequest,
  PdfNoteLinkSummary,
} from '@/app/_lib/utils/pdfNoteLinks';
import { buildPdfNoteLinkHtml } from '@/app/_lib/utils/pdfNoteLinks';

/**
 * Sync live note content from the editor handle into state.
 */
export const syncEditorContent = (
  editor: EditorHandle,
  setLiveNoteContent: (html: string) => void
) => {
  const html = editor.getHtml();
  if (typeof html === 'string') {
    setLiveNoteContent(html);
  }
};

/**
 * Scroll to and pulse-animate a note chip identified by its link ID.
 */
export const scrollAndPulseNoteChip = (
  linkId: string,
  editorHandle?: EditorHandle | null
) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  type QueryRoot = Document | HTMLElement;
  const selector = `[data-link-id="${linkId}"]`;
  const contexts: QueryRoot[] = [];
  const editorRoot = editorHandle?.getRootElement?.();
  if (editorRoot) {
    contexts.push(editorRoot);
  }
  contexts.push(document);

  window.requestAnimationFrame(() => {
    for (const context of contexts) {
      const chip = context.querySelector<HTMLElement>(selector);
      if (!chip) {
        continue;
      }
      chip.classList.remove('pdf-note-chip--pulse');
      void chip.offsetWidth;
      chip.classList.add('pdf-note-chip--pulse');
      chip.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;
    }
  });
};

/**
 * Get the active editor handle (fullscreen or notes), falling back with a delay if needed.
 */
export const getEditorHandle = (
  isFullscreen: boolean,
  fullscreenEditorRef: React.RefObject<EditorHandle | null>,
  notesEditorRef: React.RefObject<EditorHandle | null>
): EditorHandle | null => {
  return (
    (isFullscreen ? fullscreenEditorRef.current : notesEditorRef.current) ??
    notesEditorRef.current ??
    fullscreenEditorRef.current
  );
};

/**
 * Run a task against the active editor, opening notes if needed.
 */
export const withEditorHandle = (
  task: (editor: EditorHandle) => void,
  isFullscreen: boolean,
  fullscreenEditorRef: React.RefObject<EditorHandle | null>,
  notesEditorRef: React.RefObject<EditorHandle | null>,
  ensureNotesVisible: () => boolean
) => {
  const immediate = getEditorHandle(
    isFullscreen,
    fullscreenEditorRef,
    notesEditorRef
  );

  if (immediate) {
    task(immediate);
    return;
  }

  const opened = ensureNotesVisible();
  const timeout = opened ? 350 : 150;
  setTimeout(() => {
    const fallback = notesEditorRef.current ?? fullscreenEditorRef.current;
    if (fallback) {
      task(fallback);
      return;
    }
    console.warn('Unable to access notebook editor to insert PDF link.');
  }, timeout);
};

/**
 * Focus a note chip by ensuring notes are visible and scrolling to it.
 */
export const focusNoteChip = (
  linkId: string,
  ensureNotesVisible: () => boolean,
  isFullscreen: boolean,
  fullscreenEditorRef: React.RefObject<EditorHandle | null>,
  notesEditorRef: React.RefObject<EditorHandle | null>
) => {
  const notesJustOpened = ensureNotesVisible();
  const delay = notesJustOpened ? 350 : 0;
  const run = () =>
    withEditorHandle(
      (editorHandle) => scrollAndPulseNoteChip(linkId, editorHandle),
      isFullscreen,
      fullscreenEditorRef,
      notesEditorRef,
      ensureNotesVisible
    );

  if (delay) {
    setTimeout(run, delay);
  } else {
    run();
  }
};

/**
 * Handle creating a new PDF-note link in the editor.
 */
export const handleCreateNoteLinkRequest = (
  payload: PdfNoteLinkRequest,
  isFullscreen: boolean,
  fullscreenEditorRef: React.RefObject<EditorHandle | null>,
  notesEditorRef: React.RefObject<EditorHandle | null>,
  ensureNotesVisible: () => boolean,
  setLiveNoteContent: (html: string) => void,
  setActiveNoteLinkId: (id: string) => void
) => {
  withEditorHandle(
    (editorHandle) => {
      const { html, summary, attrs } = buildPdfNoteLinkHtml(payload);
      const inserted = editorHandle.insertPdfLink?.(attrs) ?? false;
      if (!inserted) {
        editorHandle.insertHtml(html);
      }
      syncEditorContent(editorHandle, setLiveNoteContent);
      setActiveNoteLinkId(summary.id);
      scrollAndPulseNoteChip(summary.id, editorHandle);
    },
    isFullscreen,
    fullscreenEditorRef,
    notesEditorRef,
    ensureNotesVisible
  );
};

/**
 * Handle updating an existing PDF-note link in the editor.
 */
export const handleUpdateNoteLinkRequest = (
  link: PdfNoteLinkSummary,
  payload: { title: string; color: string },
  isFullscreen: boolean,
  fullscreenEditorRef: React.RefObject<EditorHandle | null>,
  notesEditorRef: React.RefObject<EditorHandle | null>,
  ensureNotesVisible: () => boolean,
  setLiveNoteContent: (html: string) => void,
  setActiveNoteLinkId: (id: string) => void
) => {
  withEditorHandle(
    (editorHandle) => {
      const updated = editorHandle.updatePdfLink?.(link.id, {
        chipLabel: payload.title,
        chipColor: payload.color,
      });
      if (updated) {
        syncEditorContent(editorHandle, setLiveNoteContent);
        setActiveNoteLinkId(link.id);
        focusNoteChip(
          link.id,
          ensureNotesVisible,
          isFullscreen,
          fullscreenEditorRef,
          notesEditorRef
        );
      }
    },
    isFullscreen,
    fullscreenEditorRef,
    notesEditorRef,
    ensureNotesVisible
  );
};
