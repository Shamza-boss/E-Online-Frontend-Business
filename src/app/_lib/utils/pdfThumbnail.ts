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
  const pdf = await pdfjs.getDocument({
    data: arrayBuffer,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
  }).promise;
  const page = await pdf.getPage(1);
  // Prepare canvas at full target resolution
  const viewport = page.getViewport({ scale: 1 });
  const scaleX = width / viewport.width;
  const scaleY = height / viewport.height;
  const scale = Math.min(scaleX, scaleY);
  const scaledViewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
  if (!context) throw new Error('Could not get canvas context');
  
  // Center the rendered page in the canvas
  const offsetX = (width - scaledViewport.width) / 2;
  const offsetY = (height - scaledViewport.height) / 2;
  
  // Render page
  await page.render({ 
    canvasContext: context, 
    viewport: scaledViewport,
    transform: offsetX || offsetY ? [1, 0, 0, 1, offsetX, offsetY] : undefined
  }).promise;
  
  // Clean up
  page.cleanup();
  
  // Get data URL with higher quality
  return canvas.toDataURL('image/jpeg', 0.92);
}
