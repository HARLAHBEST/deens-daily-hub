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
  quantity: number;
  unit?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  platform: { type: String },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'pcs' }
}, {
  timestamps: true,
});

// Indexes to improve read performance and support text search
ItemSchema.index({ uid: 1 }, { unique: true });
ItemSchema.index({ invoiceId: 1 });
ItemSchema.index({ status: 1 });
ItemSchema.index({ createdAt: -1 });
ItemSchema.index({ description: 'text', category: 'text' });

export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
