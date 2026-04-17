'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PackagePlus, Trash2, Image as ImageIcon, Loader2, RefreshCw, Database } from 'lucide-react';

export default function AdminItems() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setAdding(true);
    const formData = new FormData(formRef.current);
    
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        formRef.current.reset();
        setImagePreview(null);
        fetchItems();
      } else {
        alert('Failed to add item');
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
               <h2 className="text-2xl font-black font-display uppercase tracking-tight text-navy dark:text-white">Add Item</h2>
             </div>

             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Description</label>
                  <input required name="desc" type="text" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="Item name..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Invoice #</label>
                    <input required name="inv" type="text" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="INV-123" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Cost ($)</label>
                    <input required name="cost" type="number" step="0.01" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Category</label>
                  <select required name="cat" className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-gold outline-none text-navy dark:text-white">
                     <option value="Electronics" className="text-navy">Electronics</option>
                     <option value="Clothing" className="text-navy">Clothing</option>
                     <option value="Home & Kitchen" className="text-navy">Home & Kitchen</option>
                     <option value="Health & Beauty" className="text-navy">Health & Beauty</option>
                     <option value="Tools" className="text-navy">Tools</option>
                     <option value="Other" className="text-navy">Other</option>
                  </select>
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
               {adding ? <Loader2 className="animate-spin" size={18} /> : 'Create DB Item'}
             </button>
             
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl -z-10"></div>
          </form>
        </div>

        {/* ITEMS LIST */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-[40px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black font-display uppercase tracking-tight text-navy dark:text-white">Live Database</h2>
               <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">{items.length} Records</span>
             </div>

             {loading && items.length === 0 ? (
               <div className="py-20 flex justify-center text-gold">
                 <Loader2 className="animate-spin" size={40} />
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {items.map(it => (
                    <div key={it._id} className="bg-slate-50 dark:bg-[#060d18] rounded-3xl p-4 flex gap-4 border border-slate-200 dark:border-white/5 group">
                       <div className="w-20 h-20 shrink-0 bg-white dark:bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center relative">
                         {it.image ? (
                           <img src={it.image} alt={it.desc} className="w-full h-full object-cover" />
                         ) : (
                           <ImageIcon size={24} className="text-slate-300 dark:text-white/20" />
                         )}
                       </div>
                       <div className="flex flex-col flex-1 truncate">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 truncate">{it.cat} &bull; {it.lot}</p>
                          <h3 className="text-sm font-black text-navy dark:text-white mb-2 truncate">{it.desc}</h3>
                          <div className="mt-auto flex items-end justify-between">
                            <span className="text-lg font-black font-display text-gold">${it.cost}</span>
                            <button onClick={() => handleDelete(it._id)} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
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
