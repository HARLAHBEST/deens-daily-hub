'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'hub66') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-navy flex items-center justify-center text-gold font-black uppercase tracking-[4px]">Loading Hub...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_100%_0%,rgba(240,165,0,0.1),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-full bg-[radial-gradient(circle_at_0%_100%,rgba(240,165,0,0.05),transparent_70%)]"></div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10 space-y-4">
            <div className="w-20 h-20 bg-gold rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-gold/20 rotate-3">
              <Lock size={32} className="text-navy" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white font-display uppercase tracking-tight">Admin Access</h1>
              <p className="text-gold text-[10px] font-black uppercase tracking-[3px]">Deen's Daily Hub &bull; Restricted Area</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Terminal Password</label>
                <div className="relative group">
                  <input 
                    type="password"
                    placeholder="Enter Access Key"
                    autoFocus
                    className={`w-full px-6 py-4 bg-navy-light/50 border ${error ? 'border-rose-500' : 'border-white/10'} rounded-2xl text-white font-black text-center tracking-[4px] outline-none focus:border-gold transition-all placeholder:text-white/10`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                  />
                  {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-black text-rose-500 uppercase">Invalid Access Key</p>}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-gold text-navy rounded-2xl font-black text-xs uppercase tracking-[3px] hover:bg-white transition-all active:scale-95 shadow-xl shadow-gold/10 flex items-center justify-center gap-3 group"
              >
                Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-white/20">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <a href="/" className="inline-block text-[10px] font-black text-gold hover:text-white uppercase tracking-widest transition-colors">
              Return to Public Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#060d18]">
      <AdminSidebar />
      <main className="flex-1 transition-all duration-300 ml-20 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto pt-4 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
