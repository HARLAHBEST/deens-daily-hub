'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  Wallet,
  ArrowDownCircle,
  TrendingDown,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { Expense } from '@/lib/data-service';

const EXPENSE_CATS = ["Packaging", "Fuel/Transport", "Phone/Internet", "Marketplace Fees", "Storage/Rent", "Supplies", "Marketing", "Bank Fees", "Other"];
const PAY_METHODS = ["Cash", "Debit", "Credit Card", "E-Transfer", "Other"];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(EXPENSE_CATS[0]);
  const [method, setMethod] = useState('E-Transfer');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch('/api/expenses');
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (e) {
        console.error('Failed to fetch expenses', e);
      }
    };
    fetchExpenses();
  }, []);

  const startEdit = (exp: any) => {
    setEditingId(exp._id);
    setDesc(exp.description);
    setAmount(exp.amount.toString());
    setDate(exp.date);
    setCategory(exp.category);
    setMethod(exp.paymentMethod);
    setNotes(exp.notes || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDesc('');
    setAmount('');
    setNotes('');
  };

  const addExpense = async () => {
    if (!desc.trim() || !amount) return;

    const expData = {
      description: desc.trim(),
      amount: parseFloat(amount),
      date,
      category,
      paymentMethod: method,
      notes: notes.trim()
    };

    try {
      const res = await fetch('/api/expenses', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...expData } : expData),
      });
      
      if (res.ok) {
        // Refresh full list to be safe
        const refreshRes = await fetch('/api/expenses');
        const data = await refreshRes.json();
        setExpenses(data);
        cancelEdit();
      }
    } catch (e) {
      console.error('Failed to save expense', e);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExpenses(prev => prev.filter(e => (e as any)._id !== id));
      }
    } catch (e) {
      console.error('Failed to delete expense', e);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full mb-3">
             <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
             <span className="text-[9px] font-black text-gold uppercase tracking-[2px]">Operations Ledger</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-navy dark:text-white flex items-center gap-3 font-display uppercase leading-none">
            <CreditCard size={32} className="text-gold" /> Expense Tracker
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-2 font-bold text-sm">
            Monitor business outflows and maintain operational overhead records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#0f1f35] p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
            <h2 className="text-2xl font-black mb-8 dark:text-white font-display uppercase tracking-tight">
              {editingId ? 'Update Expense' : 'Add Expense'}
            </h2>

            {editingId && (
              <div className="bg-gold/10 p-4 rounded-2xl border border-gold/20 flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-gold uppercase tracking-widest">Editing Entry</span>
                <button onClick={cancelEdit} className="text-[10px] font-black text-navy dark:text-white uppercase tracking-widest hover:underline">Cancel</button>
              </div>
            )}
            
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Description *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shipping supplies"
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none text-sm font-bold transition-all"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Amount *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none text-sm font-bold transition-all"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none text-sm font-bold transition-all appearance-none"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Category</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none text-sm font-bold transition-all cursor-pointer appearance-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">Payment Method</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold dark:text-white outline-none text-sm font-bold transition-all cursor-pointer appearance-none"
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                >
                  {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <button 
              onClick={addExpense}
              className="w-full bg-navy dark:bg-gold text-white dark:text-navy font-black py-5 rounded-[20px] transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs uppercase tracking-[3px]"
            >
              {editingId ? 'Update Ledger Entry' : 'Log Expense'}
            </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-navy rounded-[40px] p-8 text-white relative overflow-hidden group">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[2px] mb-2">Total Outflow</p>
              <p className="text-5xl font-black text-gold font-display">{formatCurrency(totalExpenses)}</p>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                {expenses.length} Operational entries
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>
            
            <div className="bg-white dark:bg-[#0f1f35] p-8 rounded-[40px] border border-slate-200 dark:border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-3xl flex items-center justify-center">
                <PieChart size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px] mb-1">Top Overhead</p>
                <p className="text-2xl font-black dark:text-white font-display uppercase tracking-tight truncate max-w-[180px]">
                  {expenses.length > 0 
                    ? [...new Set(expenses.map(e => e.category))].sort((a,b) => 
                        expenses.filter(e => e.category === b).reduce((s,x) => s+x.amount, 0) - 
                        expenses.filter(e => e.category === a).reduce((s,x) => s+x.amount, 0)
                      )[0]
                    : 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight dark:text-white">Recent Payouts</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-1">{expenses.length} total entries</p>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest"
                >
                  Prev
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-navy dark:bg-black text-white rounded-xl border border-gold/20">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-gold">Page</span>
                  <span className="text-xs font-black font-display text-gold">{currentPage}</span>
                </div>
                <button 
                  disabled={currentPage >= Math.ceil(expenses.length / itemsPerPage)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {expenses.length === 0 ? (
                <div className="p-20 md:p-32 text-center text-slate-400">
                  <div className="text-4xl md:text-6xl mb-4 md:mb-6 opacity-10 italic">EMPTY</div>
                  <h3 className="font-bold uppercase tracking-widest text-[8px] md:text-[10px]">No records found</h3>
                </div>
              ) : (
                expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((exp: any) => (
                  <div key={exp._id || exp.id} className="p-4 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-4">
                    <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                      <div className="hidden sm:flex w-12 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-gold group-hover:bg-gold/10 transition-all rounded-2xl flex items-center justify-center shrink-0">
                        <ArrowDownCircle size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-navy dark:text-white text-sm md:text-base font-display uppercase tracking-tight truncate">{exp.description}</h4>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 md:mt-1.5">
                          <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{exp.date}</span>
                          <span className="hidden xs:block w-0.5 h-0.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                          <span className="text-[8px] md:text-[9px] font-black text-gold uppercase tracking-widest">{exp.category}</span>
                          <span className="hidden xs:block w-0.5 h-0.5 rounded-full bg-slate-200 dark:bg-white/10"></span>
                          <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{exp.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-50 dark:border-white/5">
                      <p className="text-xl md:text-2xl font-black text-rose-500 font-display">{formatCurrency(exp.amount)}</p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => startEdit(exp)}
                          className="p-2 text-slate-300 hover:text-gold hover:bg-gold/5 rounded-xl transition-all"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button 
                          onClick={() => deleteExpense(exp._id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
