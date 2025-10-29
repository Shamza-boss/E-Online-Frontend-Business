import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs-dist/build/pdf.worker.mjs`;

export async function generatePdfThumbnail(
  file: File,
  width = 200,
  height = 260
): Promise<string> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // Load PDF using pdfjs from react-pdf
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  // Prepare canvas
  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(width / viewport.width, height / viewport.height);
  const scaledViewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');
  // Render page
  await page.render({ canvasContext: context, viewport: scaledViewport })
    .promise;
  // Get data URL
  return canvas.toDataURL('image/png');
}
