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
  const [isHotDealsVisible, setIsHotDealsVisible] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      let dbItems = [];
      try {
        const res = await fetch('/api/items');
        if (res.ok) {
          dbItems = await res.json();
        }
      } catch (e) {
        console.error('Failed to load DB items', e);
      }
      setItems([...getBaseItems(), ...dbItems]);
    };
    loadItems();
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
  const displayedItems = filteredItems.slice(0, page * ITEMS_PER_PAGE);

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
              <div key={it.uid} className="bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-[#0f1f35] rounded-3xl border border-rose-100 dark:border-rose-900/30 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group relative">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10">
                  HOT
                </div>
                <div className="aspect-[4/3] bg-white dark:bg-white/5 relative flex items-center justify-center overflow-hidden">
                   {it.image ? (
                     <img src={it.image} alt={it.desc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                       {CATEGORIES_W_ICONS.find(c => c.name === it.cat)?.icon || '📦'}
                     </div>
                   )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-xs font-black text-navy dark:text-white uppercase tracking-tight line-clamp-2 mb-3 h-8">
                    {it.desc}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black font-display text-rose-600">{formatCurrency(it.cost)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>

        {/* Browse Departments - (Image 2 Style) */}
        <section id="categories" className="px-4 pt-4 pb-6 bg-white dark:bg-[#060d18] border-y border-slate-100 dark:border-white/5 mt-2">
          <h2 className="text-sm font-black text-navy dark:text-white mb-3 tracking-tight uppercase">Departments</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 md:gap-3">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`flex flex-col items-center justify-center p-1.5 aspect-square rounded-xl border transition-all ${
                activeCategory === 'All' 
                ? 'bg-gold/10 border-gold shadow-sm' 
                : 'bg-slate-50 dark:bg-white/5 border-transparent'
              }`}
            >
              <span className="text-xl md:text-2xl mb-0.5">🏪</span>
              <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-wider text-navy dark:text-white/60">All</span>
            </button>
            {CATEGORIES_W_ICONS.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setPage(1);
                }}
                className={`flex flex-col items-center justify-center p-1.5 aspect-square rounded-xl border transition-all ${
                  activeCategory === cat.name 
                  ? 'bg-gold/10 border-gold shadow-sm' 
                  : `${cat.bg} dark:bg-white/5 border-transparent`
                }`}
              >
                <span className="text-xl md:text-2xl mb-0.5">{cat.icon}</span>
                <span className="text-[7px] md:text-[9px] font-black uppercase text-center leading-tight text-navy dark:text-white/60 w-full whitespace-nowrap overflow-hidden text-ellipsis px-0.5">
                   {cat.name.split(' & ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Inventory Section - Compact List */}
        <section id="items" className="px-4 py-8">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight italic">
               {activeCategory === 'All' ? 'Inventory' : activeCategory}
             </h2>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredItems.length} Products</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {displayedItems.map((it) => (
              <div key={it.uid} className="bg-white dark:bg-[#0f1f35] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group">
                <div className="aspect-square bg-slate-50 dark:bg-white/5 relative flex items-center justify-center overflow-hidden">
                   {it.image ? (
                     <img src={it.image} alt={it.desc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <div className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                       {CATEGORIES_W_ICONS.find(c => c.name === it.cat)?.icon || '📦'}
                     </div>
                   )}
                   <div className="absolute top-3 left-3 flex gap-1 z-10">
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-sm">In Stock</span>
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

          {filteredItems.length > displayedItems.length ? (
            <div className="flex justify-center mt-8">
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-8 py-3 bg-slate-100 dark:bg-white/5 text-navy dark:text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-sm"
              >
                View More
              </button>
            </div>
          ) : displayedItems.length > 0 && activeCategory !== 'All' ? (
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
        <section id="how" className="py-12 bg-[#0f1f35] text-white text-center border-t border-white/5 mt-6 mb-12">
           <h2 className="text-xl font-black font-display uppercase tracking-tight italic mb-8">How It Works</h2>
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
