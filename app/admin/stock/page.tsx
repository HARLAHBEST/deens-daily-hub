'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Save, 
  RotateCcw, 
  Package, 
  ChevronDown,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  TrendingDown
} from 'lucide-react';
import { 
  Item, 
  Category 
} from '@/lib/data-service';

const STATUS_CONFIG = {
  'In Stock': { color: 'emerald', icon: <Package size={14} />, label: 'In Stock' },
  'Sold': { color: 'indigo', icon: <CheckCircle2 size={14} />, label: 'Sold' },
  'Past Sold': { color: 'violet', icon: <CheckCircle2 size={14} />, label: 'Past Sold' },
  'Lost': { color: 'rose', icon: <XCircle size={14} />, label: 'Lost' },
  'Damaged': { color: 'amber', icon: <AlertTriangle size={14} />, label: 'Damaged' },
  'Personal Use': { color: 'pink', icon: <UserCheck size={14} />, label: 'Personal Use' },
};

const CATEGORIES: Category[] = [
  'Clothing', 'Home & Kitchen', 'Health & Beauty', 'Electronics', 'Baby & Kids', 'Tools', 'Other'
];

export default function StockTracker() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Pending actions for rows
  const [pendingActions, setPendingActions] = useState<Record<string, { st: string, price: string }>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch('/api/items');
        if (res.ok) {
          setItems(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch stock items', err);
      }
    };
    fetchStock();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const st = it.status || 'In Stock';
      const matchesSearch = 
        (it.description || '').toLowerCase().includes(search.toLowerCase()) || 
        (it.lot || '').toLowerCase().includes(search.toLowerCase()) ||
        (it.invoiceId || '').toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || it.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || st === statusFilter;
      
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const handleActionChange = (id: string, action: string) => {
    setPendingActions(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), st: action, price: prev[id]?.price || '' }
    }));
  };

  const handlePriceChange = (id: string, price: string) => {
    setPendingActions(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), price, st: prev[id]?.st || 'Past Sold' }
    }));
  };

  const saveAction = async (itemId: string) => {
    const action = pendingActions[itemId];
    if (!action || !action.st) return;

    try {
      // 1. Update the item in MongoDB
      const updates: any = { status: action.st };
      if (action.price) updates.soldPrice = parseFloat(action.price);
      if (action.st === 'Sold' || action.st === 'Past Sold') {
        updates.soldDate = new Date().toISOString().slice(0, 10);
      }

      const res = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, ...updates })
      });

      if (res.ok) {
        // 2. If Sold, create a Sale record
        if (action.st === 'Sold' || action.st === 'Past Sold') {
          const item = items.find(it => it._id === itemId);
          if (item) {
            await fetch('/api/sales', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: new Date().toISOString().slice(0, 10),
                lot: item.lot,
                description: item.description,
                invoiceId: item.invoiceId,
                bidPrice: item.bidPrice,
                sellingPrice: parseFloat(action.price || '0'),
                profit: parseFloat(action.price || '0') - (item.bidPrice || 0),
                platform: 'FB' // Default
              })
            });
          }
        }

        // 3. Refresh items from DB
        const refreshRes = await fetch('/api/items');
        setItems(await refreshRes.json());

        // Clear pending
        const nextPending = { ...pendingActions };
        delete nextPending[itemId];
        setPendingActions(nextPending);
      }
    } catch (e) {
      console.error('Failed to sync stock action', e);
    }
  };

  const restoreItem = async (itemId: string) => {
    try {
      const res = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, status: 'In Stock' })
      });
      if (res.ok) {
        const refreshRes = await fetch('/api/items');
        setItems(await refreshRes.json());
      }
    } catch (e) {
      console.error('Failed to restore item', e);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display uppercase italic text-gradient leading-none">
            Stock Tracker
          </h1>
          <p className="text-slate-500 dark:text-white/30 text-[11px] font-bold uppercase tracking-widest mt-1">
            Operational Inventory Management
          </p>
        </div>
      </div>

      {/* Filters Bar - Responsive Wrap */}
      <div className="bg-white dark:bg-[#0f1f35] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col sm:flex-row gap-3 items-center overflow-hidden">
        <div className="relative w-full sm:flex-1 min-w-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search lot, description, invoice..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[13px] focus:ring-1 focus:ring-gold/30 dark:text-white transition-all outline-none font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <select 
            className="flex-1 sm:flex-none bg-slate-200 dark:bg-slate-700 border-none rounded-xl text-[11px] font-black uppercase py-2.5 px-3 focus:ring-1 focus:ring-gold/30 dark:text-white cursor-pointer transition-all outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select 
            className="flex-1 sm:flex-none bg-slate-200 dark:bg-slate-700 border-none rounded-xl text-[11px] font-black uppercase py-2.5 px-3 focus:ring-1 focus:ring-gold/30 dark:text-white cursor-pointer transition-all outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Statuses</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Pagination & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 bg-white dark:bg-[#0f1f35] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Total Results</p>
              <p className="text-lg font-black font-display text-navy dark:text-white leading-none mt-1">{filteredItems.length}</p>
            </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 px-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-navy disabled:opacity-20 transition-all outline-none"
          >
            Prev
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-navy dark:bg-black rounded-xl border border-gold/30">
              <span className="text-[9px] font-black uppercase text-gold/50">Page</span>
              <span className="text-sm font-black font-display text-gold leading-none">{currentPage}</span>
              <span className="text-[9px] font-black uppercase text-gold/50">/ {Math.ceil(filteredItems.length / itemsPerPage)}</span>
          </div>
          <button 
            disabled={currentPage >= Math.ceil(filteredItems.length / itemsPerPage)}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 px-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-navy disabled:opacity-20 transition-all outline-none"
          >
            Next
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((it) => {
          const stKey = it.status || 'In Stock';
          const config = STATUS_CONFIG[stKey as keyof typeof STATUS_CONFIG];
          const isGone = stKey !== 'In Stock' && stKey !== 'Sold';

          const id = it._id!;
          return (
                <div 
                  key={id}
                  className={`bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-2xl md:rounded-3xl p-3 md:p-4 transition-all hover:border-gold/30 group ${
                    isGone ? 'opacity-40 grayscale-[0.5]' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[8px] font-black text-navy bg-gold px-1.5 py-0.5 rounded-sm uppercase tracking-[1.5px]">
                          LOT {it.lot}
                        </span>
                        <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-[1.5px] px-2 py-0.5 rounded-full ${
                          stKey === 'In Stock' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
                          stKey.includes('Sold') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' :
                          'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40'
                        }`}>
                          {config.icon} {config.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{it.category}</span>
                      </div>
                      
                      <h3 className="font-black text-navy dark:text-white font-display text-base tracking-tight truncate group-hover:text-gold transition-colors">
                        {it.description}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-white/40 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase opacity-40">Invoice</span>
                          <span className="font-mono text-navy dark:text-white">{it.invoiceId}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase opacity-40">Cost</span>
                          <span className="text-base text-navy dark:text-gold font-display font-black leading-none">{formatCurrency(it.cost)}</span>
                        </div>
                      </div>

                       {stKey === 'Past Sold' && it.soldPrice && (
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-gold/5 border border-gold/10 rounded-md text-gold font-black text-[9px] uppercase tracking-wider">
                          <TrendingDown size={12} /> SP: {formatCurrency(it.soldPrice)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 md:justify-end">
                      {stKey === 'In Stock' ? (
                        <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/10 w-full lg:w-auto">
                          <select 
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider focus:ring-0 min-w-[120px] cursor-pointer dark:text-white outline-none flex-1"
                            value={pendingActions[id]?.st || ''}
                            onChange={(e) => handleActionChange(id, e.target.value)}
                          >
                            <option value="">Update Status</option>
                            <option value="Past Sold">Past Sold</option>
                            <option value="Lost">Lost</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Personal Use">Personal Use</option>
                          </select>
                          
                          {pendingActions[id]?.st === 'Past Sold' && (
                            <div className="relative w-full sm:w-24">
                              <input 
                                type="number"
                                placeholder="$ Price"
                                className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] w-full px-2 py-2 font-bold focus:ring-1 focus:ring-gold/30 dark:text-white outline-none"
                                value={pendingActions[id]?.price || ''}
                                onChange={(e) => handlePriceChange(id, e.target.value)}
                              />
                            </div>
                          )}
     
                          <button 
                            onClick={() => saveAction(id)}
                            disabled={!pendingActions[id]?.st}
                            className="p-3 lg:p-2 bg-navy dark:bg-gold text-gold dark:text-navy rounded-xl hover:scale-105 disabled:opacity-30 transition-all font-black flex-1 lg:flex-none flex items-center justify-center"
                          >
                            <Save size={16} className="lg:w-3.5 lg:h-3.5" />
                            <span className="lg:hidden ml-2 uppercase text-[10px] tracking-widest">Save</span>
                          </button>
                        </div>
                      ) : stKey !== 'Sold' && (
                        <button 
                          onClick={() => restoreItem(id)}
                          className="flex items-center justify-center gap-1.5 px-6 py-3 lg:px-4 lg:py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 rounded-xl text-[10px] lg:text-[9px] font-black uppercase tracking-widest hover:text-gold transition-all w-full lg:w-auto"
                        >
                          <RotateCcw size={16} className="lg:w-3.5 lg:h-3.5" /> Restore Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
            );
          })}
      </div>
    </div>
  );
}
