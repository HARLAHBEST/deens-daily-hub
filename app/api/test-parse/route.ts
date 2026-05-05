import { NextResponse } from 'next/server';
import { extractInvoiceFromPDF } from '@/lib/pdf-parser';

export async function POST(request: Request) {
  try {
    const buf = new Uint8Array(await request.arrayBuffer());
    const result = await extractInvoiceFromPDF(Buffer.from(buf));
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('API parse error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
