import React, { useState } from 'react';
import { Star, ArrowLeft, ExternalLink, Copy, Check, Edit2, Trash2 } from 'lucide-react';
import { WorkLink, CategoryType } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ACCENT_STYLES, parseHostname } from '../utils/colors';

interface FavoritesViewProps {
  pinnedLinks: WorkLink[];
  onBackToHome: () => void;
  onOpenLink: (link: WorkLink) => void;
  onTogglePin: (linkId: string) => void;
  onEditLink: (link: WorkLink) => void;
  onDeleteLink: (linkId: string) => void;
  onSelectCategory: (cat: CategoryType) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  pinnedLinks,
  onBackToHome,
  onOpenLink,
  onTogglePin,
  onEditLink,
  onDeleteLink,
  onSelectCategory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, link: WorkLink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Nav */}
      <div className="flex items-center gap-3 border-b border-white/[0.08] pb-5">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Pilihan Kategori</span>
        </button>
        <span className="text-slate-600">/</span>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400" />
          Koleksi Favorit
        </span>
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#1c1810] via-[#0c1220] to-[#090d16] p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/[0.1] text-amber-300 uppercase tracking-wider">
            Akses Diprioritaskan
          </span>
          <span className="text-xs text-slate-400 font-mono">· {pinnedLinks.length} Link Disematkan</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Link Pekerjaan Favorit
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Kumpulan tautan prioritas tinggi yang sering Anda akses setiap hari, dihimpun dari Data Managerial dan Data Unit untuk akses instan.
        </p>
      </div>

      {pinnedLinks.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-white/[0.06] bg-[#0c121e]/60">
          <Star className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300 mb-1">
            Belum ada link yang ditandai sebagai favorit
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Klik ikon bintang (⭐) pada kartu link di Data Managerial atau Data Unit untuk menyematkannya di sini.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onSelectCategory('MANAGERIAL')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              Buka Data Managerial
            </button>
            <button
              onClick={() => onSelectCategory('UNIT')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              Buka Data Unit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pinnedLinks.map((link) => {
            const style = ACCENT_STYLES[link.accentColor] || ACCENT_STYLES.indigo;
            const hostname = parseHostname(link.url);
            const isCopied = copiedId === link.id;

            return (
              <div
                key={link.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c121e]/90 p-5 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-[#0e1628]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.bgLight} ${style.text} border ${style.border}`}>
                        <DynamicIcon name={link.iconName} className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block truncate max-w-[150px]">
                          {hostname}
                        </span>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {link.category === 'MANAGERIAL' ? 'Data Managerial' : 'Data Unit'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePin(link.id)}
                      className="p-1.5 rounded-lg text-amber-400 hover:bg-white/[0.08] transition-colors"
                      title="Hapus dari favorit"
                    >
                      <Star className="h-4 w-4 fill-amber-400" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {link.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {link.description}
                  </p>
                </div>

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

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <button
                      onClick={(e) => handleCopy(e, link)}
                      className="flex items-center gap-1 hover:text-slate-300 py-1 transition-colors"
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
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteLink(link.id)}
                        className="flex items-center gap-1 hover:text-rose-400 py-1 transition-colors"
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
    </div>
  );
};
