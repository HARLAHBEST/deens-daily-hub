'use client';

import React, { useRef } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Database,
  FileJson,
  RefreshCw
} from 'lucide-react';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const backup = {
      ddh9_sales: localStorage.getItem('ddh9_sales'),
      ddh9_status: localStorage.getItem('ddh9_status'),
      ddh9_expenses: localStorage.getItem('ddh9_expenses'),
      ddh9_extra: localStorage.getItem('ddh9_extra'),
      ddh_referrals: localStorage.getItem('ddh_referrals'),
      ddh9_web: localStorage.getItem('ddh_web'),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DDH_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('Importing data will OVERWRITE your current local data. Are you sure you want to proceed?')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Restore each key if it exists in the backup
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'timestamp') return;
          if (value && typeof value === 'string') {
            localStorage.setItem(key, value);
          }
        });

        alert('Data imported successfully! The page will now reload.');
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm('CRITICAL: This will delete ALL local sales, expenses, and settings. This cannot be undone unless you have a backup. Type "DELETE" to confirm.')) {
      const confirmation = prompt('Type DELETE to confirm:');
      if (confirmation === 'DELETE') {
        const keysToRemove = [
          'ddh9_sales', 'ddh9_status', 'ddh9_expenses', 
          'ddh9_extra', 'ddh_referrals', 'ddh_web'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        alert('All custom data has been removed. Reloading...');
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-5 bg-gold/10 rounded-3xl text-gold mb-2 shadow-xl shadow-gold/5">
          <Database size={48} />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tight text-navy dark:text-white font-display uppercase italic">
            Data Hub
          </h1>
          <p className="text-slate-500 dark:text-white/30 font-bold mt-2 uppercase tracking-[3px] text-[10px]">
            System Backups & Persistence Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Card */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500">
            <Download size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">Export Ledger</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Download your complete operational database as a secure JSON file.
            </p>
          </div>
          <button 
            onClick={exportData}
            className="w-full py-5 bg-gold text-navy font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:bg-white transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-3 active:scale-95"
          >
            Download Backup
          </button>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Import Card */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold">
            <Upload size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">Restore State</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Reconstitute your hub from a previously exported operational snapshot.
            </p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={importData}
            accept=".json"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-5 bg-navy dark:bg-white text-white dark:text-navy font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:bg-gold dark:hover:bg-gold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
          >
            Choose File
          </button>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-500/5 dark:bg-rose-500/5 rounded-[40px] border border-rose-500/20 p-10 space-y-6 relative overflow-hidden group">
        <div className="flex items-center gap-4 text-rose-500">
          <div className="p-3 bg-rose-500/10 rounded-2xl group-hover:scale-110 transition-transform">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-tight">System Hazard</h2>
        </div>
        <p className="text-xs font-bold text-rose-500/60 uppercase tracking-widest leading-relaxed max-w-2xl">
          The following operations are destructive and irreversible. Proceed only if you have secured an off-site operational backup.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={resetData}
            className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-[2px] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-600/20 active:scale-95"
          >
            <Trash2 size={18} /> Wipe Local Data
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 font-black text-xs uppercase tracking-[2px] rounded-2xl hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <RefreshCw size={18} /> Hard Sync
          </button>
        </div>
      </div>

      {/* Infrastructure Card */}
      <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
        <div className="relative z-10 flex items-start gap-8">
          <div className="p-5 bg-white/10 rounded-3xl text-gold group-hover:rotate-12 transition-transform">
            <FileJson size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black font-display uppercase tracking-tight leading-none italic">Local-First Persistence</h3>
            <p className="text-white/40 text-sm font-bold leading-relaxed max-w-2xl uppercase tracking-wider">
              Deen's Daily Hub utilizes high-performance local storage. Your operational data remains encrypted on your local machine for maximum privacy and offline availability. 
              <span className="block mt-4 text-gold/50">Reminder: Cache deletion will result in data loss if not regularly backed up.</span>
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
      </div>
    </div>
  );
}
