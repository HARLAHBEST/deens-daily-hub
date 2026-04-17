'use client';

import React, { useState } from 'react';
import { Download, Database, Loader2, Link as LinkIcon } from 'lucide-react';

export default function DataManagement() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const exportData = async () => {
    setGenerating(true);
    setDownloadLink(null);

    // Read everything from localStorage
    const payload = {
      ddh9_sales: localStorage.getItem('ddh9_sales'),
      ddh9_status: localStorage.getItem('ddh9_status'),
      ddh9_expenses: localStorage.getItem('ddh9_expenses'),
    };

    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
         setDownloadLink(data.url);
      } else {
        alert('Failed to generate PDF: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      alert('Error connecting to backend.');
    }

    setGenerating(false);
  };

  const exportJsonBackup = () => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-5 bg-gold/10 rounded-3xl text-gold mb-2 shadow-xl shadow-gold/5">
          <Database size={48} />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tight text-navy dark:text-white font-display uppercase italic">
            Ledger Export
          </h1>
          <p className="text-slate-500 dark:text-white/30 font-bold mt-2 uppercase tracking-[3px] text-[10px]">
            Server-side CSV Generation & Local State Backups
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CSV Card */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500">
            <Download size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">Export Financial CSV</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Compile your MongoDB inventory and local transactions into a Cloudinary CSV ledger.
            </p>
          </div>
          
          {downloadLink ? (
            <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-emerald-500 text-white font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95">
              <LinkIcon size={18} /> Open CSV Backup
            </a>
          ) : (
            <button onClick={exportData} disabled={generating} className="w-full py-5 bg-gold text-navy font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:bg-white transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
              {generating ? <Loader2 size={18} className="animate-spin" /> : 'Generate Server CSV'}
            </button>
          )}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* JSON Card */}
        <div className="bg-white dark:bg-[#0f1f35] rounded-[40px] border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-xl">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500">
            <Database size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black dark:text-white font-display uppercase tracking-tight">System JSON Backup</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Instant raw snapshot of your entire local storage persistence layer for total recovery.
            </p>
          </div>
          
          <button onClick={exportJsonBackup} className="w-full mt-auto py-5 bg-blue-500 text-white font-black text-xs uppercase tracking-[3px] rounded-[24px] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95">
            <Download size={18} /> Download JSON
          </button>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  );
}
