import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  MessageCircle, 
  Menu, 
  X,
  Flame,
  Globe
} from 'lucide-react';

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#0f1f35] text-white/50 text-[11px] font-medium text-center py-2 px-4">
        🇨🇦 Serving <b className="text-gold">Regina, SK</b> &nbsp;&middot;&nbsp; New stock every <b>week</b> &nbsp;&middot;&nbsp; Local pickup only
      </div>

      <header 
        className={`sticky top-0 z-[100] transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-[#060d18]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2' 
            : 'bg-white dark:bg-[#060d18] border-b border-white/5 py-3'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Compact */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 bg-navy dark:bg-navy-light rounded-lg flex items-center justify-center text-gold text-base font-black font-display shadow-lg">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs tracking-tight text-navy dark:text-white leading-none font-display uppercase">
                  Deens Daily Hub
                </span>
                <span className="text-[9px] font-bold text-slate-400 dark:text-white/40 tracking-tight">
                  Regina
                </span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search boots, appliances, electronics..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
              />
            </div>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-6 shrink-0 ml-4">
              <Link href="/#categories" className="text-[11px] font-black uppercase text-slate-500 hover:text-gold dark:text-white/60 dark:hover:text-gold transition-colors tracking-[2px]">Categories</Link>
              <Link href="/#items" className="text-[11px] font-black uppercase text-slate-500 hover:text-gold dark:text-white/60 dark:hover:text-gold transition-colors tracking-[2px]">Inventory</Link>
              <Link href="/#how" className="text-[11px] font-black uppercase text-slate-500 hover:text-gold dark:text-white/60 dark:hover:text-gold transition-colors tracking-[2px]">How it Works</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
              <Link 
                href="/#hot" 
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-[11px] font-black uppercase rounded-full hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
              >
                <Flame size={14} /> Hot Deals
              </Link>
              

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-navy dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#060d18] border-b border-slate-200 dark:border-white/10 transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100 py-6 shadow-2xl' : 'max-h-0 opacity-0'
        }`}>
          <nav className="flex flex-col container mx-auto px-6 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search items..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-base"
              />
            </div>
            
            <div className="grid grid-cols-1">
              <Link href="/#hot" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-2xl font-bold">
                <Flame size={20} /> Hot Deals
              </Link>
            </div>
            
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <Link href="/#categories" onClick={() => setIsMenuOpen(false)} className="text-xl font-black font-display text-navy dark:text-white uppercase tracking-tight">Browse Categories</Link>
              <Link href="/#items" onClick={() => setIsMenuOpen(false)} className="text-xl font-black font-display text-navy dark:text-white uppercase tracking-tight">All Inventory</Link>
              <Link href="/#how" onClick={() => setIsMenuOpen(false)} className="text-xl font-black font-display text-navy dark:text-white uppercase tracking-tight">How it Works</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default PublicNav;
