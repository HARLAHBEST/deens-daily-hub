'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { 
  Item, 
  Sale, 
  Expense
} from '@/lib/data-service';

type Period = 'day' | 'week' | 'month' | 'year' | 'all';
type StatusMap = Record<string, { st: string; price?: number }>;

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>('all');
  const [data, setData] = useState<{
    sales: Sale[];
    expenses: Expense[];
    items: Item[];
    statuses: StatusMap;
  }>({
    sales: [],
    expenses: [],
    items: [],
    statuses: {}
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [itemsRes, salesRes, expensesRes] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/sales'),
          fetch('/api/expenses')
        ]);

        const items = await itemsRes.json();
        const sales = await salesRes.json();
        const expenses = await expensesRes.json();

        setData({
          sales,
          expenses,
          items,
          statuses: {} // No longer needed as separate map if in items
        });
      } catch (err) {
        console.error('Failed to load analytics data', err);
      }
    };

    fetchAllData();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const yearStr = now.toISOString().slice(0, 4);

    const filteredSales = data.sales.filter(s => {
      if (period === 'day') return s.date === todayStr;
      if (period === 'week') return s.date >= lastWeek;
      if (period === 'month') return s.date.startsWith(monthStr);
      if (period === 'year') return s.date.startsWith(yearStr);
      return true;
    });

    const filteredExpenses = data.expenses.filter(e => {
      if (period === 'day') return e.date === todayStr;
      if (period === 'week') return e.date >= lastWeek;
      if (period === 'month') return e.date.startsWith(monthStr);
      if (period === 'year') return e.date.startsWith(yearStr);
      return true;
    });

    let rev = 0;
    let cost = 0;
    filteredSales.forEach(s => { 
      rev += (s.sellingPrice || 0); 
      cost += (s.bidPrice || 0); 
    });

    let pastRev = 0;
    let pastCost = 0;
    let pastCnt = 0;
    if (period === 'all') {
      data.items.forEach(it => {
        if (it.status === 'Past Sold' || (it.status === 'Sold' && !data.sales.some(s => s.uid === it.uid))) {
          pastRev += it.cost * 1.5; // Estimating or handle appropriately 
          pastCost += it.cost;
          pastCnt++;
        }
      });
    }

    let itemLoss = 0;
    let personalLoss = 0;
    if (period === 'all') {
      data.items.forEach(it => {
        if (it.status === 'Lost' || it.status === 'Damaged') itemLoss += it.cost;
        if (it.status === 'Personal Use') personalLoss += it.cost;
      });
    }

    const totalRev = rev + pastRev;
    const totalCogs = cost + pastCost;
    const grossProfit = totalRev - totalCogs;
    const expTotal = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = grossProfit - expTotal - itemLoss;

    const catMap: Record<string, { n: number, rev: number, profit: number }> = {};
    filteredSales.forEach(s => {
      const cat = s.category || 'Other';
      if (!catMap[cat]) catMap[cat] = { n: 0, rev: 0, profit: 0 };
      catMap[cat].n++;
      catMap[cat].rev += (s.sellingPrice || 0);
      catMap[cat].profit += ((s.sellingPrice || 0) - (s.bidPrice || 0));
    });

    return {
      revenue: totalRev,
      cogs: totalCogs,
      grossProfit,
      expenses: expTotal,
      netProfit,
      soldCount: filteredSales.length + pastCnt,
      pastCnt,
      itemLoss,
      personalLoss,
      catPerf: Object.entries(catMap).map(([category, d]) => ({ category, ...d })).sort((a,b) => b.rev - a.rev)
    };
  }, [data, period]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-2.5 py-1 rounded-full mb-2">
             <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
             <span className="text-[8px] font-black text-gold uppercase tracking-[2px]">Market Intelligence Hub</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-navy dark:text-white flex items-center gap-2 font-display uppercase italic leading-none">
            <TrendingUp size={24} className="text-gold" /> Performance Data
          </h1>
          <p className="text-slate-500 dark:text-white/30 mt-1 font-bold text-[10px] uppercase tracking-widest">
            Data-driven intelligence overview
          </p>
        </div>

        {/* Period Selector - Compact */}
        <div className="flex bg-white dark:bg-[#0f1f35] p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm self-start">
          {(['day', 'week', 'month', 'year', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                period === p 
                  ? 'bg-gold text-navy shadow-lg' 
                  : 'text-slate-400 hover:text-navy dark:hover:text-gold'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics - Higher Density */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy rounded-[28px] p-6 md:p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[2px]">Net Yield</p>
            <div className="p-2.5 bg-white/10 text-gold rounded-xl">
              <Target size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-gold font-display tracking-tight tabular-nums mt-2">
              {formatCurrency(stats.netProfit)}
            </h3>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Operational result</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] p-6 md:p-8 rounded-[28px] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Efficiency</p>
            <div className="p-2.5 bg-gold/10 text-gold rounded-xl">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[9px] font-black mb-1.5 uppercase tracking-widest text-slate-400">
                <span>Gross Margin</span>
                <span className="text-navy dark:text-gold">{((stats.grossProfit / (stats.revenue || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (stats.grossProfit / (stats.revenue || 1)) * 100))}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-black mb-1.5 uppercase tracking-widest text-slate-400">
                <span>Net Margin</span>
                <span className="text-navy dark:text-gold">{((stats.netProfit / (stats.revenue || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-navy dark:bg-white rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (stats.netProfit / (stats.revenue || 1)) * 100))}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] p-6 md:p-8 rounded-[28px] border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-start mb-6">
            <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Capture Vol</p>
            <div className="p-2.5 bg-gold/10 text-gold rounded-xl">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-navy dark:text-white font-display tracking-tight tabular-nums mt-2">
              {stats.soldCount} <span className="text-xs font-black text-slate-300 dark:text-white/20 uppercase">Units</span>
            </h3>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Volume overview</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Flow - Tighter */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-7 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black font-display uppercase tracking-tight dark:text-white">Financial Flow</h3>
            <DollarSign className="text-gold" size={20} />
          </div>
          <div className="p-7 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Inflow</span>
              <span className="font-black text-navy dark:text-white font-display text-base">{formatCurrency(stats.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory COGS</span>
              <span className="font-bold text-slate-400 font-mono text-xs flex items-center gap-1">
                <ArrowDownRight size={12} /> {formatCurrency(stats.cogs)}
              </span>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-navy dark:text-white/40 uppercase tracking-widest">Net Operational Result</span>
              <span className="text-3xl font-black text-emerald-500 font-display tabular-nums leading-none">{formatCurrency(stats.netProfit)}</span>
            </div>
          </div>
        </div>

        {/* Segment Performance - Tighter Table */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-7 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black font-display uppercase tracking-tight dark:text-white">Segment Performance</h3>
            <Package className="text-gold" size={20} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Segment</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Vol</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {stats.catPerf.map((c) => (
                  <tr key={c.category} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black dark:text-white uppercase tracking-tight font-display">{c.category}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-right font-black tabular-nums text-slate-400">{c.n}</td>
                    <td className="px-6 py-4 text-sm text-right font-black tabular-nums dark:text-white font-display group-hover:text-gold transition-colors">{formatCurrency(c.rev)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
