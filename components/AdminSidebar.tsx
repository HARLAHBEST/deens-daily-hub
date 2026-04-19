'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Database, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Menu,
  X
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, collapsed, active, onClick }) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gold text-navy shadow-lg shadow-gold/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-navy dark:hover:text-gold'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`font-bold whitespace-nowrap overflow-hidden text-[10px] uppercase tracking-wider transition-all duration-300 ${
      collapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'
    }`}>
      {label}
    </span>
  </Link>
);

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  const menuItems = [
    { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview' },
    { href: '/admin/stock', icon: <Package size={18} />, label: 'Stock Tracker' },
    { href: '/admin/items', icon: <Database size={18} />, label: 'Inventory DB' },
    { href: '/admin/sales', icon: <ShoppingBag size={18} />, label: 'Sales' },
    { href: '/admin/expenses', icon: <CreditCard size={18} />, label: 'Expenses' },
    { href: '/admin/analytics', icon: <TrendingUp size={18} />, label: 'Analytics' },
    { href: '/admin/referrals', icon: <Users size={18} />, label: 'Referrals' },
    { href: '/admin/data', icon: <Database size={18} />, label: 'Data Hub' },
  ];
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-[60] md:hidden p-2.5 bg-navy text-gold rounded-xl shadow-2xl border border-white/10 active:scale-95 transition-all"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 h-screen bg-navy dark:bg-[#060d18] border-r border-white/5 transition-all duration-300 z-50 flex flex-col ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 md:p-5 flex items-center justify-between">
          <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed ? 'md:opacity-0 md:scale-50' : 'opacity-100 scale-100'}`}>
            <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center text-navy font-black font-display">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-white font-display tracking-tight leading-none">Deens Daily Hub</span>
              <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold mt-0.5">Admin Panel</span>
            </div>
          </div>
          
          {collapsed && (
            <div className="hidden md:flex absolute inset-x-0 top-5 justify-center">
               <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center text-navy font-black font-display">D</div>
            </div>
          )}

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`absolute -right-3 top-6 w-5 h-5 bg-navy dark:bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-gold shadow-sm transition-all hidden md:flex`}
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              {...item}
              collapsed={collapsed}
              active={pathname === item.href}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link 
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/5 hover:text-rose-500 transition-all group`}
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className={`font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${
              collapsed ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'
            }`}>
              Exit Admin
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
