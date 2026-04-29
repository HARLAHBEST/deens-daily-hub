import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true },
  date: { type: String, required: true },
  total: { type: Number, required: true },
  itemCount: { type: Number, required: true },
  source: { type: String, default: "mega_savers" }
}, { timestamps: true });

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

export async function GET() {
  await dbConnect();
  try {
    const invoices = await InvoiceModel.find({}).sort({ date: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
