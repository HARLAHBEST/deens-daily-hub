export interface ExtractedInvoiceData {
  invoiceId: string;
  date: string;
  total: number;
  itemCount: number;
  items: Array<{
    name?: string;
    description: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

/**
 * Parse a PDF buffer and extract invoice data
 */
export async function extractInvoiceFromPDF(pdfBuffer: Buffer): Promise<ExtractedInvoiceData> {
  try {
    // Use pdf-parse for Node.js server-side parsing (avoids DOMMatrix/worker issues)
    // @ts-ignore
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const data = await pdfParse(pdfBuffer);
    const text = data.text || '';

    // If no text extracted, return defaults
    if (!text.trim()) {
      return {
        invoiceId: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        total: 0,
        itemCount: 0,
        items: []
      };
    }

    // Basic extraction logic - customize based on your PDF format
    const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l);

    let invoiceId = '';
    let invoiceDate = '';
    let invoiceTotal = 0;
    const items: ExtractedInvoiceData['items'] = [];

    // Simple heuristic: look for patterns like "Invoice #" or "Invoice ID"
    for (const line of lines) {
      if (line.toLowerCase().includes('invoice') && (line.includes('#') || line.includes('id'))) {
        const match = line.match(/[A-Z0-9\-]+/);
        if (match) invoiceId = match[0];
      }
      
      if (line.toLowerCase().includes('date') || line.toLowerCase().includes('date:')) {
        const dateMatch = line.match(/\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/);
        if (dateMatch) invoiceDate = dateMatch[0];
      }

      if (line.toLowerCase().includes('total') && line.match(/\d+\.\d{2}/)) {
        const totalMatch = line.match(/\d+\.\d{2}$/);
        if (totalMatch) invoiceTotal = parseFloat(totalMatch[0]);
      }
    }

    // Extract items - look for lines with quantity, description, price patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const qtyMatch = line.match(/^(\d+)\s+/);
      if (qtyMatch) {
        const qty = parseInt(qtyMatch[1]);
        const remainingLine = line.substring(qtyMatch[0].length);
        const priceMatch = remainingLine.match(/(\d+\.\d{2})$/);
        
        if (priceMatch) {
          const lineTotal = parseFloat(priceMatch[1]);
          const rawDesc = remainingLine.substring(0, remainingLine.lastIndexOf(priceMatch[1])).trim();

          // Split rawDesc into name and description when possible using common delimiters
          let name: string | undefined = undefined;
          let description = rawDesc;
          const delimMatch = rawDesc.match(/\s[-–—:]\s/);
          if (delimMatch) {
            const parts = rawDesc.split(/\s[-–—:]\s/);
            name = parts[0].trim();
            description = parts.slice(1).join(' - ').trim();
          } else if (rawDesc.includes(',')) {
            const parts = rawDesc.split(',');
            name = parts[0].trim();
            description = parts.slice(1).join(',').trim();
          }

          // Try to find unit price (lineTotal / qty)
          const unitPrice = qty > 0 ? lineTotal / qty : lineTotal;

          items.push({
            name,
            description,
            qty,
            unitPrice: parseFloat(unitPrice.toFixed(2)),
            lineTotal
          });
        }
      }
    }
    // If we couldn't extract any items or text, try pdftotext CLI fallback
    if (items.length === 0) {
      try {
        const { spawnSync } = await import('child_process');
        const proc = spawnSync('pdftotext', ['-layout', '-', '-'], { input: pdfBuffer, maxBuffer: 10 * 1024 * 1024 });
        if (!proc.error && proc.stdout) {
          const cliText = proc.stdout.toString('utf8');
          if (cliText && cliText.trim()) {
            const cliLines = cliText.split('\n').map((l: string) => l.trim()).filter((l: string) => l);
            // re-run extraction on CLI text
            for (const line of cliLines) {
              if (line.toLowerCase().includes('invoice') && (line.includes('#') || line.includes('id'))) {
                const match = line.match(/[A-Z0-9\-]+/);
                if (match) invoiceId = match[0];
              }
              if (line.toLowerCase().includes('date') || line.toLowerCase().includes('date:')) {
                const dateMatch = line.match(/\d{1,4}[-\/]\d{1,2}[-\/]\d{1,4}/);
                if (dateMatch) invoiceDate = dateMatch[0];
              }
              if (line.toLowerCase().includes('total') && line.match(/\d+\.\d{2}/)) {
                const totalMatch = line.match(/\d+\.\d{2}$/);
                if (totalMatch) invoiceTotal = parseFloat(totalMatch[0]);
              }
            }
            // attempt to find items in cliLines
            for (let i = 0; i < cliLines.length; i++) {
              const line = cliLines[i];
              const qtyMatch = line.match(/^(\d+)\s+/);
              if (qtyMatch) {
                const qty = parseInt(qtyMatch[1]);
                const remainingLine = line.substring(qtyMatch[0].length);
                const priceMatch = remainingLine.match(/(\d+\.\d{2})$/);
                if (priceMatch) {
                  const lineTotal = parseFloat(priceMatch[1]);
                  const rawDesc = remainingLine.substring(0, remainingLine.lastIndexOf(priceMatch[1])).trim();
                  let name: string | undefined = undefined;
                  let description = rawDesc;
                  const delimMatch = rawDesc.match(/\s[-–—:]\s/);
                  if (delimMatch) {
                    const parts = rawDesc.split(/\s[-–—:]\s/);
                    name = parts[0].trim();
                    description = parts.slice(1).join(' - ').trim();
                  } else if (rawDesc.includes(',')) {
                    const parts = rawDesc.split(',');
                    name = parts[0].trim();
                    description = parts.slice(1).join(',').trim();
                  }
                  const unitPrice = qty > 0 ? lineTotal / qty : lineTotal;
                  items.push({ name, description, qty, unitPrice: parseFloat(unitPrice.toFixed(2)), lineTotal });
                }
              }
            }
          }
        }
      } catch (cliErr) {
        console.warn('pdftotext CLI fallback failed:', cliErr);
      }
    }

    // Fallback: generate defaults if not parsed
    if (!invoiceId) invoiceId = `INV-${Date.now()}`;
    if (!invoiceDate) invoiceDate = new Date().toISOString().split('T')[0];
    if (invoiceTotal === 0) invoiceTotal = 0;

    return {
      invoiceId,
      date: invoiceDate,
      total: invoiceTotal,
      itemCount: items.length,
      items
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error parsing PDF:', errorMessage);
    console.error('Full error details:', error);
    throw new Error(`Failed to parse PDF: ${errorMessage}`);
  }
}
