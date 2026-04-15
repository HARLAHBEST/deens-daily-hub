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
  PieChart
} from 'lucide-react';
import { getExpenses, saveExpenses, Expense } from '@/lib/data-service';

const EXPENSE_CATS = ["Packaging", "Fuel/Transport", "Phone/Internet", "Marketplace Fees", "Storage/Rent", "Supplies", "Marketing", "Bank Fees", "Other"];
const PAY_METHODS = ["Cash", "Debit", "Credit Card", "E-Transfer", "Other"];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(EXPENSE_CATS[0]);
  const [method, setMethod] = useState(PAY_METHODS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const addExpense = () => {
    if (!desc.trim() || !amount) return;

    const newExp: Expense = {
      id: Date.now(),
      desc: desc.trim(),
      amount: parseFloat(amount),
      date,
      cat: category,
      pay: method,
      notes: notes.trim()
    };

    const next = [newExp, ...expenses];
    setExpenses(next);
    saveExpenses(next);

    // Reset form
    setDesc('');
    setAmount('');
    setNotes('');
  };

  const deleteExpense = (id: number) => {
    if (!confirm('Delete this expense?')) return;
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    saveExpenses(next);
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
              Add Expense
            </h2>
            
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
                className="w-full py-5 bg-gold text-navy rounded-[24px] font-black uppercase text-xs tracking-[2px] hover:bg-white transition-all shadow-xl shadow-gold/10 mt-4 active:scale-[0.98]"
              >
                Log Transaction
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
                    ? [...new Set(expenses.map(e => e.cat))].sort((a,b) => 
                        expenses.filter(e => e.cat === b).reduce((s,x) => s+x.amount, 0) - 
                        expenses.filter(e => e.cat === a).reduce((s,x) => s+x.amount, 0)
                      )[0]
                    : 'None'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black font-display uppercase tracking-tight dark:text-white">Recent Payouts</h2>
              <Wallet className="text-slate-400 opacity-20" size={24} />
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {expenses.length === 0 ? (
                <div className="p-32 text-center text-slate-400">
                  <div className="text-6xl mb-6 opacity-10 italic">EMPTY</div>
                  <h3 className="font-bold uppercase tracking-widest text-[10px]">No records found</h3>
                </div>
              ) : (
                expenses.map((e) => (
                  <div key={e.id} className="p-8 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-gold group-hover:bg-gold/10 transition-all rounded-2xl flex items-center justify-center">
                        <ArrowDownCircle size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-navy dark:text-white text-base font-display uppercase tracking-tight">{e.desc}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{e.date}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10"></span>
                          <span className="text-[9px] font-black text-gold uppercase tracking-widest">{e.cat}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10"></span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{e.pay}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <p className="text-2xl font-black text-rose-500 font-display">{formatCurrency(e.amount)}</p>
                      <button 
                        onClick={() => deleteExpense(e.id)}
                        className="p-3 text-slate-200 hover:text-rose-500 transition-all hover:bg-rose-500/5 rounded-xl group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
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
