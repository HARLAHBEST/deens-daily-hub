import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  notes: string;
}

const ExpenseSchema: Schema = new Schema({
  id: { type: Number, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  notes: { type: String, default: "" }
}, {
  timestamps: true,
});

export const ExpenseModel: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
