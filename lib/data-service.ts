import rawData from './raw-data.json';

export type Category = 
  | 'Clothing' 
  | 'Home & Kitchen' 
  | 'Health & Beauty' 
  | 'Electronics' 
  | 'Baby & Kids' 
  | 'Tools' 
  | 'Other';

export interface RawInvoice {
  id: string;
  date: string;
  total: number;
  items: [string, string, number, number, Category][];
}

export interface Item {
  uid: string;
  lot: string;
  inv: string;
  date: string;
  itotal: number;
  desc: string;
  bid: number;
  cost: number;
  cat: Category;
  image?: string;
}

export interface Sale {
  id: number;
  uid: string;
  lot: string;
  inv: string;
  desc: string;
  cat: Category;
  cost: number;
  sp: number;
  profit: number;
  margin: number;
  date: string;
  plat: string;
  notes: string;
}

export interface Expense {
  id: number;
  desc: string;
  amount: number;
  date: string;
  cat: string;
  pay: string;
  notes: string;
}

export interface ItemStatus {
  st: 'In Stock' | 'Sold' | 'Past Sold' | 'Lost' | 'Damaged' | 'Personal Use';
  price?: number;
}

export type StatusMap = Record<string, ItemStatus>;

export interface ReferralLog {
  code: string;
  type: 'joined' | 'referral' | 'gift_earned' | 'gift_claimed';
  date: string;
  note: string;
}

export interface ReferralCustomer {
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

// Constants for localStorage keys
const KEYS = {
  SALES: 'ddh9_sales',
  STATUS: 'ddh9_status',
  EXPENSES: 'ddh9_expenses',
  EXTRA: 'ddh9_extra',
  REFERRALS: 'ddh_referrals',
  CUSTOM_ITEMS: 'ddh9_custom_items'
};

/**
 * Process the static RAW data into a flat list of items
 */
export function getBaseItems(): Item[] {
  const items: Item[] = [];
  (rawData as any[][]).forEach((inv) => {
    const invId = inv[0];
    const invDate = inv[1];
    const invTotal = inv[2];
    const invItems = inv[3] as [string, string, number, number, Category][];

    invItems.forEach((it) => {
      items.push({
        uid: `${invId}|${it[0]}`,
        lot: it[0],
        inv: invId,
        date: invDate,
        itotal: invTotal,
        desc: it[1],
        bid: it[2],
        cost: it[3],
        cat: it[4]
      });
    });
  });
  
  const customItems = getCustomItems();
  return [...customItems, ...items];
}

/**
 * Storage helpers
 */
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set: (key: string, val: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(val));
    }
  }
};

export function getSales(): Sale[] {
  return storage.get(KEYS.SALES, []);
}

export function getCustomItems(): Item[] {
  return storage.get(KEYS.CUSTOM_ITEMS, []);
}

export function saveCustomItems(items: Item[]) {
  storage.set(KEYS.CUSTOM_ITEMS, items);
}

export function getStatuses(): StatusMap {
  return storage.get(KEYS.STATUS, {});
}

export function getExpenses(): Expense[] {
  return storage.get(KEYS.EXPENSES, []);
}

export function getReferrals(): ReferralData {
  return storage.get(KEYS.REFERRALS, { customers: [], log: [] });
}

export function saveReferrals(data: ReferralData) {
  storage.set(KEYS.REFERRALS, data);
}

export function saveSales(sales: Sale[]) {
  storage.set(KEYS.SALES, sales);
}

export function saveStatuses(statuses: StatusMap) {
  storage.set(KEYS.STATUS, statuses);
}

export function saveExpenses(expenses: Expense[]) {
  storage.set(KEYS.EXPENSES, expenses);
}
