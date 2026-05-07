'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Trash2
} from 'lucide-react';
import { Sale } from '@/lib/data-service';

export default function SalesLedger() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sale, direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    lot: '',
    description: '',
    invoiceId: '',
    sellingPrice: '',
    bidPrice: '',
    platform: 'FB'
  });

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales?admin=true');
      if (res.ok) {
        const data = await res.json();
        setSales(data);
      }
    } catch (e) {
      console.error('Failed to fetch sales', e);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sale = {
        ...formData,
        sellingPrice: parseFloat(formData.sellingPrice),
        bidPrice: parseFloat(formData.bidPrice),
        profit: parseFloat(formData.sellingPrice) - parseFloat(formData.bidPrice),
        margin: ((parseFloat(formData.sellingPrice) - parseFloat(formData.bidPrice)) / parseFloat(formData.bidPrice || '1')) * 100
      };
      
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale)
      });
      
      if (res.ok) {
        setShowAdd(false);
        fetchSales();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    try {
      const res = await fetch(`/api/sales?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSales();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSales = useMemo(() => {
    let result = sales.filter(s => 
      (s.description || '').toLowerCase().includes(search.toLowerCase()) || 
      (s.lot || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.invoiceId || '').toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? '';
      const bVal = b[sortConfig.key] ?? '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
           {/* Pagination for Sales */}
           <div className="flex items-center gap-2 bg-white dark:bg-[#0f1f35] p-2 rounded-2xl border border-gold/20 shadow-sm">
             <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest"
             >
                Prev
             </button>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-navy text-white rounded-xl">
               <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Page</span>
               <span className="text-xs font-black font-display text-gold">{currentPage}</span>
             </div>
             <button 
                disabled={currentPage >= Math.ceil(filteredSales.length / itemsPerPage)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest"
             >
                Next
             </button>
           </div>

          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-6 py-3 bg-navy dark:bg-gold text-white dark:text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            {showAdd ? 'Cancel' : 'Manual Entry'}
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAddSale} className="bg-white dark:bg-[#0f1f35] p-6 rounded-3xl border border-gold/30 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold" placeholder="Item name..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lot & Date</label>
                <div className="flex gap-2">
                  <input required value={formData.lot} onChange={e => setFormData({...formData, lot: e.target.value})} className="w-1/2 bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold" placeholder="Lot" />
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-1/2 bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financials</label>
                <div className="flex gap-2">
                  <input required type="number" step="0.01" placeholder="Sold $" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="w-1/2 bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold" />
                  <input required type="number" step="0.01" placeholder="Cost $" value={formData.bidPrice} onChange={e => setFormData({...formData, bidPrice: e.target.value})} className="w-1/2 bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="flex-1 bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold text-navy dark:text-white">
                  <option value="FB">Facebook</option>
                  <option value="Ebay">Ebay</option>
                  <option value="Direct">Direct</option>
                </select>
                <button type="submit" className="bg-gold text-navy px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-navy hover:text-gold transition-colors">Save</button>
              </div>
           </div>
        </form>
      )}

      {/* Filter Bar - Compact */}
      <div className="bg-white dark:bg-[#0f1f35] p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search lot, item, invoice..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[13px] focus:ring-1 focus:ring-gold/30 dark:text-white transition-all outline-none font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sales Display - Table for Desktop, Cards for Mobile */}
      <div className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('date')}>Date</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors" onClick={() => handleSort('lot')}>Item</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors text-right" onClick={() => handleSort('sellingPrice')}>Price</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-gold transition-colors text-right" onClick={() => handleSort('profit')}>Gain</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Plat</th>
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-16 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions available.</p>
                  </td>
                </tr>
              ) : (
                filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((s: any) => (
                  <tr key={s._id || s.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-mono font-bold whitespace-nowrap">{s.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-navy dark:text-white text-xs group-hover:text-gold transition-colors font-display uppercase tracking-tight truncate max-w-[200px]">{s.description}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider">Lot {s.lot}</span>
                          <span className="text-[8px] text-gold font-black uppercase tracking-wider">Inv {s.invoiceId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-black text-navy dark:text-white font-display whitespace-nowrap">{formatCurrency(s.sellingPrice)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 text-sm font-black font-display ${s.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatCurrency(s.profit)}
                      </div>
                      <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{(s.margin || 0).toFixed(0)}% ROI</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[9px] font-black uppercase text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10 whitespace-nowrap">{s.platform || 'FB'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteSale(s._id || s.id)} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
          {filteredSales.length === 0 ? (
             <div className="px-10 py-16 text-center">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions available.</p>
             </div>
          ) : (
            filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((s: any) => (
              <div key={s._id || s.id} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.date}</span>
                      <span className="font-black text-navy dark:text-white text-sm uppercase tracking-tight leading-tight">{s.description}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black uppercase text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10 whitespace-nowrap">{s.platform || 'FB'}</span>
                     <button onClick={() => handleDeleteSale(s._id || s.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl">
                       <Trash2 size={16} />
                     </button>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">Lot {s.lot}</span>
                  <span className="text-[8px] text-gold font-black uppercase tracking-wider bg-gold/5 px-2 py-1 rounded-md">Inv {s.invoiceId}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-white/5">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sold Price</span>
                      <span className="text-base font-black text-navy dark:text-white font-display">{formatCurrency(s.sellingPrice)}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Profit</span>
                      <span className={`text-base font-black font-display ${s.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatCurrency(s.profit)}
                      </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
