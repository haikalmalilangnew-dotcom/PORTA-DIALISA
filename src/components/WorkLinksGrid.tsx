import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Star,
  Plus,
  Layers,
  Briefcase,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { CategoryType, WorkLink } from '../types';
import { CATEGORIES_META } from '../data/defaultLinks';
import { DynamicIcon } from './DynamicIcon';
import { ACCENT_STYLES, parseHostname } from '../utils/colors';
import { ReorderModal } from './ReorderModal';

interface WorkLinksGridProps {
  currentCategory: CategoryType;
  links: WorkLink[];
  onBackToHome: () => void;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenLink: (link: WorkLink) => void;
  onTogglePin: (linkId: string) => void;
  onEditLink: (link: WorkLink) => void;
  onDeleteLink: (linkId: string) => void;
  onAddNewLink: () => void;
  onOpenBackupModal: () => void;
  onMoveLink: (linkId: string, direction: 'up' | 'down') => void;
  onReorderCategory: (category: CategoryType, newOrder: WorkLink[]) => void;
  onSaveAndLock: () => void;
  googleSheetUrl: string;
  isSyncingSheet: boolean;
  onOpenGoogleSheetModal: () => void;
  onManualSyncSheet: () => void;
  onOpenExportSheetModal: () => void;
}

