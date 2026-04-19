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
      
      {/* Compact Global Footer */}
      <footer className="py-8 bg-[#060d18] border-t border-white/5 pb-24 md:pb-8">
        <div className="container mx-auto px-6 text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-navy-light rounded-xl flex items-center justify-center text-gold text-xl font-black font-display">D</div>
            <span className="text-[10px] text-white/40 font-black uppercase tracking-[2px]">Deens Daily Hub &bull; Regina, SK</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-[9px] font-black text-white/20 uppercase tracking-[2px]">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/#categories" className="hover:text-gold transition-colors">Dept</Link>
            <Link href="/#items" className="hover:text-gold transition-colors">Stock</Link>
            <p className="border-t border-white/5 pt-4 w-full">&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
