import React, { useState, useEffect } from 'react';
import { X, Link2, FileSpreadsheet, FolderGit2, Check, Sparkles } from 'lucide-react';
import { WorkLink, CategoryType } from '../types';
import { AVAILABLE_ICONS, DynamicIcon } from './DynamicIcon';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Partial<WorkLink>) => void;
  initialLink?: WorkLink | null;
  defaultCategory?: CategoryType;
}

const COLOR_OPTIONS: Array<WorkLink['accentColor']> = [
  'indigo',
  'blue',
  'emerald',
  'teal',
  'cyan',
  'amber',
  'violet',
  'rose',
];

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLink,
  defaultCategory = 'MANAGERIAL',
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CategoryType>(defaultCategory);
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('FileSpreadsheet');
  const [accentColor, setAccentColor] = useState<WorkLink['accentColor']>('indigo');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialLink) {
      setTitle(initialLink.title);
      setUrl(initialLink.url);
      setCategory(initialLink.category);
      setDescription(initialLink.description || '');
      setIconName(initialLink.iconName || 'FileSpreadsheet');
      setAccentColor(initialLink.accentColor || 'indigo');
      setTagsInput(initialLink.tags ? initialLink.tags.join(', ') : '');
    } else {
      setTitle('');
      setUrl('https://');
      setCategory(defaultCategory);
      setDescription('');
      setIconName(defaultCategory === 'MANAGERIAL' ? 'TrendingUp' : 'ClipboardList');
      setAccentColor(defaultCategory === 'MANAGERIAL' ? 'indigo' : 'emerald');
      setTagsInput('');
    }
    setError('');
  }, [initialLink, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul link pekerjaan harus diisi.');
      return;
    }
    if (!url.trim() || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setError('URL harus diawali dengan https:// atau http://');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: initialLink?.id,
      title: title.trim(),
      url: url.trim(),
      category,
      description: description.trim(),
      iconName,
      accentColor,
      tags,
    });
    onClose();
  };

  const handleQuickPreset = (type: string) => {
    switch (type) {
      case 'gsheet':
        setUrl('https://docs.google.com/spreadsheets');
        setIconName('FileSpreadsheet');
        break;
      case 'gdocs':
        setUrl('https://docs.google.com/document');
        setIconName('FileText');
        break;
      case 'gdrive':
        setUrl('https://drive.google.com');
        setIconName('Package');
        break;
      case 'gforms':
        setUrl('https://forms.google.com');
        setIconName('ClipboardList');
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {initialLink ? 'Edit Link Pekerjaan' : 'Tambah Link Pekerjaan Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Tersimpan langsung di perangkat tanpa perlu login
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kategori Penempatan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('MANAGERIAL')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                  category === 'MANAGERIAL'
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                DATA MANAGERIAL
              </button>
              <button
                type="button"
                onClick={() => setCategory('UNIT')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                  category === 'UNIT'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                DATA UNIT
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama / Judul Tombol Pekerjaan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Spreadsheet Target Penjualan 2026"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Alamat URL Link Pekerjaan <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-1 text-[10px] text-slate-400">
                <span>Preset:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('gsheet')}
                  className="hover:text-indigo-400 underline"
                >
                  Sheets
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('gforms')}
                  className="hover:text-indigo-400 underline"
                >
                  Forms
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('gdrive')}
                  className="hover:text-indigo-400 underline"
                >
                  Drive
                </button>
              </div>
            </div>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan fungsi formulir atau dokumen ini..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Label / Tag (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Harian, Laporan, Rutin, Urgent"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Icon Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pilih Ikon Simbol
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg max-h-28 overflow-y-auto">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setIconName(icon)}
                  className={`p-2 rounded-lg transition-colors ${
                    iconName === icon
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                  title={icon}
                >
                  <DynamicIcon name={icon} className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Accent Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Warna Aksen Tombol
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => {
                const bgColors: Record<string, string> = {
                  indigo: 'bg-indigo-600',
                  blue: 'bg-blue-600',
                  emerald: 'bg-emerald-600',
                  teal: 'bg-teal-600',
                  cyan: 'bg-cyan-600',
                  amber: 'bg-amber-600',
                  violet: 'bg-violet-600',
                  rose: 'bg-rose-600',
                };
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccentColor(c)}
                    className={`h-6 w-6 rounded-full transition-all ${bgColors[c]} ${
                      accentColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition-colors"
            >
              {initialLink ? 'Simpan Perubahan' : 'Tambah ke Tombol Pekerjaan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
