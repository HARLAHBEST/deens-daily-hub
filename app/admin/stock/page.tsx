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
  getBaseItems, 
  getStatuses, 
  saveStatuses, 
  Item, 
  ItemStatus, 
  StatusMap, 
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
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Pending actions for rows
  const [pendingActions, setPendingActions] = useState<Record<string, { st: string, price: string }>>({});

  useEffect(() => {
    setItems(getBaseItems());
    setStatuses(getStatuses());
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const st = statuses[it.uid]?.st || 'In Stock';
      const matchesSearch = 
        it.desc.toLowerCase().includes(search.toLowerCase()) || 
        it.lot.toLowerCase().includes(search.toLowerCase()) ||
        it.inv.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'All' || it.cat === categoryFilter;
      const matchesStatus = statusFilter === 'All' || st === statusFilter;
      
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [items, statuses, search, categoryFilter, statusFilter]);

  const handleActionChange = (uid: string, action: string) => {
    setPendingActions(prev => ({
      ...prev,
      [uid]: { ...prev[uid], st: action }
    }));
  };

  const handlePriceChange = (uid: string, price: string) => {
    setPendingActions(prev => ({
      ...prev,
      [uid]: { ...prev[uid], price }
    }));
  };

  const saveAction = async (uid: string) => {
    const action = pendingActions[uid];
    if (!action || !action.st) return;

    const newStatuses = {
      ...statuses,
      [uid]: { 
        st: action.st as ItemStatus['st'],
        price: action.price ? parseFloat(action.price) : undefined
      }
    };
    
    setStatuses(newStatuses);
    saveStatuses(newStatuses);
    
    // Clear pending
    const nextPending = { ...pendingActions };
    delete nextPending[uid];
    setPendingActions(nextPending);
  };

  const restoreItem = (uid: string) => {
    const newStatuses = { ...statuses };
    delete newStatuses[uid];
    setStatuses(newStatuses);
    saveStatuses(newStatuses);
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

      {/* Filters Bar - Compact */}
      <div className="bg-white dark:bg-[#0f1f35] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search lot, description, invoice..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[13px] focus:ring-1 focus:ring-gold/30 dark:text-white transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[11px] font-black uppercase py-2.5 px-3 focus:ring-1 focus:ring-gold/30 dark:text-white cursor-pointer transition-all"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select 
            className="bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[11px] font-black uppercase py-2.5 px-3 focus:ring-1 focus:ring-gold/30 dark:text-white cursor-pointer transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Statuses</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        <div className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px] px-1 flex items-center justify-between">
          <span>{filteredItems.length} entries found</span>
          <span>Showing Top 50</span>
        </div>
        
        {filteredItems.slice(0, 50).map((it) => {
          const stKey = statuses[it.uid]?.st || 'In Stock';
          const config = STATUS_CONFIG[stKey as keyof typeof STATUS_CONFIG];
          const isGone = stKey !== 'In Stock' && stKey !== 'Sold';

          return (
            <div 
              key={it.uid}
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
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{it.cat}</span>
                  </div>
                  
                  <h3 className="font-black text-navy dark:text-white font-display text-base tracking-tight truncate group-hover:text-gold transition-colors">
                    {it.desc}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-white/40 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase opacity-40">Invoice</span>
                      <span className="font-mono text-navy dark:text-white">{it.inv}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase opacity-40">Cost</span>
                      <span className="text-base text-navy dark:text-gold font-display font-black leading-none">{formatCurrency(it.cost)}</span>
                    </div>
                  </div>

                  {stKey === 'Past Sold' && statuses[it.uid]?.price && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-gold/5 border border-gold/10 rounded-md text-gold font-black text-[9px] uppercase tracking-wider">
                      <TrendingDown size={12} /> SP: {formatCurrency(statuses[it.uid]!.price!)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {stKey === 'In Stock' ? (
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-1.5 rounded-xl border border-slate-100 dark:border-white/5">
                      <select 
                        className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider focus:ring-0 w-28 cursor-pointer dark:text-white outline-none"
                        value={pendingActions[it.uid]?.st || ''}
                        onChange={(e) => handleActionChange(it.uid, e.target.value)}
                      >
                        <option value="">Status</option>
                        <option value="Past Sold">Past Sold</option>
                        <option value="Lost">Lost</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Personal Use">Personal Use</option>
                      </select>
                      
                      {pendingActions[it.uid]?.st === 'Past Sold' && (
                        <div className="relative w-20">
                          <input 
                            type="number"
                            placeholder="$ Price"
                            className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] w-full px-2 py-1 font-bold focus:ring-1 focus:ring-gold/30 dark:text-white outline-none"
                            value={pendingActions[it.uid]?.price || ''}
                            onChange={(e) => handlePriceChange(it.uid, e.target.value)}
                          />
                        </div>
                      )}
 
                      <button 
                        onClick={() => saveAction(it.uid)}
                        disabled={!pendingActions[it.uid]?.st}
                        className="p-2 bg-navy dark:bg-gold text-gold dark:text-navy rounded-lg hover:scale-105 disabled:opacity-30 transition-all font-black"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  ) : stKey !== 'Sold' && (
                    <button 
                      onClick={() => restoreItem(it.uid)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-gold transition-all"
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length > 50 && (
          <div className="text-center py-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Showing top 50 items. Narrow filters for more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
