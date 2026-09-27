import React from 'react';
import {
  Briefcase,
  Layers,
  ArrowUpRight,
  Star,
  ExternalLink,
  ShieldCheck,
  Plus,
  Download,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { CategoryType, WorkLink } from '../types';
import { CATEGORIES_META } from '../data/defaultLinks';
import { DynamicIcon } from './DynamicIcon';
import { ACCENT_STYLES } from '../utils/colors';

interface HomeSelectorProps {
  onSelectCategory: (category: CategoryType) => void;
  managerialLinks: WorkLink[];
  unitLinks: WorkLink[];
  pinnedLinks: WorkLink[];
  onOpenLink: (link: WorkLink) => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onSelectFavorites: () => void;
  onSaveAndLock: () => void;
  googleSheetUrl: string;
  isSyncingSheet: boolean;
  onOpenGoogleSheetModal: () => void;
  onManualSyncSheet: () => void;
  onOpenExportSheetModal: () => void;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({
  onSelectCategory,
  managerialLinks,
  unitLinks,
  pinnedLinks,
  onOpenLink,
  onOpenAddModal,
  onOpenBackupModal,
  onSelectFavorites,
  onSaveAndLock,
  googleSheetUrl,
  isSyncingSheet,
  onOpenGoogleSheetModal,
  onManualSyncSheet,
  onOpenExportSheetModal,
}) => {
  const managerialMeta = CATEGORIES_META.MANAGERIAL;
  const unitMeta = CATEGORIES_META.UNIT;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      
      {/* Top Utility Dock: Elegant, minimalist, no header clutter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-display font-bold text-xs text-white">
            PD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-300">
              PORTA-DIALISA
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Unit Dialisis RS Happy Land Medical Centre Yogyakarta
            </span>
          </div>
        </div>

        {/* Discreet Actions Dock */}
        <div className="flex flex-wrap items-center gap-2">
          {pinnedLinks.length > 0 && (
            <button
              onClick={onSelectFavorites}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] text-xs font-medium text-amber-300 hover:bg-amber-500/[0.12] transition-colors"
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>Favorit ({pinnedLinks.length})</span>
            </button>
          )}

          {/* Google Sheets Realtime Integration Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenGoogleSheetModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                googleSheetUrl
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Hubungkan atau atur Google Sheet realtime"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>{googleSheetUrl ? 'Google Sheet Aktif' : 'Hubungkan 1 Google Sheet'}</span>
            </button>

            {googleSheetUrl && (
              <button
                onClick={onManualSyncSheet}
                disabled={isSyncingSheet}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                title="Tarik perubahan terbaru dari Google Sheet sekarang"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {/* Ekspor ke Google Sheet Button */}
          <button
            onClick={onOpenExportSheetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-semibold text-emerald-300 hover:bg-emerald-500/[0.15] hover:text-white transition-colors"
            title="Ekspor seluruh link yang sudah diinputkan ke Google Sheet"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ekspor ke Sheet</span>
          </button>

          <button
            onClick={onSaveAndLock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Kunci dan simpan seluruh link secara permanen"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            <span>Simpan</span>
          </button>

          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
            title="Cadangkan atau Salin Data JSON"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-slate-950 text-xs font-bold shadow hover:bg-slate-200 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Link</span>
          </button>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Pusat Navigasi Pekerjaan Terpadu</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
          Pilih Kategori Kerja
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Pilih salah satu portal di bawah ini untuk langsung membuka semua instrumen dokumen, spreadsheet, dan sistem operasional Anda.
        </p>
      </div>

      {/* THE TWO MAIN BUTTONS: DATA MANAGERIAL vs DATA UNIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-2">
        
        {/* BUTTON 1: DATA MANAGERIAL */}
        <div
          onClick={() => onSelectCategory('MANAGERIAL')}
          className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c121f]/80 p-7 sm:p-9 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0e1628]/95 hover:shadow-indigo-500/10 cursor-pointer"
        >
          <div>
            {/* Card Header & Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/[0.12] border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all duration-300">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-md">
                {managerialLinks.length} TOMBOL TERSEDIA
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-400/90 block mb-1">
                Kategori Kepemimpinan & Evaluasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                DATA MANAGERIAL
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              {managerialMeta.description}
            </p>

            {/* Quick Preview Chips */}
            <div className="border-t border-white/[0.06] pt-4 mb-6">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Daftar instrumen utama:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {managerialLinks.map((link) => (
                  <span
                    key={link.id}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.05]"
                  >
                    {link.title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Master Action Button */}
          <button
            onClick={() => onSelectCategory('MANAGERIAL')}
            className="flex items-center justify-between w-full py-3 px-5 rounded-xl bg-indigo-600/90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-600 transition-all"
          >
            <span>Buka Seluruh Tombol Data Managerial</span>
            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* BUTTON 2: DATA UNIT */}
        <div
          onClick={() => onSelectCategory('UNIT')}
          className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c121f]/80 p-7 sm:p-9 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:bg-[#0d1822]/95 hover:shadow-emerald-500/10 cursor-pointer"
        >
          <div>
            {/* Card Header & Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/[0.12] border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300">
                <Layers className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-md">
                {unitLinks.length} TOMBOL TERSEDIA
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400/90 block mb-1">
                Kategori Operasional & Klinis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                DATA UNIT
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              {unitMeta.description}
            </p>

            {/* Quick Preview Chips */}
            <div className="border-t border-white/[0.06] pt-4 mb-6">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Daftar modul utama:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {unitLinks.slice(0, 5).map((link) => (
                  <span
                    key={link.id}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.05]"
                  >
                    {link.title}
                  </span>
                ))}
                {unitLinks.length > 5 && (
                  <span className="text-[11px] px-2 py-1 text-slate-500 font-mono">
                    +{unitLinks.length - 5} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Master Action Button */}
          <button
            onClick={() => onSelectCategory('UNIT')}
            className="flex items-center justify-between w-full py-3 px-5 rounded-xl bg-emerald-600/90 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-600 transition-all"
          >
            <span>Buka Seluruh Tombol Data Unit</span>
            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* QUICK ACCESS: FAVORITE LINKS (IF ANY) */}
      {pinnedLinks.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Link Prioritas Cepat
              </h3>
            </div>
            <button
              onClick={onSelectFavorites}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Lihat Semua Favorit ({pinnedLinks.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinnedLinks.slice(0, 6).map((link) => {
              const style = ACCENT_STYLES[link.accentColor] || ACCENT_STYLES.indigo;
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-[#0c121e]/80 hover:border-white/[0.15] transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${style.bgLight} ${style.text}`}>
                      <DynamicIcon name={link.iconName} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-300">
                        {link.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {link.category === 'MANAGERIAL' ? 'Data Managerial' : 'Data Unit'}
                      </div>
                    </div>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onOpenLink(link)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300 hover:bg-white hover:text-slate-950 transition-colors"
                    title={`Buka ${link.title}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trust & Local Storage Notice */}
      <div className="pt-2 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Setiap perubahan link pekerjaan disimpan secara lokal di browser Anda. Klik <strong>Edit</strong> pada kartu untuk menyesuaikan tautan kerja nyata Anda.</span>
        </p>
      </div>

    </div>
  );
};
