import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, AlertTriangle, Check, FileJson, Copy, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WorkLink } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: WorkLink[];
  onImportLinks: (imported: WorkLink[]) => void;
  onResetDefaults: () => void;
  onSaveAndLock: () => void;
  onOpenExportSheet?: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  links,
  onImportLinks,
  onResetDefaults,
  onSaveAndLock,
  onOpenExportSheet,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isCopiedJson, setIsCopiedJson] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(links, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `portal-kerja-dialisis-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    const jsonString = JSON.stringify(links, null, 2);
    navigator.clipboard.writeText(jsonString);
    setIsCopiedJson(true);
    setTimeout(() => setIsCopiedJson(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportLinks(parsed);
          setImportStatus(`Berhasil memulihkan ${parsed.length} link pekerjaan!`);
          setErrorStatus(null);
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setErrorStatus('Format file JSON tidak valid atau kosong.');
        }
      } catch (err) {
        setErrorStatus('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua link ke pengaturan default awal? Semua penyesuaian link akan terhapus.')) {
      onResetDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0c121e] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Simpan, Tetapkan & Cadangkan Link
              </h2>
              <p className="text-xs text-slate-400">
                Pastikan link yang sudah diinputkan aman dan tersimpan permanen
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

        {importStatus && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <Check className="h-4 w-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {errorStatus && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorStatus}</span>
          </div>
        )}

        <div className="space-y-3.5">
          
          {/* Action 1: Lock & Save Explicitly */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-0.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Tetapkan & Kunci di Browser Ini</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Menyimpan seluruh {links.length} link pekerjaan ke memori lokal browser agar tidak pernah hilang.
              </p>
            </div>
            <button
              onClick={() => {
                onSaveAndLock();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shrink-0 shadow-lg shadow-emerald-600/20"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Simpan & Kunci</span>
            </button>
          </div>

          {/* Action 1.5: Export to Google Sheet */}
          {onOpenExportSheet && (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-emerald-300 mb-0.5">
                  Ekspor ke Google Sheet (.csv / Tabel)
                </div>
                <p className="text-[11px] text-slate-400">
                  Pindahkan seluruh link yang sudah Anda inputkan ke 1 file Google Sheet secara otomatis.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenExportSheet();
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shrink-0"
              >
                <span>Buka Ekspor Sheet</span>
              </button>
            </div>
          )}

          {/* Action 2: Copy JSON text */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white mb-0.5">
                Salin Data Link Saya (JSON)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Salin seluruh data link ke clipboard untuk dikirimkan di chat bila ingin dijadikan bawaan permanen di server.
              </p>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.1] bg-white/[0.05] text-xs font-semibold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-colors shrink-0"
            >
              {isCopiedJson ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Data</span>
                </>
              )}
            </button>
          </div>

          {/* Action 3: Export to file */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white mb-0.5">
                Download File Cadangan (.json)
              </div>
              <p className="text-[11px] text-slate-400">
                Unduh file cadangan untuk disimpan di flashdisk atau dipindahkan ke komputer/HP lain.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh File</span>
            </button>
          </div>

          {/* Action 4: Import Box */}
          <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white mb-0.5">
                Pulihkan / Impor File Cadangan
              </div>
              <p className="text-[11px] text-slate-400">
                Buka file cadangan .json yang pernah diunduh sebelumnya.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors shrink-0 w-full sm:w-auto"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Pilih File</span>
              </button>
            </div>
          </div>

          {/* Action 5: Reset to Defaults */}
          <div className="p-4 rounded-xl border border-rose-950/40 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-rose-300 mb-0.5">
                Kembalikan ke Default Awal
              </div>
              <p className="text-[11px] text-slate-400">
                Hapus penyesuaian dan kembali ke setelan pabrik.
              </p>
            </div>
            <button
              onClick={handleConfirmReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-rose-600/30 bg-rose-600/10 text-xs font-semibold text-rose-300 hover:bg-rose-600 hover:text-white transition-colors shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.08] text-right">
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
