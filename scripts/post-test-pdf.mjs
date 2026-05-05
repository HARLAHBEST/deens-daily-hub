import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function makePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText('Invoice Test PDF via POST', { x: 50, y: 350, size: 24 });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

(async () => {
  const pdfBuffer = await makePdf();
  const res = await fetch('http://localhost:3000/api/test-parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/pdf' },
    body: pdfBuffer
  });
  const json = await res.json();
  console.log('response status', res.status);
  console.log(JSON.stringify(json, null, 2));
})();
