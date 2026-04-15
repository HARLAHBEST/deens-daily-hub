'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { 
  getSales, 
  getExpenses, 
  getStatuses, 
  getBaseItems, 
  Item, 
  Sale, 
  Expense, 
  StatusMap 
} from '@/lib/data-service';

type Period = 'day' | 'week' | 'month' | 'year' | 'all';

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
    setData({
      sales: getSales(),
      expenses: getExpenses(),
      items: getBaseItems(),
      statuses: getStatuses()
    });
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
    filteredSales.forEach(s => { rev += s.sp; cost += s.cost; });

    // Past Sold revenue (approximate, all-time)
    let pastRev = 0;
    let pastCost = 0;
    let pastCnt = 0;
    if (period === 'all') {
      data.items.forEach(it => {
        const s = data.statuses[it.uid];
        if (s?.st === 'Past Sold' && s.price) {
          pastRev += s.price;
          pastCost += it.cost;
          pastCnt++;
        }
      });
    }

    let itemLoss = 0;
    let personalLoss = 0;
    if (period === 'all') {
      data.items.forEach(it => {
        const s = data.statuses[it.uid];
        if (s?.st === 'Lost' || s?.st === 'Damaged') itemLoss += it.cost;
        if (s?.st === 'Personal Use') personalLoss += it.cost;
      });
    }

    const totalRev = rev + pastRev;
    const totalCogs = cost + pastCost;
    const grossProfit = totalRev - totalCogs;
    const expTotal = filteredExpenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = grossProfit - expTotal - itemLoss;

    // Category analysis
    const catMap: Record<string, { n: number, rev: number, profit: number }> = {};
    filteredSales.forEach(s => {
      if (!catMap[s.cat]) catMap[s.cat] = { n: 0, rev: 0, profit: 0 };
      catMap[s.cat].n++;
      catMap[s.cat].rev += s.sp;
      catMap[s.cat].profit += (s.sp - s.cost);
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
      catPerf: Object.entries(catMap).map(([cat, d]) => ({ cat, ...d })).sort((a,b) => b.rev - a.rev)
    };
  }, [data, period]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3">
             <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
             <span className="text-[9px] font-black text-gold uppercase tracking-[2px]">Market Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-navy dark:text-white flex items-center gap-3 font-display uppercase leading-none">
            <TrendingUp size={32} className="text-gold" /> Analytics Hub
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-2 font-bold text-sm">
            Data-driven intelligence to guide your business growth.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-white dark:bg-[#0f1f35] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm self-start">
          {(['day', 'week', 'month', 'year', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p 
                  ? 'bg-gold text-navy shadow-xl shadow-gold/20' 
                  : 'text-slate-400 hover:text-navy dark:hover:text-gold'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[3px] leading-none">Net Yield</p>
            <div className="p-3 bg-white/10 text-gold rounded-2xl group-hover:rotate-12 transition-transform">
              <Target size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-black text-gold font-display tracking-tight tabular-nums mb-2">{formatCurrency(stats.netProfit)}</h3>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Post-operational earnings</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[3px] leading-none">Profitability Index</p>
            <div className="p-3 bg-gold/10 text-gold rounded-2xl">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-slate-400">
                <span>Gross Margin</span>
                <span className="text-navy dark:text-gold">{((stats.grossProfit / (stats.revenue || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, (stats.grossProfit / (stats.revenue || 1)) * 100))}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-slate-400">
                <span>Net Margin</span>
                <span className="text-navy dark:text-gold">{((stats.netProfit / (stats.revenue || 1)) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-navy dark:bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  style={{ width: `${Math.min(100, Math.max(0, (stats.netProfit / (stats.revenue || 1)) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f1f35] p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="flex justify-between items-start mb-10">
            <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[3px] leading-none">Capture Vol</p>
            <div className="p-3 bg-gold/10 text-gold rounded-2xl">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-black text-navy dark:text-white font-display tracking-tight tabular-nums mb-2">
              {stats.soldCount} <span className="text-lg font-black text-slate-300 dark:text-white/20 uppercase">Units</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Incl. {stats.pastCnt} historical records</p>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Flow */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-2xl font-black font-display uppercase tracking-tight dark:text-white">Financial Flow</h3>
            <DollarSign className="text-gold" size={24} />
          </div>
          <div className="p-10 space-y-6">
            <div className="flex justify-between items-center group">
              <span className="text-[11px] font-black text-slate-400 group-hover:text-gold uppercase tracking-widest transition-colors">Gross Inflow</span>
              <span className="font-black text-navy dark:text-white font-display text-lg">{formatCurrency(stats.revenue)}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-[11px] font-black text-slate-400 group-hover:text-gold uppercase tracking-widest transition-colors">Inventory COGS</span>
              <span className="font-bold text-slate-400 font-mono text-sm leading-none flex items-center gap-1">
                <ArrowDownRight size={14} /> {formatCurrency(stats.cogs)}
              </span>
            </div>
            <div className="h-[1px] bg-slate-100 dark:bg-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-navy dark:text-white/40 uppercase tracking-[3px]">Margin Result</span>
              <span className="font-black text-navy dark:text-white font-display text-xl">{formatCurrency(stats.grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-[11px] font-black text-slate-400 group-hover:text-rose-500 uppercase tracking-widest transition-colors">Operational Exp</span>
              <span className="font-bold text-rose-500/70 font-mono text-sm leading-none flex items-center gap-1">
                 <ArrowDownRight size={14} /> {formatCurrency(stats.expenses)}
              </span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-[11px] font-black text-slate-400 group-hover:text-rose-500 uppercase tracking-widest transition-colors">Asset Leakage</span>
              <span className="font-bold text-rose-500/50 font-mono text-sm leading-none flex items-center gap-1">
                 <ArrowDownRight size={14} /> {formatCurrency(stats.itemLoss + stats.personalLoss)}
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gold uppercase tracking-[4px]">Final Operating Result</span>
              <span className="text-4xl font-black text-emerald-500 font-display tabular-nums tracking-tight">{formatCurrency(stats.netProfit)}</span>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-2xl font-black font-display uppercase tracking-tight dark:text-white">Segment Performance</h3>
            <Package className="text-gold" size={24} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Segment</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Vol</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {stats.catPerf.map((c) => (
                  <tr key={c.cat} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black dark:text-white uppercase tracking-tight font-display group-hover:text-gold transition-colors">{c.cat}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-right font-black tabular-nums text-slate-400">{c.n}</td>
                    <td className="px-8 py-6 text-base text-right font-black tabular-nums dark:text-white font-display">{formatCurrency(c.rev)}</td>
                    <td className="px-8 py-6 text-right font-black text-emerald-500 group">
                      <div className="flex items-center justify-end gap-1 font-display text-sm">
                        {formatCurrency(c.profit)}
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
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
