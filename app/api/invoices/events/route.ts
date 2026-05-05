import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { InvoiceModel } from '@/models/Invoice';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const invoiceId = url.searchParams.get('invoiceId');

  if (!invoiceId) {
    return NextResponse.json({ error: 'invoiceId query parameter is required' }, { status: 400 });
  }

  await dbConnect();
  const invoice = await InvoiceModel.findOne({ invoiceId });

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let lastSent = '';
      let isClosed = false;
      let interval: NodeJS.Timeout | null = null;

      const closeStream = () => {
        if (!isClosed) {
          isClosed = true;
          try {
            controller.close();
          } catch (err) {
            // Ignore if already closed
          }
        }

        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };

      const safeEnqueue = (data: Uint8Array) => {
        try {
          controller.enqueue(data);
        } catch (err: any) {
          if (err && err.code === 'ERR_INVALID_STATE') {
            closeStream();
            return false;
          }
          throw err;
        }
        return true;
      };

      const sendEvent = (data: Record<string, unknown>) => {
        if (isClosed) return;
        try {
          const payload = `event: status\ndata: ${JSON.stringify(data)}\n\n`;
          const ok = safeEnqueue(encoder.encode(payload));
          if (!ok) return;
        } catch (err) {
          // Controller may be closed
          closeStream();
        }
      };

      const sendStatus = async () => {
        if (isClosed) return;

        const current = await InvoiceModel.findOne({ invoiceId });
        if (!current) {
          sendEvent({ status: 'error', processingStatus: 'Invoice disappeared', errorMessage: 'Invoice not found' });
          closeStream();
          return;
        }

        const payload = {
          status: current.status,
          processingStatus: current.processingStatus,
          errorMessage: current.errorMessage || null,
          invoiceId: current.invoiceId,
        };

        const encoded = JSON.stringify(payload);
        if (encoded !== lastSent) {
          lastSent = encoded;
          sendEvent(payload);
        }

        if (current.status !== 'processing') {
          // Close the connection after extraction completed (or error)
          closeStream();
        }
      };

      interval = setInterval(() => {
        sendStatus().catch((err) => {
          console.error('SSE invoice status error:', err);
          closeStream();
        });
      }, 1000);

      req.signal.addEventListener('abort', () => {
        closeStream();
      });

      await sendStatus();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
