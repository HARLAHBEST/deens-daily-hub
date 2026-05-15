'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PackagePlus, Trash2, Image as ImageIcon, Loader2, RefreshCw, Database, Search } from 'lucide-react';

export default function AdminItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({
    description: '',
    invoiceId: '',
    cost: '',
    category: 'Electronics',
    bidPrice: '',
    invoiceTotal: '',
    lot: '',
    quantity: 1,
    unit: 'pcs'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = searchTerm ? `/api/items?admin=true&search=${encodeURIComponent(searchTerm)}` : '/api/items?admin=true';
      const res = await fetch(url);
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      description: item.description || '',
      invoiceId: item.invoiceId || '',
      cost: item.cost || '',
      category: item.category || 'Electronics',
      bidPrice: item.bidPrice || '',
      invoiceTotal: item.invoiceTotal || '',
      status: item.status || 'In Stock',
      lot: item.lot || '',
      quantity: item.quantity || 1,
      unit: item.unit || 'pcs'
    });
    setImagePreview(item.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      description: '',
      invoiceId: '',
      cost: '',
      category: 'Electronics',
      bidPrice: '',
      invoiceTotal: '',
      status: 'In Stock',
      lot: '',
      quantity: 1,
      unit: 'pcs'
    });
    setImagePreview(null);
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setAdding(true);
    const fd = new FormData(formRef.current);
    if (editingId) fd.append('id', editingId);
    
    try {
      const res = await fetch('/api/items', {
        method: editingId ? 'PATCH' : 'POST',
        body: fd,
      });
      if (res.ok) {
        cancelEdit();
        fetchItems();
      } else {
        alert('Operation failed');
      }
    } catch (e) {
      console.error(e);
    }
    setAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/20 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-navy dark:text-white font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-navy via-navy/80 to-gold dark:from-white dark:to-gold/50">
            Inventory
          </h1>
          <p className="text-slate-500 dark:text-white/30 font-black uppercase tracking-[3px] md:tracking-[5px] text-[9px] md:text-[10px]">
            Live Stock Management System
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
           <div className="relative group flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Search inventory..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-12 pr-6 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none w-full md:w-80 transition-all shadow-lg"
             />
           </div>
          <button onClick={fetchItems} className="group flex items-center justify-center gap-3 px-8 py-4 bg-navy dark:bg-gold text-white dark:text-navy rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/10">
            <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ADD ITEM FORM */}
        <div className="lg:col-span-4">
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/10 rounded-[30px] md:rounded-[50px] p-6 md:p-10 space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden group hover:border-gold/30 transition-colors">
             <div className="flex items-center gap-5 text-gold">
               <div className="p-4 bg-gold/10 rounded-3xl group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                 <PackagePlus size={28} />
               </div>
                <div>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-navy dark:text-white leading-none">
                    {editingId ? 'Update' : 'Register'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Item Entry</p>
                </div>
              </div>

              {editingId && (
                <div className="bg-gold/10 p-5 rounded-3xl border border-gold/20 flex items-center justify-between animate-in zoom-in-95 duration-300">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">Modified ID</span>
                    <span className="text-xs font-bold text-navy dark:text-white">{formData.lot || editingId}</span>
                  </div>
                  <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black text-navy dark:text-white uppercase tracking-widest transition-colors">Cancel</button>
                </div>
              )}

             <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Description</label>
                  <input required name="description" value={formData.description} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none transition-all" placeholder="Enter item name and specs..." />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Invoice #</label>
                    <input required name="invoiceId" value={formData.invoiceId} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none transition-all" placeholder="INV-000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity</label>
                    <input required name="quantity" value={formData.quantity} onChange={handleChange} type="number" className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none transition-all" placeholder="1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cost Price ($)</label>
                    <input required name="cost" value={formData.cost} onChange={handleChange} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none transition-all text-rose-500" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Selling Price ($)</label>
                    <input name="bidPrice" value={formData.bidPrice} onChange={handleChange} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none transition-all text-emerald-500" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none text-navy dark:text-white transition-all appearance-none cursor-pointer">
                       <option value="Electronics">Electronics</option>
                       <option value="Clothing">Clothing</option>
                       <option value="Home & Kitchen">Home & Kitchen</option>
                       <option value="Health & Beauty">Health & Beauty</option>
                       <option value="Tools">Tools</option>
                       <option value="Baby & Kids">Baby & Kids</option>
                       <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                    <select required name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-gold/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-gold/5 outline-none text-navy dark:text-white transition-all appearance-none cursor-pointer">
                       <option value="In Stock">In Stock</option>
                       <option value="Sold">Sold</option>
                       <option value="Past Sold">Past Sold</option>
                       <option value="Lost">Lost</option>
                       <option value="Damaged">Damaged</option>
                       <option value="Personal Use">Personal Use</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visual Reference</label>
                  <div className="relative w-full h-40 bg-slate-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center hover:border-gold transition-all text-slate-400 group-hover:text-gold cursor-pointer overflow-hidden shadow-inner">
                     <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                     {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                     ) : (
                       <div className="flex flex-col items-center gap-2">
                         <div className="p-4 bg-white/10 rounded-2xl">
                           <ImageIcon size={32} className="opacity-50" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                       </div>
                     )}
                  </div>
                </div>
             </div>

             <button disabled={adding} type="submit" className="w-full py-6 mt-4 bg-navy dark:bg-gold text-white dark:text-navy font-black text-xs uppercase tracking-[4px] rounded-[30px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-gold/20 flex items-center justify-center gap-4 disabled:opacity-50">
               {adding ? <Loader2 className="animate-spin" size={20} /> : (editingId ? 'Update Inventory' : 'Add to Stock')}
             </button>
             
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -z-10"></div>
          </form>
        </div>

        {/* ITEMS LIST */}
        <div className="lg:col-span-8">
           <div className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/10 rounded-[30px] md:rounded-[50px] p-6 md:p-10 shadow-2xl flex flex-col h-full min-h-[600px] md:min-h-[900px]">
             <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tighter text-navy dark:text-gold flex items-center gap-4">
                    <div className="w-2 h-10 bg-gold rounded-full"></div>
                    Stock Ledger
                  </h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[3px] mt-2 flex items-center gap-2">
                    <Database size={12} className="text-gold" />
                    {items.length} ACTIVE SKU RECORDS
                  </p>
                </div>

                {/* Modern Pagination UI */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-2 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-4 bg-white dark:bg-white/5 rounded-2xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-4 px-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Page</span>
                      <span className="text-2xl font-black font-display text-navy dark:text-gold leading-none">{currentPage}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Total</span>
                      <span className="text-sm font-black font-display text-slate-500 leading-none">{Math.ceil(items.length / itemsPerPage)}</span>
                    </div>
                  </div>

                  <button 
                    disabled={currentPage >= Math.ceil(items.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-4 bg-white dark:bg-white/5 rounded-2xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-200 dark:border-white/10 shadow-sm active:scale-90"
                  >
                    Next
                  </button>
                </div>
             </div>

             {loading && items.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-gold gap-4">
                 <Loader2 className="animate-spin" size={60} />
                 <span className="text-[10px] font-black uppercase tracking-[5px]">Fetching Cloud Data</span>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(it => (
                    <div key={it._id} className="bg-slate-50 dark:bg-[#060d18] rounded-[32px] p-5 md:p-6 flex flex-col sm:flex-row gap-5 md:gap-6 border border-slate-200 dark:border-white/5 group hover:bg-white dark:hover:bg-white/5 hover:border-gold/40 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5 relative overflow-hidden">
                       <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 bg-white dark:bg-white/5 rounded-[24px] overflow-hidden flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform duration-500">
                         {it.image ? (
                           <img src={it.image} alt={it.description} className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon size={32} className="text-slate-200 dark:text-white/10" />
                         )}
                         <div className="absolute top-3 right-3 px-3 py-1 bg-navy/80 backdrop-blur-md rounded-lg text-[9px] font-black text-gold uppercase shadow-xl">
                            QTY: {it.quantity || 1}
                         </div>
                       </div>
                       <div className="flex flex-col flex-1 min-w-0 py-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gold truncate flex-1">{it.category} &bull; {it.lot}</p>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              it.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {it.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-navy dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-gold transition-colors">{it.description}</h3>
                          <div className="mt-auto flex items-end justify-between gap-4">
                             <div className="grid grid-cols-2 gap-4 flex-1">
                               <div className="flex flex-col">
                                 <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-1">Cost</span>
                                 <span className="text-sm font-black font-display text-slate-500 leading-none">${it.cost}</span>
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-[7px] font-black uppercase text-gold/60 tracking-widest mb-1">Selling</span>
                                 <span className="text-xl font-black font-display text-gold leading-none">${it.bidPrice}</span>
                               </div>
                             </div>
                             <div className="flex items-center gap-2">
                               <button onClick={() => startEdit(it)} className="p-3 text-slate-400 hover:text-gold hover:bg-gold/10 rounded-2xl transition-all shadow-sm bg-white dark:bg-white/5 active:scale-90">
                                 <RefreshCw size={16} />
                               </button>
                               <button onClick={() => handleDelete(it._id)} className="p-3 text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl transition-all shadow-sm bg-rose-500/10 active:scale-90">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </div>
                       </div>
                       <div className="absolute -top-10 -right-10 w-20 h-20 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/20 transition-all"></div>
                    </div>
                  ))}
                  
                  {items.length === 0 && !loading && (
                    <div className="col-span-full py-40 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/10">
                      <div className="p-8 bg-white dark:bg-white/10 rounded-full mb-6 shadow-xl">
                        <Database size={64} className="opacity-20" />
                      </div>
                      <p className="text-lg font-black uppercase tracking-[8px] text-navy dark:text-white/20">Empty Vault</p>
                      <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-40">No records matching your criteria</p>
                    </div>
                  )}
               </div>
             )}
             
             <div className="mt-auto pt-10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Database Synced
                </div>
                <div>
                   Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} Items
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
