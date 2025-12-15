export const extractPlainText = (html: string | null | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
};
