'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Zap, 
  TrendingDown, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { getBaseItems, getStatuses, Item } from '@/lib/data-service';

const CATEGORIES_W_ICONS = [
  { name: 'Clothing', icon: '👕', bg: 'bg-blue-50' },
  { name: 'Home & Kitchen', icon: '🏠', bg: 'bg-orange-50' },
  { name: 'Health & Beauty', icon: '💆', bg: 'bg-pink-50' },
  { name: 'Electronics', icon: '📱', bg: 'bg-slate-50' },
  { name: 'Baby & Kids', icon: '🍼', bg: 'bg-blue-50' },
  { name: 'Tools', icon: '🛠️', bg: 'bg-slate-100' },
  { name: 'Other', icon: '🎲', bg: 'bg-slate-50' }
];

const ITEMS_PER_PAGE = 10;

export default function LandingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [statuses, setStatuses] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setItems(getBaseItems());
    setStatuses(getStatuses());
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const st = statuses[it.uid]?.st || 'In Stock';
      if (st !== 'In Stock') return false;
      
      const matchesSearch = it.desc.toLowerCase().includes(search.toLowerCase()) || 
                           it.lot.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || it.cat === activeCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [items, statuses, search, activeCategory]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const displayedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="bg-slate-50 dark:bg-[#060d18] min-h-screen">
      {/* Search Header - Compact (Shrunk the circled area) */}
      <div className="bg-[#0f1f35] pt-12 pb-6 px-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-md mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search items, brands..."
            className="w-full pl-11 pr-4 py-3 bg-white/10 text-white border-none rounded-full text-sm focus:ring-1 focus:ring-gold transition-all outline-none placeholder:text-white/30"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <main className="pb-32">
        {/* Browse Departments - (Image 2 Style) */}
        <section className="px-4 pt-6 pb-8 bg-white dark:bg-[#060d18] border-b border-slate-100 dark:border-white/5">
          <h2 className="text-xl font-black text-navy dark:text-white mb-4 tracking-tight">Browse departments</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                activeCategory === 'All' 
                ? 'bg-gold/10 border-gold shadow-sm' 
                : 'bg-slate-50 dark:bg-white/5 border-transparent'
              }`}
            >
              <span className="text-2xl mb-1">🏪</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy dark:text-white/60">All</span>
            </button>
            {CATEGORIES_W_ICONS.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setPage(1);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-gold/10 border-gold shadow-sm' 
                  : `${cat.bg} dark:bg-white/5 border-transparent`
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-[9px] font-black uppercase text-center leading-tight text-navy dark:text-white/60 truncate w-full">
                   {cat.name.split(' & ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Inventory Section - Compact List */}
        <section className="px-4 py-8">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight italic">
               {activeCategory === 'All' ? 'Inventory' : activeCategory}
             </h2>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredItems.length} Products</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {displayedItems.map((it) => (
              <div key={it.uid} className="bg-white dark:bg-[#0f1f35] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group">
                <div className="aspect-square bg-slate-50 dark:bg-white/5 relative flex items-center justify-center">
                   <div className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                     {CATEGORIES_W_ICONS.find(c => c.name === it.cat)?.icon || '📦'}
                   </div>
                   <div className="absolute top-3 left-3 flex gap-1">
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full uppercase tracking-widest">In Stock</span>
                   </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{it.cat}</p>
                  <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-tight line-clamp-2 mb-4 h-8">
                    {it.desc}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-lg font-black font-display text-navy dark:text-gold">{formatCurrency(it.cost)}</span>
                    <a 
                      href={`https://wa.me/14385403074?text=${encodeURIComponent(`Hi, I'm interested in Lot ${it.lot}: ${it.desc}`)}`}
                      target="_blank"
                      className="p-2 bg-navy dark:bg-white/5 text-gold rounded-xl hover:bg-gold hover:text-navy transition-all"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-4xl mb-4 opacity-20">🔍</div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching items found</p>
            </div>
          )}
        </section>
      </main>

      {/* Persistent Bottom Nav / Pagination (Refined Footer) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#060d18]/95 border-t border-slate-200 dark:border-white/5 z-50 py-4 px-6 flex items-center justify-center">
        <div className="max-w-md w-full flex items-center justify-between">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 bg-slate-100 dark:bg-white/10 rounded-2xl text-navy dark:text-white disabled:opacity-20 transition-all hover:bg-gold hover:text-navy"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-navy dark:text-white uppercase tracking-[2px]">
              Page {page} / {totalPages || 1}
            </span>
            <div className="flex gap-1 mt-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${page === i + 1 ? 'bg-gold w-3' : 'bg-slate-300 dark:bg-white/10'} transition-all`} />
              ))}
            </div>
          </div>

          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-3 bg-slate-100 dark:bg-white/10 rounded-2xl text-navy dark:text-white disabled:opacity-20 transition-all hover:bg-gold hover:text-navy"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>

      {/* Condensed Contact Section (Addressing "Contact us and the page is too long") */}
      <section id="contact" className="py-20 bg-navy px-4 text-center border-t border-white/5 mb-24">
         <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight italic">Hub Contact</h2>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Regina's Premium Liquidators</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <a href="https://wa.me/14385403074" className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-lg">
                 <MessageCircle size={16} /> WhatsApp
               </a>
               <a href="https://m.me/yourpage" className="flex items-center justify-center gap-2 py-4 bg-[#1877F2] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-lg">
                 Messenger
               </a>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase text-white/20 pt-4">
               <Link href="/admin" className="hover:text-gold transition-colors">Admin Portal</Link>
               <span>&bull;</span>
               <span>Regina, SK</span>
            </div>
         </div>
      </section>
    </div>
  );
}
