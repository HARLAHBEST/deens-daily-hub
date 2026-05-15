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
    tax?: string;
  }>;
}

/**
 * Parse a PDF buffer and extract invoice data
 */
export async function extractInvoiceFromPDF(pdfBuffer: Buffer): Promise<ExtractedInvoiceData> {
  try {
    // Use pdf-parse for Node.js server-side parsing (avoids DOMMatrix/worker issues)
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

    // Basic extraction logic - customize based on your PDF format
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Handle "INVOICE4-KW2H4V-4-HPU5Z2" or "INVOICE: 123"
      if (lowerLine.includes('invoice')) {
        // Try to capture everything after "INVOICE" (ignoring common symbols)
        const idMatch = line.match(/invoice[:\s#]*([A-Z0-9\-]+)/i);
        if (idMatch && idMatch[1]) {
          invoiceId = idMatch[1];
        } else if (line.length > 8) {
           // Fallback: if line starts with INVOICE followed by alphanumeric
           const fallbackMatch = line.match(/^invoice\s*([A-Z0-9\-]+)/i);
           if (fallbackMatch) invoiceId = fallbackMatch[1];
        }
      }
      
      if (lowerLine.includes('date')) {
        // Match 05.01.2026 or 2026-05-01 or 05/01/2026
        const dateMatch = line.match(/\d{1,4}[-\/\.]\d{1,2}[-\/\.]\d{1,4}/);
        if (dateMatch) {
          // Normalize dots to dashes for consistency
          invoiceDate = dateMatch[0].replace(/\./g, '-').replace(/\//g, '-');
        }
      }

      if (lowerLine.includes('total') && line.match(/\d+\.\d{2}/)) {
        const totalMatch = line.match(/[\d,]+\.\d{2}/);
        if (totalMatch) invoiceTotal = parseFloat(totalMatch[0].replace(/,/g, ''));
      }
    }

    // Extract items - look for lines with quantity, description, price patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Pattern 3: Mega Savers format (e.g., "... GST/PST SK10.250.25")
      // matches: [Description] GST/PST SK [SmashedNumbers]
      const megaMatch = line.match(/(.*?)(GST\/PST\s+SK)([\d\.,]+)$/i);
      if (megaMatch) {
        let rawDesc = megaMatch[1].trim();
        const tax = megaMatch[2].trim();
        const smashed = megaMatch[3].trim();

        // Parse smashed numbers: Qty, Rate, Amount
        const dots: number[] = [];
        for (let idx = 0; idx < smashed.length; idx++) {
          if (smashed[idx] === '.') dots.push(idx);
        }

        let qty = 0;
        let unitPrice = 0;
        let lineTotal = 0;

        if (dots.length >= 2) {
          const lastDotIdx = dots[dots.length - 1];
          const secondLastDotIdx = dots[dots.length - 2];

          const amountStr = smashed.substring(lastDotIdx - 1);
          const rateStr = smashed.substring(secondLastDotIdx - 1, lastDotIdx - 1);
          const qtyStr = smashed.substring(0, secondLastDotIdx - 1);

          qty = parseFloat(qtyStr) || 1;
          unitPrice = parseFloat(rateStr.replace(/,/g, '')) || 0;
          lineTotal = parseFloat(amountStr.replace(/,/g, '')) || 0;
        } else {
          // Fallback if not smashed or unexpected format
          const nums = smashed.match(/[\d,]+\.\d{2}/g);
          if (nums && nums.length >= 2) {
            unitPrice = parseFloat(nums[0].replace(/,/g, ''));
            lineTotal = parseFloat(nums[nums.length - 1].replace(/,/g, ''));
            qty = Math.round(lineTotal / unitPrice) || 1;
          }
        }

        let description = rawDesc;
        // Look back for multi-line description if current line's desc is short or empty
        let j = i - 1;
        while (j >= 0 && !lines[j].match(/GST\/PST|TOTAL|INVOICE|DATE|BILL TO|DESCRIPTION/i) && lines[j].length > 2) {
          description = lines[j] + ' ' + description;
          j--;
        }
        description = description.trim();

        // Try to extract a clean name from description
        let name = description;
        // Check for leading SKU (e.g., "1226-", "1905-")
        const skuMatch = description.match(/^(\d+)\s*[-–—]\s*(.*)$/);
        if (skuMatch) {
          name = skuMatch[2].trim();
        } else if (description.includes('-')) {
          const parts = description.split('-');
          if (parts[0].trim().match(/^\d+$/) && parts.length > 1) {
            name = description.substring(description.indexOf('-') + 1).trim();
          }
        }

        if (qty > 0 || lineTotal > 0) {
          items.push({ 
            name,
            description, 
            qty, 
            unitPrice, 
            lineTotal,
            tax
          });
        }
        continue;
      }

      // Pattern 1: [Qty] [Description...] [Price]
      const pattern1 = line.match(/^(\d+)\s+(.+?)\s+([\d,]+\.\d{2})$/);
      if (pattern1) {
        const qty = parseInt(pattern1[1]);
        const description = pattern1[2].trim();
        const lineTotal = parseFloat(pattern1[3].replace(/,/g, ''));
        const unitPrice = qty > 0 ? parseFloat((lineTotal / qty).toFixed(2)) : lineTotal;
        
        let name = '';
        if (description.includes('-')) {
          name = description.split('-')[0].trim();
        } else {
          name = description.split(' ').slice(0, 3).join(' ');
        }

        items.push({ 
          name,
          description, 
          qty, 
          unitPrice, 
          lineTotal 
        });
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
              const lowerLine = line.toLowerCase();
              if (lowerLine.includes('invoice')) {
                const idMatch = line.match(/invoice[:\s#]*([A-Z0-9\-]+)/i);
                if (idMatch && idMatch[1]) invoiceId = idMatch[1];
              }
              if (lowerLine.includes('date')) {
                const dateMatch = line.match(/\d{1,4}[-\/\.]\d{1,2}[-\/\.]\d{1,4}/);
                if (dateMatch) invoiceDate = dateMatch[0].replace(/\./g, '-').replace(/\//g, '-');
              }
              if (lowerLine.includes('total') && line.match(/\d+\.\d{2}/)) {
                const totalMatch = line.match(/[\d,]+\.\d{2}/);
                if (totalMatch) invoiceTotal = parseFloat(totalMatch[0].replace(/,/g, ''));
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
                    if (parts[0].trim().match(/^\d+$/) && parts.length > 1) {
                      name = parts.slice(1).join(' - ').trim();
                    } else {
                      name = parts[0].trim();
                    }
                  } else {
                    name = rawDesc;
                  }
                  description = rawDesc;
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
