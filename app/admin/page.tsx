'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { 
  ShoppingBag, 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  Package,
  RotateCcw,
  Users
} from 'lucide-react';
import { 
  getBaseItems, 
  getSales, 
  getExpenses, 
  getStatuses, 
  getReferrals 
} from '@/lib/data-service';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalSold: 0,
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
    stockCount: 0
  });

  const [referralStats, setReferralStats] = useState({ 
    customers: 0, 
    totalRef: 0, 
    pendingGifts: 0 
  });

  useEffect(() => {
    const items = getBaseItems();
    const sales = getSales();
    const expenses = getExpenses();
    const statuses = getStatuses();
    const referrals = getReferrals();

    let rev = 0;
    let cost = 0;
    sales.forEach(s => {
      rev += s.sp;
      cost += s.cost;
    });

    items.forEach(it => {
      const st = statuses[it.uid];
      if (st?.st === 'Past Sold' && st.price) {
        rev += st.price;
        cost += it.cost;
      }
    });

    let totalExp = 0;
    expenses.forEach(e => totalExp += e.amount);

    const gp = rev - cost;
    const np = gp - totalExp;

    const inStock = items.filter(it => {
      const s = statuses[it.uid];
      return !s || s.st === 'In Stock';
    }).length;

    setData({
      totalSold: sales.length,
      revenue: rev,
      cogs: cost,
      grossProfit: gp,
      expenses: totalExp,
      netProfit: np,
      stockCount: inStock
    });

    setReferralStats({
      customers: referrals.customers.length,
      totalRef: referrals.customers.reduce((sum, c) => sum + c.referrals, 0),
      pendingGifts: referrals.customers.reduce((sum, c) => sum + (c.giftsEarned - c.giftsClaimed), 0)
    });
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3">
             <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
             <span className="text-[9px] font-black text-gold uppercase tracking-[2px]">System Status: Online</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-navy dark:text-white font-display uppercase leading-none italic">
            Command Center
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-2 font-bold text-sm uppercase tracking-wider">
            Operational Intelligence Overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Gross Revenue" 
          value={formatCurrency(data.revenue)} 
          subValue="Life-time intake"
          icon={<DollarSign size={20} />}
          color="gold"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard 
          label="Retained Profit" 
          value={formatCurrency(data.grossProfit)} 
          subValue={`${((data.grossProfit / (data.revenue || 1)) * 100).toFixed(1)}% margin`}
          icon={<TrendingUp size={20} />}
          color="navy"
        />
        <StatsCard 
          label="Op Expenses" 
          value={formatCurrency(data.expenses)} 
          subValue="Life-time overhead"
          icon={<CreditCard size={20} />}
          color="rose"
        />
        <StatsCard 
          label="Net Performance" 
          value={formatCurrency(data.netProfit)} 
          subValue="Final liquid state"
          icon={<ShoppingBag size={20} />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-all"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h2 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">Inventory Logistics</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mt-1">Real-time distribution analytics</p>
            </div>
            <Link href="/admin/stock" className="p-3 bg-navy dark:bg-white/5 rounded-2xl text-gold hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95">
              <Package size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
            <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/stat hover:border-gold/50 transition-all">
              <div className="text-3xl font-black text-navy dark:text-white font-display mb-1">{data.stockCount}</div>
              <div className="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[2px] font-black">Active Units</div>
            </div>
            <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/stat hover:border-gold/50 transition-all">
              <div className="text-3xl font-black text-navy dark:text-white font-display mb-1">{data.totalSold}</div>
              <div className="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[2px] font-black">Closed Sales</div>
            </div>
            <div className="p-6 rounded-[32px] bg-gold/10 border border-gold/20 group/stat">
              <div className="text-3xl font-black text-gold font-display mb-1">
                {((data.totalSold / (data.stockCount + data.totalSold || 1)) * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-gold uppercase tracking-[2px] font-black">Sell-Through</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">Promoters</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mt-1">Loyalty Hub Overview</p>
            </div>
            <Link href="/admin/referrals" className="p-3 bg-navy dark:bg-white/5 rounded-2xl text-gold hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95">
              <Users size={20} />
            </Link>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Promoters</span>
              <span className="text-xl font-black text-navy dark:text-white font-display">{referralStats.customers}</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Referrals</span>
              <span className="text-xl font-black text-navy dark:text-white font-display">{referralStats.totalRef}</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-gold/10 rounded-3xl border border-gold/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-gold italic">Rewards Due</span>
              <span className="text-2xl font-black text-gold font-display animate-pulse">{referralStats.pendingGifts}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl flex items-center justify-between">
          <div className="relative z-10 max-w-sm">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-gold group-hover:rotate-12 transition-transform">
               <RotateCcw size={24} />
            </div>
            <h2 className="text-2xl font-black font-display mb-3 uppercase tracking-tight">System Reliability</h2>
            <p className="text-white/40 text-[11px] font-bold leading-relaxed">
              Maintain operational integrity by performing off-site encrypted data backups regularly.
            </p>
          </div>
          <Link href="/admin/data" className="relative z-10 px-8 py-5 bg-gold text-navy rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl shadow-gold/10 hover:bg-white transition-all active:scale-95">
            Backup System
          </Link>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Link href="/admin/sales" className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all shadow-sm group">
              <div className="p-4 bg-navy dark:bg-white/5 rounded-2xl text-gold mb-4 group-hover:scale-110 transition-transform"><DollarSign size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-navy dark:text-white">Ledger</span>
           </Link>
           <Link href="/admin/analytics" className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all shadow-sm group">
              <div className="p-4 bg-gold/10 rounded-2xl text-gold mb-4 group-hover:scale-110 transition-transform"><TrendingUp size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-navy dark:text-white">Metrics</span>
           </Link>
        </div>
      </div>
    </div>
  );
}
