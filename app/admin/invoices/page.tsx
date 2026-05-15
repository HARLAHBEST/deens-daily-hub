'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Invoice } from '@/lib/data-service';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadInvoiceId, setUploadInvoiceId] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    invoiceId: '',
    source: 'manual',
    pdfFile: null as File | null
  });
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const invoiceListSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const closedByClientRef = useRef(false);
  const pollingIntervalRef = useRef<number | null>(null);

  // Subscribe to invoice list updates via SSE
  useEffect(() => {
    const source = new EventSource('/api/invoices/list');
    invoiceListSourceRef.current = source;

    source.addEventListener('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to parse invoice list', err);
      }
    });

    source.onerror = () => {
      console.error('Invoice list stream error');
      source.close();
    };

    return () => {
      source.close();
      invoiceListSourceRef.current = null;
    };
  }, []);

  // Cleanup event sources on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (invoiceListSourceRef.current) {
        invoiceListSourceRef.current.close();
      }
    };
  }, []);

  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      closedByClientRef.current = true;
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const openInvoiceStatusStream = (invoiceId: string) => {
    cleanupEventSource();
    closedByClientRef.current = false;
    reconnectAttemptsRef.current = 0;

    const startSource = () => {
      if (closedByClientRef.current) return;
      const source = new EventSource(`/api/invoices/events?invoiceId=${encodeURIComponent(invoiceId)}`);
      eventSourceRef.current = source;

      source.addEventListener('status', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setUploadStatus(data.processingStatus || `Status: ${data.status}`);

          if (data.status !== 'processing') {
            setProcessing(false);
            closedByClientRef.current = true;
            cleanupEventSource();
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current as unknown as number);
              pollingIntervalRef.current = null;
            }

            if (data.status === 'ready') {
              setUploadStatus(`Extraction complete. ${data.processingStatus}`);
            } else {
              setUploadStatus(`Extraction ended with error: ${data.errorMessage || 'Unknown error'}`);
              setUploadError(data.errorMessage || 'Extraction failed');
            }
          }
        } catch (err) {
          console.error('Malformed SSE status event', err);
        }
      });

      source.onerror = () => {
        if (closedByClientRef.current) return;

        try { source.close(); } catch (e) {}

        reconnectAttemptsRef.current += 1;
        const attempt = reconnectAttemptsRef.current;
        const maxAttempts = 5;
        const backoff = Math.min(30000, 1000 * Math.pow(2, attempt));

        if (attempt <= maxAttempts) {
          setUploadStatus(`Connection lost. Reconnecting (attempt ${attempt})...`);
          setTimeout(() => startSource(), backoff);
        } else {
          setUploadStatus('Live connection unavailable — falling back to polling.');
          pollingIntervalRef.current = window.setInterval(async () => {
            try {
              const res = await fetch('/api/invoices');
              if (!res.ok) return;
              const list = await res.json();
              const current = (list || []).find((i: any) => i.invoiceId === invoiceId);
              if (current) {
                setUploadStatus(current.processingStatus || `Status: ${current.status}`);
                if (current.status !== 'processing') {
                  setProcessing(false);
                  if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current as unknown as number);
                    pollingIntervalRef.current = null;
                  }
                }
                if (current.status === 'ready') {
                  setUploadStatus(`Extraction complete. ${current.processingStatus}`);
                }
              }
            } catch (err) {
              console.error('Polling fallback error', err);
            }
          }, 3000);
        }
      };
    };

    startSource();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, pdfFile: file }));
    }
  };

  const handleUploadInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pdfFile) {
      setUploadError('Please select a PDF file.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadStatus('Preparing invoice upload...');

    try {
      const fd = new FormData();
      fd.append('pdfFile', formData.pdfFile);
      fd.append('invoiceId', formData.invoiceId);
      fd.append('source', formData.source);

      const res = await fetch('/api/invoices', {
        method: 'POST',
        body: fd,
      });

      const result = await res.json();

      if (res.status === 202) {
        setShowModal(false);
        setFormData({ invoiceId: '', source: 'manual', pdfFile: null });
        setUploading(false);
        setProcessing(true);
        setUploadInvoiceId(result.invoiceId || '');
        setUploadStatus('Upload accepted. Waiting for extraction status...');
        openInvoiceStatusStream(result.invoiceId);
      } else if (res.status === 409) {
        setUploading(false);
        setUploadError(
          result.message || result.error ||
          'Duplicate invoice detected. Please use a different invoice ID or check existing invoices.'
        );
        setUploadStatus('Duplicate invoice detected.');
      } else {
        setUploading(false);
        setUploadError(result.error || 'Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
      setUploadError('Upload failed. Please try again.');
    }
  };

  const handleCloseModal = () => {
    cleanupEventSource();
    setShowModal(false);
    setFormData({ invoiceId: '', source: 'manual', pdfFile: null });
    setUploadStatus('');
    setUploadError('');
    setProcessing(false);
    setUploadInvoiceId('');
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceId}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/invoices?invoiceId=${encodeURIComponent(invoiceId)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Invoice will be removed from the list automatically via SSE
      } else {
        const result = await res.json();
        alert(result.error || 'Failed to delete invoice');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete invoice');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock size={14} className="animate-spin text-amber-500" />;
      case 'ready':
        return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'error':
        return <AlertCircle size={14} className="text-rose-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      inv.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      inv.date.includes(search) ||
      inv.source.toLowerCase().includes(search.toLowerCase())
    );
  }, [invoices, search]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/20 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-navy dark:text-white font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-navy via-navy/80 to-gold dark:from-white dark:to-gold/50 leading-none">
            Invoices
          </h1>
          <p className="text-slate-500 dark:text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[3px] md:tracking-[5px] mt-2">
            Supplier Ledger & Extraction
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-navy dark:bg-gold text-white dark:text-navy rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/10 w-full md:w-auto"
        >
          <Plus size={20} /> Add New Invoice
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search invoice ID, date, source..."
            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold/20 dark:text-white transition-all outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paginatedInvoices.length > 0 ? (
          paginatedInvoices.map((inv) => (
            <div
              key={inv._id || inv.invoiceId}
              className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-[32px] p-6 md:p-8 transition-all hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-xs font-black text-navy bg-gold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-gold/20">
                      {inv.invoiceId}
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                      inv.status === 'ready' ? 'bg-emerald-500/10 text-emerald-500' : 
                      inv.status === 'processing' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {getStatusIcon(inv.status)} {inv.status}
                    </span>
                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[2px]">{inv.source}</span>
                  </div>

                  <h3 className="font-black text-navy dark:text-white font-display text-xl tracking-tight leading-tight group-hover:text-gold transition-colors">
                    {inv.processingStatus}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Upload Date</span>
                      <span className="font-bold text-sm text-navy dark:text-white">{inv.date}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black text-gold tracking-widest mb-1">Invoice Total</span>
                      <span className="text-2xl text-navy dark:text-gold font-display font-black leading-none">
                        {formatCurrency(inv.total)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Items Found</span>
                      <span className="font-bold text-sm text-navy dark:text-white">{inv.itemCount} Units</span>
                    </div>
                  </div>

                  {inv.errorMessage && (
                    <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-[11px] font-bold text-rose-500 flex items-start gap-3">
                      <AlertCircle size={16} className="shrink-0" />
                      {inv.errorMessage}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteInvoice(inv.invoiceId)}
                    className="p-4 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-2xl transition-all text-rose-500 shadow-sm active:scale-90"
                    title="Delete invoice"
                  >
                    <Trash2 size={20} />
                  </button>
                  
                  {inv.parsedItems && inv.parsedItems.length > 0 && (
                    <button
                      onClick={() => setExpandedInvoiceId(expandedInvoiceId === inv.invoiceId ? null : inv.invoiceId)}
                      className={`p-4 rounded-2xl transition-all shadow-sm active:scale-90 flex items-center gap-2 ${
                        expandedInvoiceId === inv.invoiceId 
                        ? 'bg-gold text-navy' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-gold'
                      }`}
                    >
                      {expandedInvoiceId === inv.invoiceId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                        {expandedInvoiceId === inv.invoiceId ? 'Hide' : 'Items'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {expandedInvoiceId === inv.invoiceId && inv.parsedItems && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gold/10 rounded-lg text-gold">
                      <FileText size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-[2px] text-navy dark:text-white/60">Extracted Line Items</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Desktop Header */}
                    <div className="hidden md:grid md:grid-cols-[1.5fr_2fr_0.5fr_0.8fr_0.8fr] gap-4 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <div>Item / Name</div>
                      <div>Description</div>
                      <div className="text-right">Qty</div>
                      <div className="text-right">Price</div>
                      <div className="text-right">Total</div>
                    </div>
                    
                    {/* Items */}
                    {inv.parsedItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 md:p-0 md:bg-transparent md:grid md:grid-cols-[1.5fr_2fr_0.5fr_0.8fr_0.8fr] md:gap-4 md:items-center group/item border border-slate-100 dark:border-white/5 md:border-none hover:border-gold/30 transition-all shadow-sm md:shadow-none"
                      >
                        {/* Mobile Header (Small Screens Only) */}
                        <div className="flex items-center justify-between md:hidden mb-4 pb-3 border-b border-slate-200 dark:border-white/10">
                           <span className="px-3 py-1 bg-gold text-navy text-[8px] font-black uppercase rounded-lg shadow-lg shadow-gold/10">
                             QTY: {item.qty}
                           </span>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             {formatCurrency(item.unitPrice)} / unit
                           </span>
                        </div>
                        
                        <div className="md:px-4 md:py-4 md:bg-slate-50 md:dark:bg-white/5 md:rounded-l-2xl">
                          <span className="text-sm md:text-xs font-black text-navy dark:text-white block group-hover/item:text-gold transition-colors leading-tight">
                            {item.name || 'Untitled Item'}
                          </span>
                        </div>
                        
                        <div className="md:px-4 md:py-4 md:bg-slate-50 md:dark:bg-white/5 mt-3 md:mt-0">
                          <span className="text-[11px] md:text-[10px] font-medium text-slate-500 dark:text-white/40 line-clamp-3 md:line-clamp-1 leading-relaxed">
                            {item.description}
                          </span>
                        </div>
                        
                        <div className="hidden md:block md:px-4 md:py-4 md:bg-slate-50 md:dark:bg-white/5 text-right">
                          <span className="text-[11px] font-bold text-navy dark:text-white tracking-tighter">{item.qty}</span>
                        </div>
                        
                        <div className="hidden md:block md:px-4 md:py-4 md:bg-slate-50 md:dark:bg-white/5 text-right">
                          <span className="text-[11px] font-bold text-navy dark:text-white">{formatCurrency(item.unitPrice)}</span>
                        </div>
                        
                        <div className="mt-5 md:mt-0 flex items-center justify-between md:justify-end md:px-4 md:py-4 md:bg-slate-50 md:dark:bg-white/5 text-right md:rounded-r-2xl bg-white dark:bg-white/5 md:bg-transparent -mx-5 -mb-5 p-5 md:p-4 rounded-b-2xl border-t border-slate-100 dark:border-white/5 md:border-none">
                           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest md:hidden">Line Total</span>
                           <span className="text-lg md:text-[11px] font-black text-gold font-display leading-none">{formatCurrency(item.lineTotal)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-[#0f1f35] rounded-2xl border border-slate-200 dark:border-white/5">
            <p className="text-slate-500 dark:text-white/40 text-sm font-bold">
              {search ? 'No invoices found' : 'No invoices yet. Upload one to get started.'}
            </p>
          </div>
        )}
      </div>

      {filteredInvoices.length > itemsPerPage && (
        <div className="flex items-center gap-2 justify-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-gold hover:text-navy disabled:opacity-20 transition-all"
          >
            Prev
          </button>
          <span className="text-sm font-black text-navy dark:text-white">
            {currentPage} / {Math.ceil(filteredInvoices.length / itemsPerPage)}
          </span>
          <button
            disabled={currentPage >= Math.ceil(filteredInvoices.length / itemsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-gold hover:text-navy disabled:opacity-20 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-[#0f1f35] w-full max-w-xl rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-gold">
                <div className="p-3 bg-gold/10 rounded-2xl">
                  <Upload size={24} />
                </div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-navy dark:text-white">Upload Invoice</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {uploadStatus && (
              <div className="mb-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 text-sm text-slate-700 dark:text-white/80">
                <strong>Status:</strong> {uploadStatus}
                {uploadInvoiceId && <div className="mt-1 text-[11px] text-slate-500 dark:text-white/40">Invoice ID: {uploadInvoiceId}</div>}
              </div>
            )}

            {uploadError && (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/10 p-4 text-sm text-rose-700 dark:text-rose-300">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadInvoice} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice ID (Optional)</label>
                <input
                  type="text"
                  value={formData.invoiceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceId: e.target.value }))}
                  placeholder="Leave blank to auto-extract"
                  className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold dark:text-white"
                  disabled={uploading || processing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-gold dark:text-white"
                  disabled={uploading || processing}
                >
                  <option value="manual">Manual Upload</option>
                  <option value="mega_savers">Mega Savers</option>
                  <option value="supplier">Supplier</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">PDF File</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl p-6 text-center hover:border-gold transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading || processing}
                  />
                  <div className="space-y-2">
                    <Upload size={24} className="mx-auto text-slate-400 group-hover:text-gold transition-colors" />
                    <p className="text-[10px] font-black text-slate-600 dark:text-white/40 uppercase tracking-wide">
                      {formData.pdfFile ? formData.pdfFile.name : 'Click to upload PDF'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || processing || !formData.pdfFile}
                className="w-full py-3 bg-navy dark:bg-gold text-white dark:text-navy rounded-xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
              >
                {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload & Extract'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
