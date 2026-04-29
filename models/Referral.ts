import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferralCustomer extends Document {
  name: string;
  contact: string;
  code: string;
  referrals: number;
  giftsEarned: number;
  giftsClaimed: number;
  joined: string;
}

const ReferralCustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  referrals: { type: Number, default: 0 },
  giftsEarned: { type: Number, default: 0 },
  giftsClaimed: { type: Number, default: 0 },
  joined: { type: String, required: true }
}, {
  timestamps: true,
});

export const ReferralCustomerModel: Model<IReferralCustomer> = mongoose.models.ReferralCustomer || mongoose.model<IReferralCustomer>('ReferralCustomer', ReferralCustomerSchema);

export interface IReferralLog extends Document {
  code: string;
  type: string;
  date: string;
  note: string;
}

const ReferralLogSchema: Schema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: String, required: true },
  note: { type: String, default: "" }
}, {
  timestamps: true,
});

export const ReferralLogModel: Model<IReferralLog> = mongoose.models.ReferralLog || mongoose.model<IReferralLog>('ReferralLog', ReferralLogSchema);
