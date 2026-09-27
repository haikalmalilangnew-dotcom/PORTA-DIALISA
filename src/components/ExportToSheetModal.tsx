import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  ExternalLink,
  Table,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { WorkLink } from '../types';
import {
  generateTSVForGoogleSheets,
  downloadCSV,
} from '../utils/googleSheets';

interface ExportToSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: WorkLink[];
  onOpenGoogleSheetConnect: () => void;
}

export const ExportToSheetModal: React.FC<ExportToSheetModalProps> = ({
  isOpen,
  onClose,
  links,
  onOpenGoogleSheetConnect,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyTSV = () => {
    const tsvData = generateTSVForGoogleSheets(links);
    navigator.clipboard.writeText(tsvData);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleDownload = () => {
    downloadCSV(links, `link-pekerjaan-dialisis-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const managerialCount = links.filter((l) => l.category === 'MANAGERIAL').length;
  const unitCount = links.filter((l) => l.category === 'UNIT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/[0.1] bg-[#0c121e] p-6 shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Ekspor Semua Link ke Google Sheet
              </h2>
              <p className="text-xs text-slate-400">
                Pindahkan {links.length} link ({managerialCount} Managerial, {unitCount} Data Unit) ke dalam Google Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Primary Option: Copy formatted table */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Cara 1: Salin Tabel (Paling Cepat)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Salin seluruh data kolom & baris ke clipboard, lalu tinggal tekan <strong>Ctrl + V</strong> di sel A1 Google Sheet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyTSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Data Tabel Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Tabel untuk Google Sheet</span>
                    </>
                  )}
                </button>

                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  <span>Buka sheets.new</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Secondary Option: Download CSV */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <Download className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>Cara 2: Unduh File Spreadsheet (.csv)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Unduh file .csv yang dapat langsung diunggah ke Google Drive atau dibuka di aplikasi Excel laptop Anda.
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors self-start"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download File CSV</span>
              </button>
            </div>

          </div>

          {/* 3 Step Visual Guide */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#070b13] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              3 Langkah Praktis Memasukkan ke Google Sheet:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                <div className="font-mono text-emerald-400 font-bold mb-1">Langkah 1</div>
                <p className="text-slate-300 text-[11px]">
                  Klik tombol <strong>"Salin Tabel untuk Google Sheet"</strong> di atas.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                <div className="font-mono text-emerald-400 font-bold mb-1">Langkah 2</div>
                <p className="text-slate-300 text-[11px]">
                  Buka tab baru Google Sheet (klik tombol <strong>sheets.new</strong>).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                <div className="font-mono text-emerald-400 font-bold mb-1">Langkah 3</div>
                <p className="text-slate-300 text-[11px]">
                  Klik di sel <strong>A1</strong> dan tekan <strong>Ctrl + V</strong>. Selesai!
                </p>
              </div>
            </div>
          </div>

          {/* Table Preview of exported links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Table className="h-4 w-4 text-slate-400" />
                <span>Pratinjau Data yang Diekspor ({links.length} Baris):</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Kolom A s/d G
              </span>
            </div>

            <div className="rounded-xl border border-white/[0.08] overflow-hidden overflow-x-auto bg-[#070b13]">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-white/[0.04] text-slate-400 border-b border-white/[0.08] font-mono">
                  <tr>
                    <th className="py-2 px-3">No</th>
                    <th className="py-2 px-3">Kategori</th>
                    <th className="py-2 px-3">Judul Tombol</th>
                    <th className="py-2 px-3">URL Tautan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-slate-300">
                  {links.map((link, idx) => (
                    <tr key={link.id} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            link.category === 'MANAGERIAL'
                              ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          {link.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-white max-w-[200px] truncate">
                        {link.title}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400 max-w-[250px] truncate">
                        {link.url}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Connect Back Callout */}
          <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-300">
              💡 <strong>Ingin portal selalu terhubung realtime dengan Google Sheet ini?</strong>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Cukup salin link Google Sheet yang baru Anda buat, lalu hubungkan ke portal.
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenGoogleSheetConnect();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 self-start sm:self-auto transition-colors"
            >
              <span>Hubungkan Realtime</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Format kompatibel 100% dengan Google Sheets dan Microsoft Excel
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
