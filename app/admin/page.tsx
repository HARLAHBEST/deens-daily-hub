"use client";

import React, { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
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

export default function AdminDashboard() {
  const [queryClient] = useState(() => new QueryClient());
  const [search, setSearch] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboardInner search={search} setSearch={setSearch} />
    </QueryClientProvider>
  );
}

  function fetchJson(url: string) {
    return fetch(url).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`Request failed: ${res.status} ${res.statusText}` + (text ? ` - ${text}` : '')) as any;
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  function AdminDashboardInner({ search, setSearch }: { search: string; setSearch: (s: string) => void }) {
    const { data: items = [], error: itemsError } = useQuery({
      queryKey: ['items'],
      queryFn: () => fetchJson('/api/items'),
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: 1,
    });

    const { data: sales = [] } = useQuery({ queryKey: ['sales'], queryFn: () => fetchJson('/api/sales'), staleTime: 1000 * 60 * 2, refetchOnWindowFocus: false, retry: 1 });
    const { data: expenses = [] } = useQuery({ queryKey: ['expenses'], queryFn: () => fetchJson('/api/expenses'), staleTime: 1000 * 60 * 2, refetchOnWindowFocus: false, retry: 1 });
    const { data: referrals = { customers: [] } } = useQuery({ queryKey: ['referrals'], queryFn: () => fetchJson('/api/referrals'), staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false, retry: 1 });
    const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: () => fetchJson('/api/invoices'), staleTime: 1000 * 60 * 1, refetchOnWindowFocus: false, retry: 1 });

    const computed = useMemo(() => {
      let rev = 0;
      let cost = 0;

      (sales || []).forEach((s: any) => {
        rev += s.sellingPrice || 0;
        cost += s.bidPrice || 0;
      });

      if (Array.isArray(items)) {
        items.forEach((it: any) => {
          if (it.status === 'Sold' || it.status === 'Past Sold') {
            if (!sales.some((s: any) => s.uid === it.uid)) {
              rev += it.cost * 1.5;
              cost += it.cost;
            }
          }
        });
      }

      const totalExp = (expenses || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
      const gp = rev - cost;
      const np = gp - totalExp;
      const inStock = Array.isArray(items) ? items.filter((it: any) => it.status === 'In Stock').length : 0;

      return {
        totalSold: (sales || []).length,
        revenue: rev,
        cogs: cost,
        grossProfit: gp,
        expenses: totalExp,
        netProfit: np,
        stockCount: inStock,
        invoiceCount: (invoices || []).length,
        referralStats: {
          customers: (referrals.customers || []).length,
          totalRef: (referrals.customers || []).reduce((sum: number, c: any) => sum + (c.referrals || 0), 0),
          pendingGifts: (referrals.customers || []).reduce((sum: number, c: any) => sum + ((c.giftsEarned || 0) - (c.giftsClaimed || 0)), 0),
        }
      };
    }, [items, sales, expenses, referrals, invoices]);

    const filteredItems = useMemo(() => {
      if (!search || !Array.isArray(items)) return items || [];
      const q = search.toLowerCase();
      return (items || []).filter((it: any) => {
        return (
          (it.description || '').toLowerCase().includes(q) ||
          (it.uid || '').toLowerCase().includes(q) ||
          (it.lot || '').toLowerCase().includes(q) ||
          (it.category || '').toLowerCase().includes(q)
        );
      });
    }, [search, items]);

    const data = {
      totalSold: computed.totalSold,
      revenue: computed.revenue,
      cogs: computed.cogs,
      grossProfit: computed.grossProfit,
      expenses: computed.expenses,
      netProfit: computed.netProfit,
      stockCount: computed.stockCount,
      invoiceCount: computed.invoiceCount,
    };

    const referralStats = computed.referralStats;

    if (itemsError) console.error('Items query error', itemsError);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-2">
             <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
             <span className="text-[9px] font-black text-gold uppercase tracking-[2px]">System Status: Online</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-navy dark:text-white font-display uppercase leading-none italic">
            Command Center
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-1 font-bold text-xs uppercase tracking-wider">
            Operational Intelligence Overview
          </p>
        </div>
      </div>

      {/* Primary Stats - High Density */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Logistics & Growth Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#0f1f35] rounded-[28px] border border-slate-200 dark:border-white/5 p-5 md:p-7 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-all"></div>
          
          <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
            <div>
              <h2 className="text-lg md:text-xl font-black dark:text-white font-display uppercase tracking-tight">Inventory Logistics</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mt-1">Real-time distribution analytics</p>
            </div>
            <Link href="/admin/stock" className="p-2.5 bg-navy dark:bg-white/5 rounded-xl text-gold hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95">
              <Package size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 relative z-10">
            <div className="p-4 md:p-5 rounded-[20px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/stat hover:border-gold/50 transition-all text-center sm:text-left">
              <div className="text-xl md:text-2xl font-black text-navy dark:text-white font-display mb-0.5">{data.stockCount}</div>
              <div className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[2px] font-black">Active Units</div>
            </div>
            <div className="p-4 md:p-5 rounded-[20px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/stat hover:border-gold/50 transition-all text-center sm:text-left">
              <div className="text-xl md:text-2xl font-black text-navy dark:text-white font-display mb-0.5">{data.invoiceCount}</div>
              <div className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[2px] font-black">Source Invoices</div>
            </div>
            <div className="p-4 md:p-5 rounded-[20px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/stat hover:border-gold/50 transition-all text-center sm:text-left">
              <div className="text-xl md:text-2xl font-black text-navy dark:text-white font-display mb-0.5">{data.totalSold}</div>
              <div className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[2px] font-black">Closed Sales</div>
            </div>
            <div className="p-4 md:p-5 rounded-[20px] bg-gold/10 border border-gold/20 group/stat text-center sm:text-left">
              <div className="text-xl md:text-2xl font-black text-gold font-display mb-0.5">
                {((data.totalSold / (data.stockCount + data.totalSold || 1)) * 100).toFixed(0)}%
              </div>
              <div className="text-[9px] text-gold uppercase tracking-[2px] font-black">Efficiency</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] rounded-[28px] border border-slate-200 dark:border-white/5 p-5 md:p-7 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-lg md:text-xl font-black dark:text-white font-display uppercase tracking-tight">Promoters</h2>
              <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mt-1">Loyalty Hub Overview</p>
            </div>
            <Link href="/admin/referrals" className="p-2.5 bg-navy dark:bg-white/5 rounded-xl text-gold hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95">
              <Users size={18} />
            </Link>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Promoters</span>
              <span className="text-lg font-black text-navy dark:text-white font-display">{referralStats.customers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Referrals</span>
              <span className="text-lg font-black text-navy dark:text-white font-display">{referralStats.totalRef}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gold/10 rounded-2xl border border-gold/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-gold italic">Rewards Due</span>
              <span className="text-xl font-black text-gold font-display animate-pulse">{referralStats.pendingGifts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy rounded-[28px] p-6 md:p-8 text-white relative overflow-hidden group shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative z-10 max-w-sm">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-gold group-hover:rotate-12 transition-transform">
               <RotateCcw size={20} />
            </div>
            <h2 className="text-lg md:text-xl font-black font-display mb-2 uppercase tracking-tight">System Reliability</h2>
            <p className="text-white/40 text-[10px] font-bold leading-relaxed">
              Maintain operational integrity by performing off-site encrypted data backups regularly.
            </p>
          </div>
          <Link href="/admin/data" className="relative z-10 px-6 py-4 bg-gold text-navy rounded-xl font-black text-[10px] uppercase tracking-[2px] shadow-xl hover:bg-white transition-all active:scale-95 w-full sm:w-auto text-center">
            Backup System
          </Link>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Link href="/admin/sales" className="bg-white dark:bg-[#0f1f35] rounded-[24px] border border-slate-200 dark:border-white/5 p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all shadow-sm group">
              <div className="p-3 bg-navy dark:bg-white/5 rounded-xl text-gold mb-3 group-hover:scale-110 transition-transform"><DollarSign size={18} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-navy dark:text-white">Ledger</span>
           </Link>
           <Link href="/admin/analytics" className="bg-white dark:bg-[#0f1f35] rounded-[24px] border border-slate-200 dark:border-white/5 p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all shadow-sm group">
              <div className="p-3 bg-gold/10 rounded-xl text-gold mb-3 group-hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-navy dark:text-white">Metrics</span>
           </Link>
        </div>
      </div>
    </div>
  );
}
