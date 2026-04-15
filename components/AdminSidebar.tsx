'use client';

import React from 'react';
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
  CreditCard
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, label, collapsed, active }) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-gold text-navy shadow-lg shadow-gold/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-navy dark:hover:text-gold'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    {!collapsed && (
      <span className="font-bold whitespace-nowrap overflow-hidden text-[10px] uppercase tracking-wider">
        {label}
      </span>
    )}
  </Link>
);

const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { href: '/admin/stock', icon: <Package size={20} />, label: 'Stock Tracker' },
    { href: '/admin/sales', icon: <ShoppingBag size={20} />, label: 'Sales' },
    { href: '/admin/expenses', icon: <CreditCard size={20} />, label: 'Expenses' },
    { href: '/admin/analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
    { href: '/admin/referrals', icon: <Users size={20} />, label: 'Referrals' },
    { href: '/admin/data', icon: <Database size={20} />, label: 'Data & Backup' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-navy dark:bg-[#060d18] border-r border-white/5 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-navy font-black font-display">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white font-display tracking-tight">Deen's Hub</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Admin Panel</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-navy font-black font-display mx-auto">
            D
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-7 w-6 h-6 bg-navy dark:bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-gold shadow-sm transition-all hidden md:flex`}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href}
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
          {!collapsed && <span className="font-bold text-[10px] uppercase tracking-wider">Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
