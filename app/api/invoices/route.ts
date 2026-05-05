import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import dbConnect from '@/lib/mongodb';
import { InvoiceModel } from '@/models/Invoice';
import { ItemModel } from '@/models/Item';
import { extractInvoiceFromPDF } from '@/lib/pdf-parser';

async function processInvoiceBackground(invoiceId: string, pdfBuffer: Buffer) {
  try {
    const parsed = await extractInvoiceFromPDF(pdfBuffer);
    const processingStatus = parsed.invoiceId
      ? `Extraction complete (${parsed.invoiceId})`
      : 'Extraction complete';

    await InvoiceModel.findOneAndUpdate(
      { invoiceId },
      {
        total: parsed.total,
        date: parsed.date,
        itemCount: parsed.itemCount,
        parsedItems: parsed.items,
        processingStatus,
        status: 'ready',
        errorMessage: undefined,
      },
      { returnDocument: 'after' }
    );
    // Create inventory items from parsed invoice lines if any
    try {
      if (Array.isArray(parsed.items) && parsed.items.length > 0) {
        const createOps = parsed.items.map((it: any, idx: number) => {
          const uid = `${invoiceId}-${idx}-${Date.now().toString(36)}`;
          return {
            uid,
            lot: invoiceId,
            invoiceId,
            date: parsed.date,
            invoiceTotal: parsed.total || 0,
            description: it.description || 'Item',
            bidPrice: it.unitPrice || 0,
            cost: it.unitPrice || 0,
            category: 'Other',
            image: undefined,
            status: 'In Stock',
            platform: undefined,
          };
        });

        // Insert many but ignore duplicates/errors per-item
        await ItemModel.insertMany(createOps, { ordered: false }).catch((e) => {
          // Log but don't fail the invoice processing because of item insert errors
          console.error('Failed to insert some invoice items to inventory:', e && e.message ? e.message : e);
        });
      }
    } catch (e) {
      console.error('Error creating inventory items from invoice:', e);
    }
  } catch (error) {
    console.error(`Invoice background processing failed for ${invoiceId}:`, error);
    await InvoiceModel.findOneAndUpdate(
      { invoiceId },
      {
        status: 'error',
        processingStatus: 'Extraction failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown extraction error',
      },
      { returnDocument: 'after' }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const params = new URL(request.url).searchParams;
    const limit = Math.min(Number(params.get('limit') || 200), 1000);
    const projection = { invoiceId: 1, date: 1, total: 1, itemCount: 1, source: 1, status: 1, processingStatus: 1, parsedItems: 1 };
    const invoices = await InvoiceModel.find({}).sort({ date: -1 }).limit(limit).select(projection).lean();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdfFile');
    const invoiceIdEntry = formData.get('invoiceId');
    const sourceEntry = formData.get('source');

    if (!pdfFile || typeof (pdfFile as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'A PDF file is required' }, { status: 400 });
    }

    const invoiceIdValue = typeof invoiceIdEntry === 'string' ? invoiceIdEntry.trim() : '';
    const source = typeof sourceEntry === 'string' && sourceEntry ? sourceEntry : 'manual';
    const rawPdfName = (pdfFile as File).name || 'invoice.pdf';
    const pdfBuffer = Buffer.from(await (pdfFile as File).arrayBuffer());
    const fileHash = createHash('sha256').update(pdfBuffer).digest('hex');

    const duplicateFilter = invoiceIdValue
      ? { $or: [{ invoiceId: invoiceIdValue }, { fileHash }] }
      : { fileHash };

    const existingInvoice = await InvoiceModel.findOne(duplicateFilter);
    if (existingInvoice) {
      return NextResponse.json(
        {
          error: 'Duplicate invoice detected',
          invoiceId: existingInvoice.invoiceId,
          message: 'Either the same invoice ID or the same file was already uploaded.',
        },
        { status: 409 }
      );
    }

    const invoiceId = invoiceIdValue || `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const invoice = await InvoiceModel.create({
      invoiceId,
      date: new Date().toISOString().split('T')[0],
      total: 0,
      itemCount: 0,
      source,
      rawPdfName,
      fileHash,
      status: 'processing',
      processingStatus: 'Upload received, waiting for extraction',
      parsedItems: [],
    });

    void processInvoiceBackground(invoice.invoiceId, pdfBuffer);

    return NextResponse.json(
      {
        message: 'Invoice upload accepted',
        invoiceId: invoice.invoiceId,
        status: 'processing',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('POST /api/invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to upload invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const invoiceId = url.searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId query parameter is required' }, { status: 400 });
    }

    await dbConnect();
    const result = await InvoiceModel.findOneAndDelete({ invoiceId });

    if (!result) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully', invoiceId }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
