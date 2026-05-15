'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Zap,
  Flame,
  LayoutGrid,
  Info,
  Smartphone,
  Watch,
  Home as HomeIcon,
  Shirt,
  HeartPulse,
  Monitor,
  Baby,
  Hammer,
  Box
} from 'lucide-react';
import { Item } from '@/lib/data-service';

const ITEMS_PER_PAGE = 8;

const DEPARTMENTS = [
  { name: 'All', icon: <LayoutGrid size={20} />, id: 'all' },
  { name: 'Clothing', icon: <Shirt size={20} />, id: 'clothing' },
  { name: 'Home', icon: <HomeIcon size={20} />, id: 'home' },
  { name: 'Health', icon: <HeartPulse size={20} />, id: 'health' },
  { name: 'Electronics', icon: <Monitor size={20} />, id: 'electronics' },
  { name: 'Baby', icon: <Baby size={20} />, id: 'baby' },
  { name: 'Tools', icon: <Hammer size={20} />, id: 'tools' },
  { name: 'Other', icon: <Box size={20} />, id: 'other' },
];

export default function LandingPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

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
      
      const matchesCategory = category === 'all' || (it.category || '').toLowerCase() === category.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [items, search, category]);

  const hotDeals = useMemo(() => {
    return items.filter(it => (it.description || '').toLowerCase().includes('hot') || it.bidPrice && it.bidPrice < 1).slice(0, 4);
  }, [items]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="bg-[#060d18] min-h-screen text-white font-sans">
      
      {/* Hot Deals Section */}
      <section id="hot" className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-[#ff2d55]">
            <Flame size={24} fill="currentColor" />
            <h2 className="text-xl font-black italic uppercase tracking-wider">Hot Deals</h2>
          </div>
          <button className="text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white transition-colors">Hide</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotDeals.map((it) => (
            <div key={it.uid} className="bg-[#0f1f35] rounded-[32px] overflow-hidden border border-white/5 relative group">
              <div className="aspect-square bg-navy relative">
                {it.image ? (
                  <img src={it.image} alt={it.description} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <ShoppingBag size={80} />
                  </div>
                )}
                <div className="absolute top-4 right-4 px-2 py-1 bg-[#ff2d55] text-white text-[9px] font-black uppercase rounded-md shadow-lg shadow-[#ff2d55]/30">Hot</div>
              </div>
              <div className="p-6">
                <h3 className="text-xs font-bold text-white/80 line-clamp-1 mb-4 uppercase tracking-tight">{it.description}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-[#ff2d55]">{formatCurrency(it.bidPrice || 0)}</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Clearance</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section id="categories" className="container mx-auto px-6 mb-12">
        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mb-8">Departments</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {DEPARTMENTS.map((dept) => (
            <button 
              key={dept.id}
              onClick={() => {
                setCategory(dept.id);
                setPage(1);
              }}
              className={`flex flex-col items-center justify-center gap-4 aspect-square rounded-[24px] border transition-all ${
                category === dept.id 
                  ? 'bg-[#1a2c42] border-gold text-gold shadow-lg shadow-gold/10' 
                  : 'bg-[#0f1f35] border-white/5 text-white/40 hover:bg-[#1a2c42] hover:text-white'
              }`}
            >
              <div className="opacity-80">{dept.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-widest">{dept.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Inventory Grid Section */}
      <section id="items" className="container mx-auto px-6 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black uppercase tracking-tighter">Inventory</h2>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{filteredItems.length} Products Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {displayedItems.map((it) => (
            <div key={it.uid} className="bg-[#0f1f35] rounded-[32px] overflow-hidden border border-white/5 flex flex-col group">
              <div className="aspect-square bg-navy relative overflow-hidden">
                {it.image ? (
                  <img src={it.image} alt={it.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <ShoppingBag size={80} />
                  </div>
                )}
                <div className="absolute top-4 right-4 px-2 py-1 bg-gold text-navy text-[9px] font-black uppercase rounded-md shadow-lg shadow-gold/20">Lot {it.lot}</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">{it.category}</span>
                <h3 className="text-xs font-bold text-white/80 line-clamp-2 mb-6 flex-1 tracking-tight">{it.description}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-gold">{formatCurrency(it.bidPrice || 0)}</span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <ShoppingBag size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-12 h-12 rounded-full bg-[#0f1f35] border border-white/5 flex items-center justify-center disabled:opacity-20 hover:bg-[#1a2c42] transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-full text-xs font-bold transition-all ${
                    page === i + 1 ? 'bg-gold text-navy' : 'bg-[#0f1f35] text-white/40 border border-white/5'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-12 h-12 rounded-full bg-[#0f1f35] border border-white/5 flex items-center justify-center disabled:opacity-20 hover:bg-[#1a2c42] transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      {/* Hub Contact Footer Section */}
      <section className="py-12 bg-[#0f1f35] border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-xl font-black uppercase tracking-wider mb-12">Hub Contact</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://wa.me/14385403074"
              target="_blank"
              className="flex items-center gap-3 px-8 py-4 bg-[#25d366] text-white font-bold rounded-2xl shadow-xl shadow-[#25d366]/20 hover:scale-105 transition-transform"
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
            <a 
              href="https://m.me/nurudeen.alabi.752"
              target="_blank"
              className="flex items-center gap-3 px-8 py-4 bg-[#0084ff] text-white font-bold rounded-2xl shadow-xl shadow-[#0084ff]/20 hover:scale-105 transition-transform"
            >
              <Zap size={20} fill="currentColor" />
              Messenger
            </a>
          </div>
          
          <div className="mt-12 text-[9px] font-bold text-white/20 uppercase tracking-[4px]">
            &copy; {new Date().getFullYear()} Deens Daily Hub &bull; Regina, SK
          </div>
        </div>
      </section>

    </div>
  );
}
