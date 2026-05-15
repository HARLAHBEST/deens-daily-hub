import fs from 'fs';
import path from 'path';
import { extractInvoiceFromPDF } from '../lib/pdf-parser';

async function testExtraction() {
  const pdfPath = path.join(process.cwd(), 'Invoice-4-KW2H4V-4-HPU5Z2.pdf');
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`);
    return;
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  console.log(`Parsing ${pdfPath}...`);

  try {
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const data = await pdfParse(pdfBuffer);
    console.log('--- Raw Text ---');
    console.log(data.text);
    console.log('--- End Raw Text ---');
    
    const result = await extractInvoiceFromPDF(pdfBuffer);

    console.log('--- Extraction Results ---');
    console.log(`Invoice ID: ${result.invoiceId}`);
    console.log(`Date: ${result.date}`);
    console.log(`Total: ${result.total}`);
    console.log(`Item Count: ${result.itemCount}`);
    console.log('--- Items ---');
    result.items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`);
      console.log(`  Name: ${item.name}`);
      console.log(`  Description: ${item.description}`);
      console.log(`  Qty: ${item.qty}`);
      console.log(`  Unit Price: ${item.unitPrice}`);
      console.log(`  Line Total: ${item.lineTotal}`);
      if (item.tax) console.log(`  Tax: ${item.tax}`);
    });
  } catch (error) {
    console.error('Error during extraction:', error);
  }
}

testExtraction();
