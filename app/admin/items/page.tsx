'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PackagePlus, Trash2, Image as ImageIcon, Loader2, RefreshCw, Database } from 'lucide-react';

export default function AdminItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    description: '',
    invoiceId: '',
    cost: '',
    category: 'Electronics',
    bidPrice: '',
    invoiceTotal: '',
    lot: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      const res = await fetch('/api/items');
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
  }, []);

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
      lot: item.lot || ''
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
      lot: ''
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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-navy dark:text-white font-display uppercase italic mb-2">
            Inventory Data
          </h1>
          <p className="text-slate-500 dark:text-white/30 font-bold uppercase tracking-[3px] text-[10px]">
            Cloud synchronized CRUD operations
          </p>
        </div>
        <button onClick={fetchItems} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Sync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD ITEM FORM */}
        <div className="lg:col-span-1">
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-[40px] p-8 space-y-6 shadow-xl relative overflow-hidden group">
             <div className="flex items-center gap-4 text-gold mb-8">
               <div className="p-3 bg-gold/10 rounded-2xl group-hover:scale-110 transition-transform">
                 <PackagePlus size={24} />
               </div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-navy dark:text-white">
                  {editingId ? 'Edit Item' : 'Add Item'}
                </h2>
              </div>

              {editingId && (
                <div className="bg-gold/10 p-4 rounded-2xl border border-gold/20 flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest">Editing: {formData.lot || editingId}</span>
                  <button type="button" onClick={cancelEdit} className="text-[10px] font-black text-navy dark:text-white uppercase tracking-widest hover:underline">Cancel</button>
                </div>
              )}

             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Description</label>
                  <input required name="description" value={formData.description} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="Item name..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Invoice #</label>
                    <input required name="invoiceId" value={formData.invoiceId} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="INV-123" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Cost ($)</label>
                    <input required name="cost" value={formData.cost} onChange={handleChange} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Category</label>
                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none text-navy dark:text-white">
                       <option value="Electronics">Electronics</option>
                       <option value="Clothing">Clothing</option>
                       <option value="Home & Kitchen">Home & Kitchen</option>
                       <option value="Health & Beauty">Health & Beauty</option>
                       <option value="Tools">Tools</option>
                       <option value="Baby & Kids">Baby & Kids</option>
                       <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Bid Price ($)</label>
                    <input required name="bidPrice" value={formData.bidPrice} onChange={handleChange} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Inv Total ($)</label>
                    <input required name="invoiceTotal" value={formData.invoiceTotal} onChange={handleChange} type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Status</label>
                    <select required name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none text-navy dark:text-white">
                       <option value="In Stock">In Stock</option>
                       <option value="Sold">Sold</option>
                       <option value="Past Sold">Past Sold</option>
                       <option value="Lost">Lost</option>
                       <option value="Damaged">Damaged</option>
                       <option value="Personal Use">Personal Use</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Image Upload</label>
                  <div className="relative w-full h-32 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center hover:border-gold transition-colors text-slate-400 group-hover:text-gold cursor-pointer overflow-hidden">
                     <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                     {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <>
                         <ImageIcon size={32} className="mb-2 opacity-50" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                       </>
                     )}
                  </div>
                </div>
             </div>

             <button disabled={adding} type="submit" className="w-full py-5 mt-4 bg-navy dark:bg-gold text-white dark:text-navy font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
               {adding ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Update DB Item' : 'Create DB Item')}
             </button>
             
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl -z-10"></div>
          </form>
        </div>

        {/* ITEMS LIST */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-[40px] p-8 shadow-xl">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h2 className="text-2xl font-black font-display uppercase tracking-tight text-navy dark:text-gold flex items-center gap-2">
                    <Database size={24} /> Live Database
                  </h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[1px] mt-1">{items.length} records in cloud</p>
                </div>

                {/* Modern Pagination UI */}
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest border border-slate-100 dark:border-white/10"
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-navy dark:bg-black rounded-xl border border-gold/30">
                    <span className="text-[9px] font-black uppercase text-gold/60">Page</span>
                    <span className="text-base font-black font-display text-gold leading-none">{currentPage}</span>
                    <span className="text-[9px] font-black uppercase text-gold/60">/ {Math.ceil(items.length / itemsPerPage)}</span>
                  </div>

                  <button 
                    disabled={currentPage >= Math.ceil(items.length / itemsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-gold hover:text-navy disabled:opacity-20 transition-all font-black text-[9px] uppercase tracking-widest border border-slate-100 dark:border-white/10"
                  >
                    Next
                  </button>
                </div>
             </div>

             {loading && items.length === 0 ? (
               <div className="py-20 flex justify-center text-gold">
                 <Loader2 className="animate-spin" size={40} />
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(it => (
                    <div key={it._id} className="bg-slate-50 dark:bg-[#060d18] rounded-3xl p-4 flex gap-4 border border-slate-200 dark:border-white/5 group">
                       <div className="w-20 h-20 shrink-0 bg-white dark:bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center relative">
                         {it.image ? (
                           <img src={it.image} alt={it.description} className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon size={24} className="text-slate-300 dark:text-white/20" />
                         )}
                       </div>
                       <div className="flex flex-col flex-1 truncate">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 truncate">{it.category} &bull; {it.lot}</p>
                          <h3 className="text-sm font-black text-navy dark:text-white mb-2 truncate">{it.description}</h3>
                          <div className="mt-auto flex items-end justify-between">
                             <div className="flex flex-col">
                               <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Cost Pool</span>
                               <span className="text-lg font-black font-display text-gold">${it.cost}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <button onClick={() => startEdit(it)} className="p-2 text-slate-400 hover:text-gold hover:bg-gold/10 rounded-xl transition-all">
                                 <RefreshCw size={14} />
                               </button>
                               <button onClick={() => handleDelete(it._id)} className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </div>
                       </div>
                    </div>
                 ))}
                 
                 {items.length === 0 && !loading && (
                   <div className="col-span-full py-20 text-center flex flex-col items-center text-slate-400">
                     <Database size={48} className="mb-4 opacity-20" />
                     <p className="text-xs font-bold uppercase tracking-widest">No Items Found</p>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
