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
import { Item } from '@/lib/data-service';

const CATEGORIES_W_ICONS = [
  { name: 'Clothing', icon: '👕', bg: 'bg-blue-50' },
  { name: 'Home & Kitchen', icon: '🏠', bg: 'bg-orange-50' },
  { name: 'Health & Beauty', icon: '💆', bg: 'bg-pink-50' },
  { name: 'Electronics', icon: '📱', bg: 'bg-slate-50' },
  { name: 'Baby & Kids', icon: '🍼', bg: 'bg-blue-50' },
  { name: 'Tools', icon: '🛠️', bg: 'bg-slate-100' },
  { name: 'Other', icon: '🎲', bg: 'bg-slate-50' }
];

const ITEMS_PER_PAGE = 5;

export default function LandingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [statuses, setStatuses] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [isHotDealsVisible, setIsHotDealsVisible] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const res = await fetch('/api/items');
        if (res.ok) {
          const dbItems = await res.json();
          setItems(dbItems);
        }
      } catch (e) {
        console.error('Failed to load DB items', e);
      }
    };
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const st = it.status || 'In Stock';
      if (st !== 'In Stock') return false;
      
      const matchesSearch = (it.description || '').toLowerCase().includes(search.toLowerCase()) || 
                           (it.lot || '').toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || it.category === activeCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [items, statuses, search, activeCategory]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const el = document.getElementById('items');
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#060d18] min-h-screen">
      {/* Search Header - Compact */}
      <div className="bg-[#0f1f35] pt-12 pb-6 px-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-md mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search items, brands..."
            className="w-full pl-11 pr-4 py-3 bg-white/10 text-white border-none rounded-full text-sm focus:ring-1 focus:ring-gold transition-all outline-none placeholder:text-white/30 font-medium"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <main className="pb-32">
        {/* Hot Deals Section */}
        <section id="hot" className="px-4 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-black text-rose-600 dark:text-rose-500 uppercase tracking-tight italic flex items-center gap-2">
               <Zap size={20} className="text-rose-500" fill="currentColor" />
               Hot Deals
             </h2>
             {filteredItems.length > 0 && (
               <button 
                 onClick={() => setIsHotDealsVisible(!isHotDealsVisible)} 
                 className="text-[10px] font-black bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500 px-3 py-1 rounded-full uppercase tracking-wider transition-all active:scale-95"
               >
                 {isHotDealsVisible ? 'Hide' : 'Show'}
               </button>
             )}
          </div>
          {isHotDealsVisible && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 transition-all duration-300">
              {filteredItems.slice(0, 4).map((it) => (
              <div key={it.uid} className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-[#0f1f35] rounded-[32px] border border-rose-100 dark:border-rose-900/30 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group relative">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl z-10">
                  HOT
                </div>
                <div className="aspect-[4/3] bg-white dark:bg-white/5 relative flex items-center justify-center overflow-hidden">
                   {it.image ? (
                     <img src={it.image} alt={it.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   ) : (
                     <div className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                       {CATEGORIES_W_ICONS.find(c => c.name === it.category)?.icon || '📦'}
                     </div>
                   )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-tight line-clamp-2 mb-3 h-8 leading-tight">
                    {it.description}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black font-display text-rose-600">
                      {it.bidPrice ? formatCurrency(it.bidPrice) : '**'}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-300">Clearance</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Browse Departments */}
        <section id="categories" className="px-4 pt-4 pb-6 bg-white dark:bg-[#060d18] border-y border-slate-100 dark:border-white/5 mt-2">
          <h2 className="text-sm font-black text-navy dark:text-white mb-3 tracking-tight uppercase px-1">Departments</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            <button 
              onClick={() => { setActiveCategory('All'); setPage(1); }}
              className={`flex flex-col items-center justify-center p-2 aspect-square rounded-2xl border transition-all ${
                activeCategory === 'All' 
                ? 'bg-gold/10 border-gold shadow-sm scale-[1.02]' 
                : 'bg-slate-50 dark:bg-white/5 border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <span className="text-xl md:text-2xl mb-1">🏪</span>
              <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-wider text-navy dark:text-white/60">All</span>
            </button>
            {CATEGORIES_W_ICONS.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setPage(1);
                }}
                className={`flex flex-col items-center justify-center p-2 aspect-square rounded-2xl border transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-gold/10 border-gold shadow-sm scale-[1.02]' 
                  : `${cat.bg} dark:bg-white/5 border-transparent hover:scale-105 transition-transform`
                }`}
              >
                <span className="text-xl md:text-2xl mb-1">{cat.icon}</span>
                <span className="text-[7px] md:text-[9px] font-black uppercase text-center leading-tight text-navy dark:text-white/60 w-full whitespace-nowrap overflow-hidden text-ellipsis px-0.5">
                   {cat.name.split(' & ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Inventory Section */}
        <section id="items" className="px-4 py-8">
          <div className="flex items-center justify-between mb-8">
             <div className="space-y-1">
               <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight italic leading-none">
                 {activeCategory === 'All' ? 'Inventory' : activeCategory}
               </h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                 {filteredItems.length} Products Available
               </p>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {displayedItems.map((it) => (
              <div key={it.uid} className="bg-white dark:bg-[#0f1f35] rounded-[32px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col group relative">
                <div className="aspect-[4/5] bg-slate-50 dark:bg-white/5 relative flex items-center justify-center overflow-hidden">
                   {it.image ? (
                     <img src={it.image} alt={it.description} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="text-6xl opacity-20 group-hover:scale-125 transition-transform duration-700 grayscale">
                       {CATEGORIES_W_ICONS.find(c => c.name === it.category)?.icon || '📦'}
                     </div>
                   )}
                   <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-white/90 dark:bg-navy/90 backdrop-blur-md text-navy dark:text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-xl border border-slate-100 dark:border-white/10">
                        In Stock
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[2px]">{it.category}</span>
                    <span className="text-[8px] font-bold text-gold bg-gold/5 px-2 py-0.5 rounded-full border border-gold/10">Lot {it.lot}</span>
                  </div>
                  <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-tight line-clamp-3 mb-6 h-12 leading-tight">
                    {it.description}
                  </h3>
                  
                  <div className="mt-auto pt-5 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-xl font-black font-display text-navy dark:text-gold tracking-tight">
                      {it.bidPrice ? formatCurrency(it.bidPrice) : '**'}
                    </span>
                    <a 
                      href={`https://wa.me/14385403074?text=${encodeURIComponent(`Hi, I'm interested in Lot ${it.lot}: ${it.description}`)}`}
                      target="_blank"
                      className="w-10 h-10 flex items-center justify-center bg-navy dark:bg-white/10 text-gold rounded-full hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-90"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <div className="py-32 text-center">
              <div className="text-6xl mb-6 animate-bounce">🔍</div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-[4px]">No results found</p>
              <button 
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="mt-6 px-6 py-2 bg-gold text-navy rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#0f1f35] rounded-2xl border border-slate-200 dark:border-white/5 disabled:opacity-30 disabled:pointer-events-none hover:border-gold transition-all shadow-sm"
                >
                  <ChevronLeft size={20} className="text-navy dark:text-white" />
                </button>

                <div className="flex items-center gap-1.5 px-4 h-12 bg-white dark:bg-[#0f1f35] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = page;
                    if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;

                    if (pageNum <= 0 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                          page === pageNum 
                            ? 'bg-gold text-navy shadow-lg' 
                            : 'text-slate-400 hover:text-navy dark:hover:text-gold'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#0f1f35] rounded-2xl border border-slate-200 dark:border-white/5 disabled:opacity-30 disabled:pointer-events-none hover:border-gold transition-all shadow-sm"
                >
                  <ChevronRight size={20} className="text-navy dark:text-white" />
                </button>
              </div>
              
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[3px]">
                Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length}
              </p>
            </div>
          )}

          {filteredItems.length > 0 && page === totalPages && activeCategory !== 'All' ? (
            (() => {
              const currentCatIndex = CATEGORIES_W_ICONS.findIndex(c => c.name === activeCategory);
              const nextCat = currentCatIndex >= 0 && currentCatIndex < CATEGORIES_W_ICONS.length - 1 ? CATEGORIES_W_ICONS[currentCatIndex + 1] : null;
              if (nextCat) {
                return (
                  <div className="flex justify-center mt-8">
                    <button 
                      onClick={() => {
                        setActiveCategory(nextCat.name);
                        setPage(1);
                        const el = document.getElementById('items');
                        if (el) {
                          window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                        }
                      }}
                      className="px-6 py-3 bg-gold text-navy rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg"
                    >
                      Next {nextCat.name.split(' & ')[0]} <ArrowRight size={16} />
                    </button>
                  </div>
                );
              }
              return null;
            })()
          ) : null}
        </section>

        {/* How It Works */}
        <section id="how" className="py-8 bg-[#0f1f35] text-white text-center border-t border-white/5 mt-4 mb-8">
           <h2 className="text-xl font-black font-display uppercase tracking-tight italic mb-6">How It Works</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6">
             <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mb-4 text-gold shadow-lg border border-white/10">1</div>
                <h3 className="font-black uppercase tracking-widest mb-2 text-xs">Find Your Deal</h3>
                <p className="text-white/50 text-[10px] font-medium leading-relaxed max-w-[200px]">Browse our carefully curated inventory with transparent clearance prices.</p>
             </div>
             <div className="flex flex-col items-center relative">
                <div className="hidden md:block absolute top-6 -left-12 w-24 h-[1px] bg-white/10"></div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mb-4 text-gold shadow-lg border border-white/10 relative z-10">2</div>
                <h3 className="font-black uppercase tracking-widest mb-2 text-xs">Contact Us</h3>
                <p className="text-white/50 text-[10px] font-medium leading-relaxed max-w-[200px]">Message us on WhatsApp to lock in your reservation instantly.</p>
             </div>
             <div className="flex flex-col items-center relative">
                <div className="hidden md:block absolute top-6 -left-12 w-24 h-[1px] bg-white/10"></div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl mb-4 text-gold shadow-lg border border-white/10 relative z-10">3</div>
                <h3 className="font-black uppercase tracking-widest mb-2 text-xs">Local Pickup</h3>
                <p className="text-white/50 text-[10px] font-medium leading-relaxed max-w-[200px]">Schedule a seamless and friendly pickup in Regina, Saskatchewan.</p>
             </div>
           </div>
        </section>
      </main>



      {/* Condensed Contact Section (Addressing "Contact us and the page is too long") */}
      <section id="contact" className="py-10 bg-navy px-4 text-center border-t border-white/5 mb-8">
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
