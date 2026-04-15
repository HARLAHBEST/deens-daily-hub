'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { getSales, Sale } from '@/lib/data-service';

export default function SalesLedger() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sale, direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    setSales(getSales());
  }, []);

  const filteredSales = useMemo(() => {
    let result = sales.filter(s => 
      s.desc.toLowerCase().includes(search.toLowerCase()) || 
      s.lot.toLowerCase().includes(search.toLowerCase()) ||
      s.inv.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [sales, search, sortConfig]);

  const handleSort = (key: keyof Sale) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3">
             <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
             <span className="text-[9px] font-black text-gold uppercase tracking-[2px]">Transaction History</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-navy dark:text-white flex items-center gap-3 font-display uppercase leading-none">
            <ShoppingBag size={32} className="text-gold" /> Sales Ledger
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-2 font-bold text-sm">
            Complete transaction history and financial performance records.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0f1f35] p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions by lot, item or invoice..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white transition-all outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('date')}>Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('lot')}>Item Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('cat')}>Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('cost')}>Cost</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('sp')}>Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('profit')}>Gain</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-10 py-24 text-center">
                    <div className="text-4xl mb-4 opacity-20">📊</div>
                    <p className="text-slate-400 text-sm font-bold">No transactions found.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-xs text-slate-500 font-mono font-bold">{s.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-navy dark:text-white text-sm group-hover:text-gold transition-colors font-display uppercase tracking-tight">{s.desc}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Lot {s.lot}</span>
                          <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Inv {s.inv}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-lg bg-white dark:bg-navy">{s.cat}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-400">{formatCurrency(s.cost)}</td>
                    <td className="px-8 py-6 text-base font-black text-navy dark:text-white font-display">{formatCurrency(s.sp)}</td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-1.5 text-base font-black font-display ${s.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.profit >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        {formatCurrency(s.profit)}
                      </div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-[2px] mt-0.5">{s.margin.toFixed(1)}% Return</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black uppercase text-gold bg-gold/5 px-2.5 py-1 rounded-full border border-gold/10">{s.plat || 'FB'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