export const WorkLinksGrid: React.FC<WorkLinksGridProps> = ({
  currentCategory,
  links,
  onBackToHome,
  onSelectCategory,
  onOpenLink,
  onTogglePin,
  onEditLink,
  onDeleteLink,
  onAddNewLink,
  onOpenBackupModal,
  onMoveLink,
  onReorderCategory,
  onSaveAndLock,
  googleSheetUrl,
  isSyncingSheet,
  onOpenGoogleSheetModal,
  onManualSyncSheet,
  onOpenExportSheetModal,
}) => {
  const meta = CATEGORIES_META[currentCategory];
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const isManagerial = currentCategory === 'MANAGERIAL';

  const handleCopy = (e: React.MouseEvent, link: WorkLink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAll = () => {
    if (links.length === 0) return;
    const confirmOpen = window.confirm(
      `Buka sekaligus ${links.length} link di tab baru? (Pastikan browser Anda mengizinkan pop-up)`
    );
    if (!confirmOpen) return;
    links.forEach((link) => {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      onOpenLink(link);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation & Category Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        
        {/* Left: Back & Category Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Pilihan Kategori</span>
          </button>

          <div className="h-5 w-px bg-white/[0.1] hidden sm:block"></div>

          {/* Minimalist Switcher */}
          <div className="flex items-center p-1 rounded-xl border border-white/[0.08] bg-[#0c121e]">
            <button
              onClick={() => onSelectCategory('MANAGERIAL')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isManagerial
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>DATA MANAGERIAL</span>
            </button>
            <button
              onClick={() => onSelectCategory('UNIT')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isManagerial
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>DATA UNIT</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Google Sheets Realtime Integration */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenGoogleSheetModal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                googleSheetUrl
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Hubungkan atau atur Google Sheet realtime"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{googleSheetUrl ? 'Google Sheet Aktif' : 'Google Sheet'}</span>
            </button>

            {googleSheetUrl && (
              <button
                onClick={onManualSyncSheet}
                disabled={isSyncingSheet}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                title="Tarik pembaruan dari Google Sheet sekarang"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {/* Ekspor ke Google Sheet */}
          <button
            onClick={onOpenExportSheetModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-semibold text-emerald-300 hover:bg-emerald-500/[0.15] hover:text-white transition-colors"
            title="Ekspor seluruh link ke Google Sheet"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ekspor ke Sheet</span>
          </button>

          {/* Quick Lock & Save */}
          <button
            onClick={onSaveAndLock}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-semibold text-emerald-300 hover:bg-emerald-500/[0.15] transition-colors"
            title="Kunci dan simpan seluruh link secara permanen"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Simpan & Tetapkan</span>
          </button>

          {/* Reorder Button */}
          <button
            onClick={() => setIsReorderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.05] text-xs font-semibold text-slate-200 hover:bg-white/[0.1] hover:text-white transition-colors"
            title="Ubah urutan posisi tombol pekerjaan"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" />
            <span>Atur Urutan</span>
          </button>

          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition-colors"
            title="Cadangkan / Pulihkan"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={handleOpenAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition-colors"
            title="Buka seluruh link kategori ini sekaligus"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Buka Semua Tab</span>
          </button>

          <button
            onClick={onAddNewLink}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
              isManagerial
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Link Baru</span>
          </button>
        </div>

      </div>

      {/* Category Hero Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all ${
          isManagerial
            ? 'border-indigo-500/30 bg-gradient-to-br from-[#0e162a] via-[#0c1220] to-[#090d16]'
            : 'border-emerald-500/30 bg-gradient-to-br from-[#0c1c1b] via-[#0c1220] to-[#090d16]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                  isManagerial
                    ? 'bg-indigo-500/[0.1] border-indigo-500/30 text-indigo-300'
                    : 'bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-300'
                }`}
              >
                Katalog Aktif
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {links.length} Link Pekerjaan Siap Dibuka
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
              {meta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {meta.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReorderMode(!isReorderMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isReorderMode
                  ? 'bg-white text-slate-950 font-bold border-white shadow-lg'
                  : 'bg-white/[0.04] text-slate-300 border-white/[0.1] hover:bg-white/[0.08]'
              }`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{isReorderMode ? 'Tutup Mode Urutan' : 'Tampilkan Tombol Urutan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Work Buttons */}
      {links.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-white/[0.06] bg-[#0c121e]/60">
          <p className="text-sm font-semibold text-slate-300 mb-1">
            Belum ada link pekerjaan pada kategori ini
          </p>
          <p className="text-xs text-slate-500 mb-5">
            Tekan tombol tambah link untuk memasukkan instrumen kerja baru.
          </p>
          <button
            onClick={onAddNewLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shadow hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Link Baru Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link, index) => {
            const style = ACCENT_STYLES[link.accentColor] || ACCENT_STYLES.indigo;
            const hostname = parseHostname(link.url);
            const isCopied = copiedId === link.id;
            const isFirst = index === 0;
            const isLast = index === links.length - 1;

            return (
              <div
                key={link.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c121e]/90 p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-[#0e1628]"
              >
                <div>
                  {/* Card Header: Number badge, Icon, Domain, Up/Down, Star */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      {/* Sequence Number */}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] font-mono text-[11px] font-bold text-slate-400">
                        #{index + 1}
                      </span>

                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.bgLight} ${style.text} border ${style.border}`}>
                        <DynamicIcon name={link.iconName} className="h-5 w-5" />
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[140px]">
                          {hostname}
                        </span>
                        {link.clickCount !== undefined && link.clickCount > 0 && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Dibuka {link.clickCount}x
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Quick Move Buttons (Always visible or highlighted in reorder mode) */}
                      <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLink(link.id, 'up');
                          }}
                          disabled={isFirst}
                          className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-white/[0.1] hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Pindah ke Atas / Geser ke Depan"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveLink(link.id, 'down');
                          }}
                          disabled={isLast}
                          className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-white/[0.1] hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Pindah ke Bawah / Geser ke Belakang"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Favorite Pin */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(link.id);
                        }}
                        className={`p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors ${
                          link.isPinned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-500 hover:text-amber-300'
                        }`}
                        title={link.isPinned ? 'Hapus dari favorit' : 'Tandai sebagai favorit'}
                      >
                        <Star className={`h-4 w-4 ${link.isPinned ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors mb-1.5 leading-snug">
                    {link.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {link.description || 'Tidak ada deskripsi.'}
                  </p>

                  {/* Tags */}
                  {link.tags && link.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {link.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.05]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: BIG CLEAN BUTTON TO OPEN LINK */}
                <div className="border-t border-white/[0.06] pt-3.5 space-y-2.5">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onOpenLink(link)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-white hover:text-slate-950 transition-all shadow-md group-hover:shadow-lg"
                  >
                    <span>Buka Dokumen / Link</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {/* Secondary Tools */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <button
                      onClick={(e) => handleCopy(e, link)}
                      className="flex items-center gap-1 hover:text-slate-300 py-1 transition-colors"
                      title="Salin tautan"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditLink(link)}
                        className="flex items-center gap-1 hover:text-slate-300 py-1 transition-colors"
                        title="Edit link atau ganti URL"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onDeleteLink(link.id)}
                        className="flex items-center gap-1 hover:text-rose-400 py-1 transition-colors"
                        title="Hapus link ini"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Reorder for convenient vertical list manipulation */}
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        category={currentCategory}
        categoryTitle={meta.title}
        links={links}
        onSaveOrder={onReorderCategory}
      />

    </div>
  );
};
