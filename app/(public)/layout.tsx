'use client';

import React from 'react';
import PublicNav from '@/components/PublicNav';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fc] dark:bg-[#060d18]">
      <PublicNav />
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Premium Footer */}
      <footer className="py-20 bg-[#060d18] border-t border-white/5">
        <div className="container mx-auto px-6 text-center space-y-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-navy-light rounded-2xl flex items-center justify-center text-gold text-2xl font-black font-display shadow-2xl">D</div>
            <div className="space-y-1">
              <span className="font-black text-white text-2xl font-display uppercase tracking-tight block">Deen's Daily Hub</span>
              <span className="text-[10px] text-gold font-black uppercase tracking-[3px]">Regina's Premium Liquidators</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <Link href="/" className="text-[11px] font-black text-white/30 hover:text-gold uppercase tracking-[2px] transition-colors">Home</Link>
            <Link href="/#categories" className="text-[11px] font-black text-white/30 hover:text-gold uppercase tracking-[2px] transition-colors">Categories</Link>
            <Link href="/#items" className="text-[11px] font-black text-white/30 hover:text-gold uppercase tracking-[2px] transition-colors">Inventory</Link>
            <Link href="/#how" className="text-[11px] font-black text-white/30 hover:text-gold uppercase tracking-[2px] transition-colors">How it works</Link>
          </div>
          
          <div className="pt-12 border-t border-white/5 space-y-4">
            <p className="text-[10px] text-white/10 font-bold uppercase tracking-[2px]">
              &copy; {new Date().getFullYear()} Deen's Daily Hub &bull; Regina, SK &bull; All Rights Reserved
            </p>
            <div className="flex items-center justify-center gap-4 opacity-20">
              <div className="w-1 h-1 rounded-full bg-white"></div>
              <div className="w-1 h-1 rounded-full bg-white"></div>
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
