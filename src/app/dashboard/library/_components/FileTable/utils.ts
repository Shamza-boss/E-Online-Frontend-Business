export function extractName(fileKey: string): string {
  return fileKey.split('_').pop() ?? fileKey;
}
