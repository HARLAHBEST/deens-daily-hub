// ============================================================
// DEENS DAILY HUB — Standard Data Models
// These represent the unified schema used across MongoDB & Frontend
// ============================================================

export type Category = 
  | 'Clothing' 
  | 'Home & Kitchen' 
  | 'Health & Beauty' 
  | 'Electronics' 
  | 'Baby & Kids' 
  | 'Tools' 
  | 'Other';
export const CATEGORIES: Category[] = [
  'Clothing', 'Home & Kitchen', 'Health & Beauty', 'Electronics', 'Baby & Kids', 'Tools', 'Other'
];
export interface Item {
  _id?: string;
  uid: string;
  lot: string;
  invoiceId: string;
  date: string;
  invoiceTotal: number;
  description: string;
  bidPrice: number;
  cost: number;
  category: Category;
  image?: string;
  status?: string;
  soldPrice?: number;
  soldDate?: string;
  platform?: string;
}

export interface Sale {
  _id?: string;
  uid: string;
  date: string;
  lot: string;
  description: string;
  category?: Category;
  invoiceId: string;
  bidPrice: number;
  sellingPrice: number;
  profit: number;
  margin?: number;
  platform: string;
  notes?: string;
}

export interface Expense {
  _id?: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  notes: string;
}

export interface ReferralLog {
  _id?: string;
  code: string;
  type: 'joined' | 'referral' | 'gift_earned' | 'gift_claimed';
  date: string;
  note: string;
}

export interface ReferralCustomer {
  _id?: string;
  name: string;
  contact: string;
  code: string;
  referrals: number;
  giftsEarned: number;
  giftsClaimed: number;
  joined: string;
}

export interface ReferralData {
  customers: ReferralCustomer[];
  log: ReferralLog[];
}

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  _id?: string;
  invoiceId: string;
  date: string;
  total: number;
  itemCount: number;
  source: string;
  status: 'processing' | 'ready' | 'error';
  processingStatus: string;
  rawPdfName?: string;
  parsedItems: InvoiceItem[];
  errorMessage?: string;
}
