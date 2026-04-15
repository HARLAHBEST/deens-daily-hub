'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Star, 
  ShieldCheck, 
  Zap,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  TrendingDown,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { getBaseItems, getStatuses, Item, Category } from '@/lib/data-service';

const CATEGORIES: { id: Category, name: string, emoji: string, color: string }[] = [
  { id: 'Clothing', name: 'Boots & Shoes', emoji: '👟', color: 'bg-amber-500' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen', emoji: '🏠', color: 'bg-blue-500' },
  { id: 'Health & Beauty', name: 'Health & Beauty', emoji: '💆', color: 'bg-rose-500' },
  { id: 'Electronics', name: 'Electronics', emoji: '📱', color: 'bg-indigo-500' },
  { id: 'Baby & Kids', name: 'Baby & Kids', emoji: '🍼', color: 'bg-emerald-500' },
  { id: 'Tools', name: 'Tools & Auto', emoji: '🔧', color: 'bg-slate-500' },
  { id: 'Other', name: 'Other Items', emoji: '📦', color: 'bg-orange-500' }
];

export default function LandingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [statuses, setStatuses] = useState<Record<string, any>>({});
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    const baseItems = getBaseItems();
    const st = getStatuses();
    const inStock = baseItems.filter(it => !st[it.uid] || st[it.uid].st === 'In Stock');
    setItems(inStock);
    setStatuses(st);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchesSearch = it.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === 'All' || it.cat === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [items, search, activeCategory]);

  const hotDeals = useMemo(() => {
    return items.slice(0, 4); 
  }, [items]);

  const getWaLink = (desc: string) => {
    const wa = '14385403074';
    return `https://wa.me/${wa}?text=${encodeURIComponent(`Hi Deen! I'm interested in: ${desc}. Is it still available?`)}`;
  };

  return (
    <div className="bg-[#f7f9fc] dark:bg-[#060d18]">
      {/* Hero Section */}
      <section className="relative bg-navy overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-[radial-gradient(ellipse_at_80%_50%,rgba(240,165,0,0.1),transparent_70%)] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 pt-16 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div className="pb-16 lg:pb-24 space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                <span className="text-[10px] font-black text-gold uppercase tracking-[2px]">New arrivals every week</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] font-display uppercase tracking-tight">
                Quality Items.<br />
                <span className="text-gold">Great Prices.</span><br />
                Regina Pickup.
              </h1>
              
              <p className="max-w-md text-white/50 text-base leading-relaxed">
                New & used boots, appliances, home goods, baby items, and more — sourced weekly, priced to move. No shipping, just fast local pickup.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href={getWaLink('General Inquiry')} target="_blank" className="flex items-center gap-2 px-6 py-3.5 bg-[#25D366] text-white font-bold rounded-2xl shadow-xl shadow-[#25D366]/20 hover:-translate-y-0.5 transition-all text-sm">
                  <MessageCircle size={18} /> WhatsApp Us
                </a>
                <button 
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3.5 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-sm"
                >
                  Browse Catalog
                </button>
              </div>

              <div className="flex border border-white/10 rounded-2xl overflow-hidden bg-white/5 max-w-sm">
                <div className="flex-1 p-4 text-center border-r border-white/10">
                  <div className="text-2xl font-black text-gold font-display">{items.length}</div>
                  <div className="text-[9px] text-white/30 uppercase font-black tracking-wider">In Stock</div>
                </div>
                <div className="flex-1 p-4 text-center border-r border-white/10">
                  <div className="text-2xl font-black text-gold font-display">164</div>
                  <div className="text-[9px] text-white/30 uppercase font-black tracking-wider">Invoices</div>
                </div>
                <div className="flex-1 p-4 text-center">
                  <div className="text-2xl font-black text-gold font-display font-display leading-none mt-1">
                    <Star size={20} className="mx-auto" />
                  </div>
                  <div className="text-[9px] text-white/30 uppercase font-black tracking-wider mt-2">Verified</div>
                </div>
              </div>
            </div>

            {/* Mosaic - Hidden on mobile, grid on desktop */}
            <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3 h-[500px]">
              <div className="row-span-2 bg-white/5 rounded-t-3xl border-x border-t border-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60 z-10"></div>
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-[10px] bg-gold text-navy font-black px-3 py-1 rounded-full uppercase mb-2 inline-block">Featured</span>
                  <h3 className="text-white font-black text-2xl font-display uppercase italic">Boots & Shoes</h3>
                </div>
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform duration-700">👟</div>
              </div>
              <div className="bg-white/5 rounded-tr-3xl border-r border-t border-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60 z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-white font-black text-lg font-display uppercase">Home Goods</h3>
                </div>
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 group-hover:scale-110 transition-transform duration-700">🏠</div>
              </div>
              <div className="bg-white/5 border-r border-white/10 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-60 z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-white font-black text-lg font-display uppercase">Beauty</h3>
                </div>
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 group-hover:scale-110 transition-transform duration-700">💆</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-gold py-3 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          {[...Array(20)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="mx-8 text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                <Star size={10} className="fill-navy" /> New Stock Weekly
              </span>
              <span className="mx-8 text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                <Star size={10} className="fill-navy" /> Regina SK
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Trust Row */}
      <div className="bg-white dark:bg-[#060d18] border-b border-slate-200 dark:border-white/5 py-4">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[800px] gap-4">
            {[
              { icon: <CheckCircle2 size={14} />, label: "Quality checked" },
              { icon: <MapPin size={14} />, label: "Regina Pickup" },
              { icon: <Clock size={14} />, label: "New Stock Weekly" },
              { icon: <MessageCircle size={14} />, label: "Fast Response" },
              { icon: <TrendingDown size={14} />, label: "Negotiable Prices" },
              { icon: <Zap size={14} />, label: "Cash & E-Transfer" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-white/40 whitespace-nowrap">
                <span className="text-gold">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section id="categories" className="py-24 bg-slate-50 dark:bg-[#08111e]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span className="text-[10px] font-black text-gold uppercase tracking-[2px]">Real-time Inventory</span>
              </div>
              <h2 className="text-5xl font-black text-navy dark:text-white font-display uppercase tracking-tight leading-none italic">
                The Catalog
              </h2>
              <p className="text-slate-500 dark:text-white/40 max-w-lg font-medium">Browse our current selection of verified liquidation items. Pickup in Regina only.</p>
            </div>
            
            <div className="hidden lg:flex items-center gap-12 border-l border-slate-200 dark:border-white/10 pl-12 h-20">
              <div className="text-center">
                <p className="text-3xl font-black text-navy dark:text-gold font-display mb-1 tracking-tight">{items.length}</p>
                <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Active Units</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-navy dark:text-gold font-display mb-1 tracking-tight">{[...new Set(items.filter(i => !statuses[i.uid] || statuses[i.uid]?.st === 'In Stock').map(i => i.cat))].length}</p>
                <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">Live Segments</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`relative py-6 px-2 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 group overflow-hidden ${
                activeCategory === 'All' 
                ? 'bg-navy dark:bg-white border-gold text-white dark:text-navy shadow-2xl shadow-gold/20' 
                : 'bg-white dark:bg-[#0f1f35] border-transparent text-navy dark:text-white hover:border-gold/30 hover:-translate-y-1 shadow-sm'
              }`}
            >
              <div className={`text-3xl transition-transform group-hover:scale-110 mb-1`}>📦</div>
              <div className="flex flex-col items-center">
                <span className="font-black text-[10px] uppercase tracking-wider text-center">All Goods</span>
                <span className={`text-[9px] font-bold ${activeCategory === 'All' ? 'text-gold dark:text-navy/50' : 'text-slate-400 dark:text-white/20'}`}>
                  {items.length} Units
                </span>
              </div>
              {activeCategory === 'All' && <div className="absolute top-0 right-0 w-8 h-8 bg-gold -rotate-45 translate-x-4 -translate-y-4"></div>}
            </button>
            {CATEGORIES.map(cat => {
              const count = items.filter(i => i.cat === cat.id && (!statuses[i.uid] || statuses[i.uid]?.st === 'In Stock')).length;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative py-6 px-2 rounded-[32px] border-2 transition-all flex flex-col items-center gap-2 group overflow-hidden ${
                    activeCategory === cat.id 
                    ? 'bg-navy dark:bg-white border-gold text-white dark:text-navy shadow-2xl shadow-gold/20' 
                    : 'bg-white dark:bg-[#0f1f35] border-transparent text-navy dark:text-white hover:border-gold/30 hover:-translate-y-1 shadow-sm'
                  }`}
                >
                  <div className={`text-3xl transition-transform group-hover:scale-110 mb-1`}>{cat.emoji}</div>
                  <div className="flex flex-col items-center">
                    <span className="font-black text-[10px] uppercase tracking-wider text-center">{cat.name}</span>
                    <span className={`text-[9px] font-bold ${activeCategory === cat.id ? 'text-gold dark:text-navy/50' : 'text-slate-400 dark:text-white/20'}`}>
                      {count} Available
                    </span>
                  </div>
                  {activeCategory === cat.id && <div className="absolute top-0 right-0 w-8 h-8 bg-gold -rotate-45 translate-x-4 -translate-y-4"></div>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section id="hot" className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(240,165,0,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-gold text-[10px] font-black uppercase tracking-[2px]">This Week</span>
              <h2 className="text-4xl font-black text-white font-display uppercase tracking-tight">Hot Deals <span className="text-gold italic">🔥</span></h2>
              <p className="text-white/40 max-w-lg">Best value items right now — message fast, stock is extremely limited.</p>
            </div>
            <div className="flex items-center gap-2 bg-rose-600 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase animate-pulse shadow-lg shadow-rose-600/20">
              🔥 Limited Stock
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map((it) => (
              <div key={it.uid} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group flex flex-col">
                <div className="aspect-square bg-white shadow-inner rounded-2xl mb-6 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase">Hot</div>
                  {CATEGORIES.find(c => c.id === it.cat)?.emoji || '📦'}
                </div>
                <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-2">{it.cat}</div>
                <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-4 grow">{it.desc}</h3>
                <div className="text-3xl font-black text-white font-display mb-6">${it.cost.toFixed(0)}</div>
                <a 
                  href={getWaLink(it.desc)}
                  target="_blank"
                  className="w-full py-4 bg-gold text-navy font-black text-[12px] uppercase rounded-2xl text-center hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> Chat to Buy
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <section id="items" className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 space-y-2">
            <span className="text-gold text-[10px] font-black uppercase tracking-[2px]">Available Now</span>
            <h2 className="text-4xl font-black text-navy dark:text-white font-display uppercase tracking-tight">Full Inventory</h2>
            <p className="text-slate-500 dark:text-white/40 max-w-lg">Browse everything currently in stock. All items are available for local pickup in Regina.</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search items, brands..." 
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all dark:text-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={() => setActiveCategory('All')}
                className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === 'All' ? 'bg-navy dark:bg-white text-white dark:text-navy' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === cat.id ? 'bg-navy dark:bg-white text-white dark:text-navy' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.slice(0, visibleCount).map((it) => (
              <div key={it.uid} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-4 hover:shadow-2xl hover:shadow-navy/5 dark:hover:shadow-none hover:-translate-y-1 transition-all group flex flex-col h-full">
                <div className="aspect-square bg-slate-50 dark:bg-[#08152c] rounded-2xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform relative">
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[8px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase">Stock</span>
                  </div>
                  {CATEGORIES.find(c => c.id === it.cat)?.emoji || '📦'}
                </div>
                <div className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-1">{it.cat}</div>
                <h3 className="font-bold text-navy dark:text-white text-sm leading-snug line-clamp-2 mb-4 grow">{it.desc}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="text-xl font-black text-navy dark:text-gold">${it.cost.toFixed(0)}</div>
                  <a 
                    href={getWaLink(it.desc)}
                    target="_blank"
                    className="p-2.5 bg-navy dark:bg-white text-white dark:text-navy rounded-xl hover:bg-gold dark:hover:bg-gold transition-colors"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
              <div className="text-4xl mb-4 text-slate-300">🔍</div>
              <h3 className="text-xl font-black dark:text-white font-display uppercase">No items found</h3>
              <p className="text-slate-500 dark:text-white/40">Try searching for something else or browse categories.</p>
            </div>
          )}

          {filteredItems.length > visibleCount && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 16)}
                className="px-10 py-4 bg-navy dark:bg-white text-white dark:text-navy font-black text-xs uppercase tracking-[3px] rounded-2xl hover:bg-gold dark:hover:bg-gold transition-all shadow-xl"
              >
                Load More Inventory
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Referral Program */}
      <section id="referrals" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#061020]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(240,165,0,0.15),transparent_70%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-navy-light/10 backdrop-blur-2xl rounded-[60px] border border-white/5 p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-gold"></span>
                  <span className="text-[10px] font-black text-gold uppercase tracking-[3px]">Loyalty Rewards</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white font-display uppercase tracking-tighter leading-[0.85] italic">
                  Share the <br /><span className="text-gold">Hub Experience</span>
                </h2>
                <p className="text-white/40 max-w-lg font-bold text-sm leading-relaxed uppercase tracking-wider">
                  Refer 10 friends who make a purchase and receive a <span className="text-white">Premium Surprise Box</span> worth up to $100. It's our way of saying thanks for growing the community.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold border border-white/10"><Users size={24} /></div>
                   <div>
                     <p className="text-white font-black text-sm uppercase">Quick Entry</p>
                     <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Message us to join</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gold border border-white/10"><Gift size={24} /></div>
                   <div>
                     <p className="text-white font-black text-sm uppercase">Instant Credit</p>
                     <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">Tracked in your hub</p>
                   </div>
                 </div>
              </div>

              <div className="pt-4">
                <a href="https://wa.me/14385403074?text=Hi! I want to join the Deen's Hub Referral Program" target="_blank" className="inline-flex items-center gap-3 bg-white text-navy px-10 py-5 rounded-full font-black uppercase text-xs tracking-[3px] hover:bg-gold transition-all shadow-2xl shadow-white/5 active:scale-95">
                  Get Your Link <MessageCircle size={18} />
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/3 relative group">
              <div className="aspect-square bg-gold rounded-[60px] flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-700 shadow-2xl shadow-gold/20">
                <Gift size={120} className="text-navy animate-bounce" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-[32px] shadow-2xl -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <p className="text-navy font-black text-xs uppercase tracking-widest">Mystery Reward</p>
                <p className="text-navy/40 text-[9px] font-black uppercase tracking-widest">Value up to $100</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 bg-white dark:bg-[#08152c]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
             <div className="inline-flex items-center gap-2 bg-navy/5 dark:bg-white/5 px-4 py-1.5 rounded-full">
                <span className="text-[10px] font-black text-navy dark:text-gold uppercase tracking-[3px]">Operation Protocol</span>
              </div>
            <h2 className="text-5xl font-black text-navy dark:text-white font-display uppercase tracking-tight leading-none italic">Execution Steps</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Simple procedure for your next deal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: "01", title: "Browse & Message", desc: "Scan our real-time catalog. Message us on WhatsApp or Messenger with the items you want." },
              { num: "02", title: "Verify & Settle", desc: "We confirm the inventory is ready. Prices are often negotiable. We accept E-Transfer or Cash." },
              { num: "03", title: "Secure Handoff", desc: "Arrange a pickup window in Regina, SK. No shipping, no wait — just great products same-day." },
            ].map((step, i) => (
              <div key={i} className="group p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[40px] space-y-6 hover:border-gold/30 transition-all relative overflow-hidden">
                <div className="w-16 h-16 bg-navy dark:bg-white/5 text-gold flex items-center justify-center font-display font-black text-2xl rounded-2xl group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-xl">
                  {step.num}
                </div>
                <h3 className="text-2xl font-black text-navy dark:text-white font-display uppercase italic tracking-tight">{step.title}</h3>
                <p className="text-slate-500 dark:text-white/40 text-[13px] leading-relaxed font-bold uppercase tracking-wider">{step.desc}</p>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(240,165,0,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-gold text-[10px] font-black uppercase tracking-[2px]">Get in Touch</span>
                <h2 className="text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight leading-[0.9]">Ready to find <br /><span className="text-gold italic">something great?</span></h2>
              </div>
              <p className="text-white/50 max-w-md">Message us on any channel. Tell us what you're looking for and we'll get back to you immediately.</p>
              
              <div className="space-y-4">
                {[
                  { icon: "📍", label: "Regina, Saskatchewan, Canada" },
                  { icon: "📦", label: "Local pickup only — no shipping" },
                  { icon: "🔄", label: "New inventory every week" },
                  { icon: "💳", label: "E-transfer, cash & more" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/60 font-bold text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <a href="https://wa.me/14385403074" target="_blank" className="flex items-center justify-between p-6 bg-[#25D366] text-white rounded-3xl hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl"><MessageCircle size={24} /></div>
                  <div>
                    <div className="font-black text-sm uppercase">WhatsApp</div>
                    <div className="text-white/60 text-xs">+1 (438) 540-3074</div>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://m.me/yourpage" target="_blank" className="flex items-center justify-between p-6 bg-[#1877F2] text-white rounded-3xl hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </div>
                  <div>
                    <div className="font-black text-sm uppercase">Messenger</div>
                    <div className="text-white/60 text-xs">Message our page</div>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="sms:+14385403074" className="flex items-center justify-between p-6 bg-white/5 border border-white/10 text-white rounded-3xl hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">💬</div>
                  <div>
                    <div className="font-black text-sm uppercase">Text / SMS</div>
                    <div className="text-white/60 text-xs">+1 (438) 540-3074</div>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
