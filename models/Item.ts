import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  uid: string;
  lot: string;
  invoiceId: string;
  date: string;
  invoiceTotal: number;
  description: string;
  bidPrice: number;
  cost: number;
  category: string;
  image?: string;
  status?: string;
  soldPrice?: number;
  soldDate?: string;
  platform?: string;
}

const ItemSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  lot: { type: String, required: true },
  invoiceId: { type: String, required: true },
  date: { type: String, required: true },
  invoiceTotal: { type: Number, required: true },
  description: { type: String, required: true },
  bidPrice: { type: Number, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // Cloudinary Image URL
  status: { type: String, default: 'In Stock' },
  soldPrice: { type: Number },
  soldDate: { type: String },
  platform: { type: String }
}, {
  timestamps: true,
});

export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
