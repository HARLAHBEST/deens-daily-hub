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
  Trash2
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
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    invoiceId: '',
    source: 'manual',
    pdfFile: null as File | null
  });

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display uppercase italic text-gradient leading-none">
            Invoice Management
          </h1>
          <p className="text-slate-500 dark:text-white/30 text-[11px] font-bold uppercase tracking-widest mt-1">
            Upload and manage supplier invoices
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-navy dark:bg-gold text-white dark:text-navy rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={16} /> Add Invoice
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f1f35] p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full sm:flex-1 min-w-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search invoice ID, date, source..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-[13px] focus:ring-1 focus:ring-gold/30 dark:text-white transition-all outline-none font-medium"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {paginatedInvoices.length > 0 ? (
          paginatedInvoices.map((inv) => (
            <div
              key={inv._id || inv.invoiceId}
              className="bg-white dark:bg-[#0f1f35] border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5 transition-all hover:border-gold/30 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-[10px] font-black text-navy bg-gold px-2 py-1 rounded-sm uppercase tracking-[1px]">
                      {inv.invoiceId}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[1px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/40">
                      {getStatusIcon(inv.status)} {inv.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{inv.source}</span>
                  </div>

                  <h3 className="font-black text-navy dark:text-white font-display text-sm tracking-tight">
                    {inv.processingStatus}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-white/40 font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase opacity-40">Date</span>
                      <span className="font-mono text-navy dark:text-white">{inv.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase opacity-40">Total</span>
                      <span className="text-base text-navy dark:text-gold font-display font-black leading-none">
                        {formatCurrency(inv.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] uppercase opacity-40">Items</span>
                      <span className="font-mono text-navy dark:text-white">{inv.itemCount}</span>
                    </div>
                  </div>

                  {inv.errorMessage && (
                    <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg text-[9px] text-rose-700 dark:text-rose-300">
                      {inv.errorMessage}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {inv.status === 'ready' && (
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[9px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                      ✓ Ready
                    </div>
                  )}
                  {inv.status === 'processing' && (
                    <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[9px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest animate-pulse">
                      ⟳ Processing
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteInvoice(inv.invoiceId)}
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Delete invoice"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
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
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f1f35] rounded-3xl border border-gold/30 p-6 md:p-8 shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black dark:text-white font-display uppercase">Add Invoice</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
              >
                <X size={18} />
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
