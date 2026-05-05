import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { InvoiceModel } from '@/models/Invoice';

export async function GET(req: Request) {
  await dbConnect();
  
  const encoder = new TextEncoder();
  let isStreamClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      let interval: NodeJS.Timeout | null = null;

      const closeStream = () => {
        if (!isStreamClosed) {
          isStreamClosed = true;
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
          // If the controller is already closed or in an invalid state, close stream and stop
          if (err && err.code === 'ERR_INVALID_STATE') {
            closeStream();
            return false;
          }
          throw err;
        }
        return true;
      };

      const sendInvoiceList = async () => {
        if (isStreamClosed) return;

        try {
          const invoices = await InvoiceModel.find({}).sort({ date: -1 });
          const payload = `data: ${JSON.stringify(invoices)}\n\n`;
          const encoded = encoder.encode(payload);
          const ok = safeEnqueue(encoded);
          if (!ok) return;
        } catch (err) {
          console.error('SSE invoice list error:', err);
          closeStream();
        }
      };

      // Send initial list
      await sendInvoiceList();

      // Poll for changes every 3 seconds
      interval = setInterval(() => {
        sendInvoiceList().catch((err) => {
          console.error('SSE invoice list error:', err);
          closeStream();
        });
      }, 3000);

      // Cleanup on client disconnect
      req.signal.addEventListener('abort', () => {
        closeStream();
      });
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
