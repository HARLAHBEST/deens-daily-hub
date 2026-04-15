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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Stock Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your inventory, update statuses, and track sales.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#0f1f35] p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by lot, description or invoice..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm py-3 px-4 focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select 
            className="bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm py-3 px-4 focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        <div className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[3px] px-2 flex items-center justify-between">
          <span>{filteredItems.length} items found</span>
          <span>Showing 1-50</span>
        </div>
        
        {filteredItems.slice(0, 50).map((it) => {
          const stKey = statuses[it.uid]?.st || 'In Stock';
          const config = STATUS_CONFIG[stKey as keyof typeof STATUS_CONFIG];
          const isGone = stKey !== 'In Stock' && stKey !== 'Sold';

          return (
            <div 
              key={it.uid}
              className={`bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-3xl p-5 transition-all hover:shadow-xl hover:shadow-navy/5 dark:hover:shadow-none group ${
                isGone ? 'opacity-60 grayscale-[0.5]' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display text-[9px] font-black text-navy bg-gold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      LOT {it.lot}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[1.5px] px-2.5 py-1 rounded-full ${
                      stKey === 'In Stock' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
                      stKey.includes('Sold') ? 'bg-gold/10 text-gold-light dark:bg-gold/10 dark:text-gold' :
                      'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-white/40'
                    }`}>
                      {config.icon} {config.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{it.cat}</span>
                  </div>
                  
                  <h3 className="font-black text-navy dark:text-white font-display text-lg tracking-tight truncate group-hover:text-gold transition-colors" title={it.desc}>
                    {it.desc}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-white/40 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase opacity-50">Invoice</span>
                      <span className="font-mono text-navy dark:text-white">{it.inv}</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase opacity-50">Added</span>
                      <span className="text-navy dark:text-white">{it.date}</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] uppercase opacity-50">Cost</span>
                       <span className="text-lg text-navy dark:text-gold font-display font-black">{formatCurrency(it.cost)}</span>
                    </div>
                  </div>

                  {stKey === 'Past Sold' && statuses[it.uid]?.price && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-lg text-gold font-black text-xs uppercase tracking-wider">
                      <TrendingDown size={14} /> Sale Price: {formatCurrency(statuses[it.uid]!.price!)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {stKey === 'In Stock' ? (
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/10">
                      <select 
                        className="bg-transparent border-none text-[11px] font-black uppercase tracking-wider focus:ring-0 w-36 cursor-pointer dark:text-white"
                        value={pendingActions[it.uid]?.st || ''}
                        onChange={(e) => handleActionChange(it.uid, e.target.value)}
                      >
                        <option value="">Mark status</option>
                        <option value="Past Sold">Past Sold</option>
                        <option value="Lost">Lost</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Personal Use">Personal Use</option>
                      </select>
                      
                      {pendingActions[it.uid]?.st === 'Past Sold' && (
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input 
                            type="number"
                            placeholder="Price"
                            className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/10 rounded-xl text-xs w-full pl-5 px-2 py-1.5 font-bold focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none"
                            value={pendingActions[it.uid]?.price || ''}
                            onChange={(e) => handlePriceChange(it.uid, e.target.value)}
                          />
                        </div>
                      )}

                      <button 
                        onClick={() => saveAction(it.uid)}
                        disabled={!pendingActions[it.uid]?.st}
                        className="p-2.5 bg-gold text-navy rounded-xl hover:bg-gold-light disabled:opacity-30 transition-all font-black shadow-lg shadow-gold/10"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : stKey !== 'Sold' && (
                    <button 
                      onClick={() => restoreItem(it.uid)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all border border-transparent shadow-sm"
                    >
                      <RotateCcw size={16} /> Restore to Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length > 50 && (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">Showing first 50 items. Use filters to narrow down.</p>
          </div>
        )}
      </div>
    </div>
  );
}
