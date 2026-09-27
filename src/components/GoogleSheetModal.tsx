import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Link as LinkIcon,
  Check,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Unlink,
  CheckCircle2,
} from 'lucide-react';
import { WorkLink } from '../types';
import {
  extractSheetId,
  fetchLinksFromGoogleSheet,
  generateTemplateCSV,
} from '../utils/googleSheets';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetUrl: string;
  onConnectSheet: (url: string, fetchedLinks: WorkLink[]) => void;
  onDisconnectSheet: () => void;
  currentLinks: WorkLink[];
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  currentSheetUrl,
  onConnectSheet,
  onDisconnectSheet,
  currentLinks,
}) => {
  const [urlInput, setUrlInput] = useState(currentSheetUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isCopiedTemplate, setIsCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const handleTestAndConnect = async () => {
    if (!urlInput.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Masukkan URL Google Sheet Anda terlebih dahulu.',
      });
      return;
    }

    const sheetId = extractSheetId(urlInput);
    if (!sheetId) {
      setStatusMessage({
        type: 'error',
        text: 'Format URL Google Sheet tidak valid. Contoh: https://docs.google.com/spreadsheets/d/1BxiMVs.../edit',
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const result = await fetchLinksFromGoogleSheet(urlInput);
    setIsLoading(false);

    if (result.error) {
      setStatusMessage({
        type: 'error',
        text: result.error,
      });
    } else {
      setStatusMessage({
        type: 'success',
        text: `Berhasil terhubung! Ditemukan ${result.links.length} tombol link dari Google Sheet.`,
      });
      onConnectSheet(urlInput.trim(), result.links);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleCopyTemplate = () => {
    const csv = generateTemplateCSV(currentLinks);
    navigator.clipboard.writeText(csv);
    setIsCopiedTemplate(true);
    setTimeout(() => setIsCopiedTemplate(false), 3000);
  };

  const handleDisconnect = () => {
    if (window.confirm('Putuskan koneksi ke Google Sheet dan kembali ke penyimpanan lokal?')) {
      onDisconnectSheet();
      setUrlInput('');
      setStatusMessage(null);
    }
  };

  const sheetId = extractSheetId(currentSheetUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0c121e] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Hubungkan 1 Google Sheet Realtime
              </h2>
              <p className="text-xs text-slate-400">
                Semua perangkat otomatis sinkron secara realtime tanpa perlu login atau simpan file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Connection Status Badge */}
        {currentSheetUrl ? (
          <div className="mb-5 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  Status: Terhubung Aktif ke Google Sheet (Realtime)
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                  ID: {sheetId}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={currentSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                title="Buka Google Sheet ini di tab baru untuk menambah atau mengedit link"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Buka Google Sheet</span>
              </a>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
                title="Putus hubungan dari Google Sheet ini"
              >
                <Unlink className="h-3.5 w-3.5" />
                <span>Putus</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-slate-300 leading-relaxed">
            💡 <strong>Bagaimana cara kerjanya?</strong> Anda cukup meletakkan link di 1 file Google Sheet. Setiap kali Anda atau rekan kerja mengedit Google Sheet tersebut, semua komputer dan HP yang membuka portal ini akan langsung memperbarui link secara otomatis!
          </div>
        )}

        {statusMessage && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl p-3.5 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form to connect sheet */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              URL Google Sheet Anda
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit"
                  className="w-full rounded-xl border border-white/[0.1] bg-[#080d16] py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handleTestAndConnect}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{currentSheetUrl ? 'Perbarui Koneksi' : 'Hubungkan Realtime'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              ⚠️ <strong>Penting:</strong> Pada Google Sheet Anda, klik tombol <strong>Bagikan (Share)</strong> di kanan atas, lalu ubah akses umum menjadi: <strong className="text-emerald-400">"Siapa saja yang memiliki link dapat melihat" (Anyone with the link can view)</strong>.
            </p>
          </div>

          {/* Quick Setup Guide Box */}
          <div className="border-t border-white/[0.08] pt-5 mt-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Langkah Cepat Membuat Google Sheet Baru:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 1: Open Sheets */}
              <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-200 mb-1">
                    1. Buka Google Sheets Baru
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Buka spreadsheet kosong baru di Google Drive Anda.
                  </p>
                </div>
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>Buka sheets.new</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Step 2: Copy Format */}
              <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-200 mb-1">
                    2. Salin Data Seluruh 15 Link
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Salin seluruh 15 link yang sudah ada dan langsung tempelkan (Ctrl+V) di sel A1 Google Sheet.
                  </p>
                </div>
                <button
                  onClick={handleCopyTemplate}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold self-start"
                >
                  {isCopiedTemplate ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Data Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin Format CSV 15 Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Column Structure preview */}
            <div className="p-3 rounded-xl border border-white/[0.06] bg-[#070b13] text-[11px] font-mono text-slate-400 overflow-x-auto">
              <div className="text-slate-500 mb-1 text-[10px] uppercase font-bold tracking-wider font-sans">
                Susunan Kolom di Google Sheet:
              </div>
              <div className="text-slate-300 whitespace-nowrap">
                Kolom A: <span className="text-indigo-400 font-bold">Kategori</span> (MANAGERIAL atau UNIT) | Kolom B: <span className="text-indigo-400 font-bold">Judul</span> | Kolom C: <span className="text-indigo-400 font-bold">URL</span> | Kolom D: <span className="text-slate-400">Deskripsi</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Perubahan di Google Sheet langsung tampil untuk semua pengguna
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
