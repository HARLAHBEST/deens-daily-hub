import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISale extends Document {
  id: number;
  uid: string;
  lot: string;
  invoiceId: string;
  description: string;
  category: string;
  cost: number;
  sellingPrice: number;
  profit: number;
  margin: number;
  date: string;
  platform: string;
  notes: string;
}

const SaleSchema: Schema = new Schema({
  id: { type: Number, required: true },
  uid: { type: String, required: true },
  lot: { type: String, required: true },
  invoiceId: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  cost: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  profit: { type: Number, required: true },
  margin: { type: Number, required: true },
  date: { type: String, required: true },
  platform: { type: String, required: true },
  notes: { type: String, default: "" }
}, {
  timestamps: true,
});

export const SaleModel: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
