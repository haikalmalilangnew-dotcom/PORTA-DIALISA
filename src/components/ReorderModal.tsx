import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, ArrowUpDown, Check, GripVertical } from 'lucide-react';
import { WorkLink, CategoryType } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { ACCENT_STYLES } from '../utils/colors';

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
  categoryTitle: string;
  links: WorkLink[];
  onSaveOrder: (category: CategoryType, newOrder: WorkLink[]) => void;
}

export const ReorderModal: React.FC<ReorderModalProps> = ({
  isOpen,
  onClose,
  category,
  categoryTitle,
  links,
  onSaveOrder,
}) => {
  const [items, setItems] = useState<WorkLink[]>(links);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setItems(links);
    setHasChanges(false);
  }, [links, isOpen]);

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
    setHasChanges(true);
    // Instant save for seamless UX
    onSaveOrder(category, newItems);
  };

  const handleMoveToExtreme = (index: number, position: 'top' | 'bottom') => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(index, 1);
    if (position === 'top') {
      newItems.unshift(movedItem);
    } else {
      newItems.push(movedItem);
    }
    setItems(newItems);
    setHasChanges(true);
    onSaveOrder(category, newItems);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0c121e] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.1] text-white">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Atur Urutan Tombol {categoryTitle}
              </h2>
              <p className="text-xs text-slate-400">
                Gunakan panah naik atau turun untuk memindahkan posisi urutan link pekerjaan.
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

        {/* List of items to reorder */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {items.map((item, index) => {
            const style = ACCENT_STYLES[item.accentColor] || ACCENT_STYLES.indigo;
            const isFirst = index === 0;
            const isLast = index === items.length - 1;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-[#0a0f1a] hover:border-white/[0.15] transition-all"
              >
                {/* Number & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-xs font-bold text-slate-300">
                    #{index + 1}
                  </div>
                  <div className={`p-2 rounded-lg shrink-0 ${style.bgLight} ${style.text}`}>
                    <DynamicIcon name={item.iconName} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {item.url}
                    </div>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={isFirst}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.1] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Pindah ke Atas"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={isLast}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.1] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Pindah ke Bawah"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleMoveToExtreme(index, 'top')}
                    disabled={isFirst}
                    className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Pindah langsung ke urutan teratas"
                  >
                    Teratas
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 mt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            {items.length} link pekerjaan · Perubahan tersimpan otomatis
          </span>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shadow hover:bg-slate-200 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Selesai</span>
          </button>
        </div>

      </div>
    </div>
  );
};
