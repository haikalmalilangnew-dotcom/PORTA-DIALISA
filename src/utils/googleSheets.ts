import { WorkLink, CategoryType } from '../types';

export interface SheetParseResult {
  links: WorkLink[];
  error?: string;
}

/**
 * Extracts Google Sheet ID from a full Google Sheets URL or raw ID
 */
export function extractSheetId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  
  // Match standard Google Sheets URL format
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }
  
  // If it's already an ID (alphanumeric, dashes, underscores, length >= 20)
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Simple, robust CSV row parser that handles quoted cells with commas
 */
function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const rows: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let inQuotes = false;
    let currentCell = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          currentCell += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    row.push(currentCell.trim());
    rows.push(row);
  }

  return rows;
}

/**
 * Fetches and parses links from a publicly viewable Google Sheet via Google Visualization API
 */
export async function fetchLinksFromGoogleSheet(urlOrId: string): Promise<SheetParseResult> {
  const sheetId = extractSheetId(urlOrId);
  if (!sheetId) {
    return {
      links: [],
      error: 'ID atau URL Google Sheet tidak valid. Pastikan format URL sesuai.',
    };
  }

  // Google Visualization API returns CSV directly with CORS allowed
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  try {
    const res = await fetch(csvUrl, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) {
        return {
          links: [],
          error: 'Spreadsheet tidak ditemukan. Periksa kembali ID atau URL Google Sheet Anda.',
        };
      }
      return {
        links: [],
        error: `Gagal memuat Google Sheet (Status: ${res.status}). Pastikan hak akses sheet disetel ke "Siapa saja yang memiliki link dapat melihat".`,
      };
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
      return {
        links: [],
        error: 'Google Sheet kosong.',
      };
    }

    // Determine if first row is header
    const firstRow = rows[0].map((c) => c.toLowerCase());
    const hasHeader =
      firstRow.some((c) => c.includes('kategori') || c.includes('category')) ||
      firstRow.some((c) => c.includes('judul') || c.includes('title')) ||
      firstRow.some((c) => c.includes('url') || c.includes('link'));

    const dataRows = hasHeader ? rows.slice(1) : rows;
    const links: WorkLink[] = [];

    dataRows.forEach((cols, idx) => {
      if (cols.length < 2) return;

      const rawCategory = (cols[0] || '').toUpperCase();
      const isManagerial = rawCategory.includes('MANAGE') || rawCategory === 'M';
      const category: CategoryType = isManagerial ? 'MANAGERIAL' : 'UNIT';

      const title = cols[1] || '';
      if (!title.trim()) return;

      const url = cols[2] || 'https://';
      const description = cols[3] || '';
      const iconName = cols[4] || (category === 'MANAGERIAL' ? 'Briefcase' : 'Layers');
      const accentColor = (cols[5] as WorkLink['accentColor']) || (category === 'MANAGERIAL' ? 'indigo' : 'emerald');
      const tags = (cols[6] || '')
        .split(';')
        .concat((cols[6] || '').split(','))
        .map((t) => t.trim())
        .filter((t, i, arr) => t.length > 0 && arr.indexOf(t) === i);

      links.push({
        id: `gsheet-${idx + 1}-${sheetId.slice(0, 6)}`,
        title,
        category,
        url,
        description,
        iconName,
        accentColor,
        tags,
        isPinned: false,
        clickCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    if (links.length === 0) {
      return {
        links: [],
        error: 'Tidak ditemukan baris data link yang valid pada Google Sheet tersebut.',
      };
    }

    return { links };
  } catch (err: any) {
    return {
      links: [],
      error: 'Tidak dapat terhubung ke Google Sheet. Pastikan spreadsheet memiliki izin akses publik ("Siapa saja yang memiliki link").',
    };
  }
}

/**
 * Generates CSV text formatted with comma delimiters
 */
export function generateTemplateCSV(links: WorkLink[]): string {
  const header = ['Kategori', 'Judul', 'URL', 'Deskripsi', 'Ikon', 'Warna', 'Tag'];
  const rows = links.map((l) => [
    `"${l.category}"`,
    `"${l.title.replace(/"/g, '""')}"`,
    `"${l.url.replace(/"/g, '""')}"`,
    `"${(l.description || '').replace(/"/g, '""')}"`,
    `"${l.iconName || ''}"`,
    `"${l.accentColor || ''}"`,
    `"${(l.tags || []).join(', ')}"`,
  ]);

  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Generates Tab-Separated Values (TSV) - The perfect format for clipboard pasting
 * into Google Sheets. When pasted into Google Sheets, it naturally splits into cells!
 */
export function generateTSVForGoogleSheets(links: WorkLink[]): string {
  const header = ['Kategori', 'Judul', 'URL', 'Deskripsi', 'Ikon', 'Warna', 'Tag'];
  const rows = links.map((l) => [
    l.category,
    l.title.replace(/[\t\n\r]/g, ' '),
    l.url.replace(/[\t\n\r]/g, ' '),
    (l.description || '').replace(/[\t\n\r]/g, ' '),
    l.iconName || '',
    l.accentColor || '',
    (l.tags || []).join(', '),
  ]);

  return [header.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
}

/**
 * Triggers client-side download of CSV file
 */
export function downloadCSV(links: WorkLink[], filename = 'link-pekerjaan-hemodialisa.csv') {
  const csvContent = generateTemplateCSV(links);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
