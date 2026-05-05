import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function makePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText('Invoice Test PDF', { x: 50, y: 350, size: 24 });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

(async () => {
  try {
    const pdfBuffer = await makePdf();
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    console.log('Imported pdfjs ok');
    // attempt server-side parsing similar to app
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(pdfBuffer), disableWorker: true });
    const pdf = await loadingTask.promise;
    console.log('numPages:', pdf.numPages);
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    console.log('text items count:', textContent.items.length);
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  }
})();