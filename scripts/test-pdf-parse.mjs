import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function makePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText('Invoice Test PDF for pdf-parse', { x: 50, y: 350, size: 24 });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

(async () => {
  try {
    const pdfBuffer = await makePdf();
    // write to disk for inspection
    fs.writeFileSync('tmp-test.pdf', pdfBuffer);
    // dynamic import of pdf-parse
    // @ts-ignore
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const data = await pdfParse(pdfBuffer);
    console.log('pdf-parse success: pages', data.numpages, 'text len', (data.text||'').length);
  } catch (err) {
    console.error('pdf-parse test error:', err);
    process.exit(1);
  }
})();