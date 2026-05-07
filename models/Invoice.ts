import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoiceItem {
  name?: string;
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IInvoice extends Document {
  invoiceId: string;
  date: string;
  total: number;
  itemCount: number;
  source: string;
  status: 'processing' | 'ready' | 'error';
  processingStatus: string;
  rawPdfName?: string;
  fileHash: string;
  parsedItems: IInvoiceItem[];
  errorMessage?: string;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  name: { type: String },
  description: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  lineTotal: { type: Number, required: true, default: 0 }
}, { _id: false });

const InvoiceSchema = new Schema<IInvoice>({
  invoiceId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  total: { type: Number, required: true },
  itemCount: { type: Number, required: true },
  source: { type: String, required: true },
  status: { type: String, enum: ['processing', 'ready', 'error'], default: 'processing' },
  processingStatus: { type: String, required: true, default: 'Pending extraction' },
  rawPdfName: { type: String },
  fileHash: { type: String, required: true, unique: true },
  parsedItems: { type: [InvoiceItemSchema], default: [] },
  errorMessage: { type: String }
}, {
  timestamps: true,
});

// Indexes for faster queries
InvoiceSchema.index({ invoiceId: 1 }, { unique: true });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ date: -1 });

export const InvoiceModel: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
