'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-2.5 py-1 rounded-full mb-2">
             <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
             <span className="text-[8px] font-black text-gold uppercase tracking-[2px]">Transaction History</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-navy dark:text-white flex items-center gap-2 font-display uppercase italic leading-none">
            <ShoppingBag size={24} className="text-gold" /> Sales Ledger
          </h1>
          <p className="text-slate-500 dark:text-white/30 mt-1 font-bold text-[10px] uppercase tracking-widest">
            Complete transaction and financial performance records.
          </p>
        </div>
      </div>

      {/* Filter Bar - Compact */}
      <div className="bg-white dark:bg-[#0f1f35] p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search lot, item, invoice..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[13px] focus:ring-1 focus:ring-gold/30 dark:text-white transition-all outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sales Table - Tighter Rows */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('date')}>Date</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('lot')}>Item</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors text-right" onClick={() => handleSort('sp')}>Price</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors text-right" onClick={() => handleSort('profit')}>Gain</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Plat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-16 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions available.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-mono font-bold whitespace-nowrap">{s.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-navy dark:text-white text-xs group-hover:text-gold transition-colors font-display uppercase tracking-tight truncate max-w-[200px]">{s.desc}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider">Lot {s.lot}</span>
                          <span className="text-[8px] text-gold font-black uppercase tracking-wider">Inv {s.inv}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-black text-navy dark:text-white font-display whitespace-nowrap">{formatCurrency(s.sp)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 text-sm font-black font-display ${s.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatCurrency(s.profit)}
                      </div>
                      <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{s.margin.toFixed(0)}% ROI</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[9px] font-black uppercase text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10 whitespace-nowrap">{s.plat || 'FB'}</span>
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
