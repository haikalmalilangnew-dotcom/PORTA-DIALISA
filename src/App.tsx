import React, { useState, useEffect } from 'react';
import { HomeSelector } from './components/HomeSelector';
import { WorkLinksGrid } from './components/WorkLinksGrid';
import { FavoritesView } from './components/FavoritesView';
import { LinkModal } from './components/LinkModal';
import { BackupModal } from './components/BackupModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { ExportToSheetModal } from './components/ExportToSheetModal';
import { CategoryType, WorkLink } from './types';
import { DEFAULT_WORK_LINKS, FIXED_GOOGLE_SHEET_URL } from './data/defaultLinks';
import { fetchLinksFromGoogleSheet } from './utils/googleSheets';

const STORAGE_KEYS = [
  'portal_kerja_dialisis_v3',
  'portal_kerja_links_v1',
  'portal_kerja_links',
  'portal_kerja_permanent',
];

const GSHEET_STORAGE_KEY = 'portal_kerja_gsheet_url_v1';

export default function App() {
  const [links, setLinks] = useState<WorkLink[]>(() => {
    // 1. Try reading across all known storage keys
    for (const key of STORAGE_KEYS) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error(`Failed to read from localStorage key ${key}`, e);
      }
    }
    return DEFAULT_WORK_LINKS;
  });

  const [currentView, setCurrentView] = useState<'home' | CategoryType | 'favorites'>('home');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Google Sheets Realtime State: Permanently fixed to the user's Google Sheet
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(GSHEET_STORAGE_KEY);
      if (saved && saved.trim()) {
        return saved;
      }
    } catch {
      // fallback
    }
    return FIXED_GOOGLE_SHEET_URL;
  });
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [isGoogleSheetModalOpen, setIsGoogleSheetModalOpen] = useState(false);
  const [isExportSheetModalOpen, setIsExportSheetModalOpen] = useState(false);
  
  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<WorkLink | null>(null);
  const [modalDefaultCategory, setModalDefaultCategory] = useState<CategoryType>('MANAGERIAL');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Sync to multiple storage keys for redundancy and permanent persistence
  useEffect(() => {
    try {
      const serialized = JSON.stringify(links);
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, serialized);
      }
    } catch (e) {
      console.error('Failed to save links to localStorage', e);
    }
  }, [links]);

  // Save Google Sheet URL to storage
  useEffect(() => {
    try {
      if (googleSheetUrl) {
        localStorage.setItem(GSHEET_STORAGE_KEY, googleSheetUrl);
      } else {
        localStorage.removeItem(GSHEET_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save Google Sheet URL', e);
    }
  }, [googleSheetUrl]);

  // Realtime Auto-Sync: On mount, on window focus, and periodically every 60 seconds
  useEffect(() => {
    const targetUrl = googleSheetUrl || FIXED_GOOGLE_SHEET_URL;
    if (targetUrl) {
      handleSyncSheet(targetUrl, true);
    }

    // Refresh when user returns to this browser tab (e.g. after editing sheet)
    const handleFocus = () => {
      if (targetUrl) {
        handleSyncSheet(targetUrl, true);
      }
    };
    window.addEventListener('focus', handleFocus);

    // Periodic background sync every 60 seconds
    const interval = setInterval(() => {
      if (targetUrl) {
        handleSyncSheet(targetUrl, true);
      }
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [googleSheetUrl]);

  const handleSyncSheet = async (url: string = googleSheetUrl, silent = false) => {
    if (!url) return;
    setIsSyncingSheet(true);
    const result = await fetchLinksFromGoogleSheet(url);
    setIsSyncingSheet(false);

    if (!result.error && result.links.length > 0) {
      setLinks(result.links);
      if (!silent) {
        triggerSaveFeedback(`Sinkronisasi berhasil! ${result.links.length} link diperbarui dari Google Sheet.`);
      }
    } else if (!silent && result.error) {
      triggerSaveFeedback(`Gagal sinkron: ${result.error}`);
    }
  };

  const handleConnectSheet = (url: string, fetchedLinks: WorkLink[]) => {
    setGoogleSheetUrl(url);
    setLinks(fetchedLinks);
    triggerSaveFeedback(`Terhubung ke Google Sheet! ${fetchedLinks.length} link tersinkronisasi.`);
  };

  const handleDisconnectSheet = () => {
    setGoogleSheetUrl('');
    triggerSaveFeedback('Koneksi Google Sheet diputuskan. Portal kembali ke mode penyimpanan lokal.');
  };

  // Derived link groups
  const managerialLinks = links.filter((l) => l.category === 'MANAGERIAL');
  const unitLinks = links.filter((l) => l.category === 'UNIT');
  const pinnedLinks = links.filter((l) => l.isPinned);

  const handleOpenLink = (link: WorkLink) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === link.id
          ? {
              ...item,
              clickCount: (item.clickCount || 0) + 1,
              lastOpened: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleTogglePin = (linkId: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === linkId ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const handleSaveLink = (linkData: Partial<WorkLink>) => {
    if (linkData.id) {
      setLinks((prev) =>
        prev.map((item) =>
          item.id === linkData.id
            ? ({
                ...item,
                ...linkData,
                updatedAt: new Date().toISOString(),
              } as WorkLink)
            : item
        )
      );
    } else {
      const newLink: WorkLink = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: linkData.title || 'Link Baru',
        category: linkData.category || 'MANAGERIAL',
        url: linkData.url || 'https://',
        description: linkData.description || '',
        iconName: linkData.iconName || 'FileSpreadsheet',
        accentColor: linkData.accentColor || 'indigo',
        tags: linkData.tags || [],
        isPinned: false,
        clickCount: 0,
        createdAt: new Date().toISOString(),
      };
      setLinks((prev) => [newLink, ...prev]);
    }
    triggerSaveFeedback('Link berhasil disimpan dan ditetapkan secara permanen.');
  };

  const handleDeleteLink = (linkId: string) => {
    const linkToDelete = links.find((l) => l.id === linkId);
    if (!linkToDelete) return;
    if (window.confirm(`Hapus tombol pekerjaan "${linkToDelete.title}"?`)) {
      setLinks((prev) => prev.filter((item) => item.id !== linkId));
      triggerSaveFeedback('Link telah dihapus.');
    }
  };

  const handleOpenAddModal = (presetCategory?: CategoryType) => {
    setEditingLink(null);
    if (presetCategory) {
      setModalDefaultCategory(presetCategory);
    } else if (currentView === 'MANAGERIAL' || currentView === 'UNIT') {
      setModalDefaultCategory(currentView);
    } else {
      setModalDefaultCategory('MANAGERIAL');
    }
    setIsLinkModalOpen(true);
  };

  const handleEditLink = (link: WorkLink) => {
    setEditingLink(link);
    setModalDefaultCategory(link.category);
    setIsLinkModalOpen(true);
  };

  const handleImportLinks = (imported: WorkLink[]) => {
    setLinks(imported);
    triggerSaveFeedback(`Berhasil menetapkan ${imported.length} link dari data impor.`);
  };

  const handleResetDefaults = () => {
    setLinks(DEFAULT_WORK_LINKS);
    triggerSaveFeedback('Daftar link dikembalikan ke default awal.');
  };

  const handleMoveLink = (linkId: string, direction: 'up' | 'down') => {
    setLinks((prev) => {
      const targetLink = prev.find((l) => l.id === linkId);
      if (!targetLink) return prev;

      const cat = targetLink.category;
      const catLinks = prev.filter((l) => l.category === cat);
      const otherLinks = prev.filter((l) => l.category !== cat);

      const index = catLinks.findIndex((l) => l.id === linkId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= catLinks.length) return prev;

      const newCatLinks = [...catLinks];
      const temp = newCatLinks[index];
      newCatLinks[index] = newCatLinks[targetIndex];
      newCatLinks[targetIndex] = temp;

      return cat === 'MANAGERIAL'
        ? [...newCatLinks, ...otherLinks]
        : [...otherLinks, ...newCatLinks];
    });
  };

  const handleReorderCategory = (category: CategoryType, newOrder: WorkLink[]) => {
    setLinks((prev) => {
      const otherLinks = prev.filter((l) => l.category !== category);
      return category === 'MANAGERIAL'
        ? [...newOrder, ...otherLinks]
        : [...otherLinks, ...newOrder];
    });
    triggerSaveFeedback(`Urutan tombol ${category === 'MANAGERIAL' ? 'Data Managerial' : 'Data Unit'} berhasil ditetapkan.`);
  };

  const triggerSaveFeedback = (msg: string) => {
    try {
      const serialized = JSON.stringify(links);
      for (const key of STORAGE_KEYS) {
        localStorage.setItem(key, serialized);
      }
    } catch (e) {
      console.error(e);
    }
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3500);
  };

  const handleExplicitSave = () => {
    triggerSaveFeedback('Semua link pekerjaan Anda berhasil disimpan dan ditetapkan secara permanen di browser ini.');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/95 px-4 py-3 text-xs font-semibold text-emerald-200 shadow-2xl backdrop-blur animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <HomeSelector
            onSelectCategory={(category) => setCurrentView(category)}
            managerialLinks={managerialLinks}
            unitLinks={unitLinks}
            pinnedLinks={pinnedLinks}
            onOpenLink={handleOpenLink}
            onOpenAddModal={() => handleOpenAddModal('MANAGERIAL')}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onSelectFavorites={() => setCurrentView('favorites')}
            onSaveAndLock={handleExplicitSave}
            googleSheetUrl={googleSheetUrl}
            isSyncingSheet={isSyncingSheet}
            onOpenGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
            onManualSyncSheet={() => handleSyncSheet(googleSheetUrl, false)}
            onOpenExportSheetModal={() => setIsExportSheetModalOpen(true)}
          />
        )}

        {/* VIEW 2: CATEGORY DETAIL GRID */}
        {(currentView === 'MANAGERIAL' || currentView === 'UNIT') && (
          <WorkLinksGrid
            currentCategory={currentView}
            links={currentView === 'MANAGERIAL' ? managerialLinks : unitLinks}
            onBackToHome={() => setCurrentView('home')}
            onSelectCategory={(cat) => setCurrentView(cat)}
            onOpenLink={handleOpenLink}
            onTogglePin={handleTogglePin}
            onEditLink={handleEditLink}
            onDeleteLink={handleDeleteLink}
            onAddNewLink={() => handleOpenAddModal(currentView)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onMoveLink={handleMoveLink}
            onReorderCategory={handleReorderCategory}
            onSaveAndLock={handleExplicitSave}
            googleSheetUrl={googleSheetUrl}
            isSyncingSheet={isSyncingSheet}
            onOpenGoogleSheetModal={() => setIsGoogleSheetModalOpen(true)}
            onManualSyncSheet={() => handleSyncSheet(googleSheetUrl, false)}
            onOpenExportSheetModal={() => setIsExportSheetModalOpen(true)}
          />
        )}

        {/* VIEW 3: FAVORITES VIEW */}
        {currentView === 'favorites' && (
          <FavoritesView
            pinnedLinks={pinnedLinks}
            onBackToHome={() => setCurrentView('home')}
            onOpenLink={handleOpenLink}
            onTogglePin={handleTogglePin}
            onEditLink={handleEditLink}
            onDeleteLink={handleDeleteLink}
            onSelectCategory={(cat) => setCurrentView(cat)}
          />
        )}
      </main>

      {/* Discreet Minimalist Executive Footer */}
      <footer className="mt-auto border-t border-white/[0.05] py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">PORTA-DIALISA</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Unit Dialisis RS Happy Land Medical Centre Yogyakarta</span>
            <span className="text-slate-600">·</span>
            {googleSheetUrl ? (
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Terhubung Google Sheet Realtime
              </span>
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">
                Mode Penyimpanan Lokal (Klik tombol Google Sheet untuk hubungkan realtime)
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>Managerial: {managerialLinks.length}</span>
            <span>·</span>
            <span>Unit: {unitLinks.length}</span>
          </div>
        </div>
      </footer>

      {/* Modal: Add or Edit Link */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
        initialLink={editingLink}
        defaultCategory={modalDefaultCategory}
      />

      {/* Modal: Backup, Restore & Export */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        links={links}
        onImportLinks={handleImportLinks}
        onResetDefaults={handleResetDefaults}
        onSaveAndLock={handleExplicitSave}
        onOpenExportSheet={() => {
          setIsBackupModalOpen(false);
          setIsExportSheetModalOpen(true);
        }}
      />

      {/* Modal: Google Sheet Realtime Connection */}
      <GoogleSheetModal
        isOpen={isGoogleSheetModalOpen}
        onClose={() => setIsGoogleSheetModalOpen(false)}
        currentSheetUrl={googleSheetUrl}
        onConnectSheet={handleConnectSheet}
        onDisconnectSheet={handleDisconnectSheet}
        currentLinks={links}
      />

      {/* Modal: Export to Google Sheet */}
      <ExportToSheetModal
        isOpen={isExportSheetModalOpen}
        onClose={() => setIsExportSheetModalOpen(false)}
        links={links}
        onOpenGoogleSheetConnect={() => setIsGoogleSheetModalOpen(true)}
      />
    </div>
  );
}
