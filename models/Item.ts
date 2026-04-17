import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  uid: string;
  lot: string;
  inv: string;
  date: string;
  itotal: number;
  desc: string;
  bid: number;
  cost: number;
  cat: string;
  image?: string;
  status?: string;
}

const ItemSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  lot: { type: String, required: true },
  inv: { type: String, required: true },
  date: { type: String, required: true },
  itotal: { type: Number, required: true },
  desc: { type: String, required: true },
  bid: { type: Number, required: true },
  cost: { type: Number, required: true },
  cat: { type: String, required: true },
  image: { type: String }, // Cloudinary Image URL
  status: { type: String, default: 'In Stock' }
}, {
  timestamps: true,
});

export const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
