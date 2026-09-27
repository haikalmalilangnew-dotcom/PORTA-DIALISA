export const ACCENT_STYLES: Record<string, {
  border: string;
  hoverBorder: string;
  bgLight: string;
  text: string;
  badge: string;
  button: string;
  glow: string;
}> = {
  indigo: {
    border: 'border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/60',
    bgLight: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    glow: 'hover:shadow-indigo-500/20',
  },
  blue: {
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/60',
    bgLight: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
    button: 'bg-blue-600 hover:bg-blue-500 text-white',
    glow: 'hover:shadow-blue-500/20',
  },
  emerald: {
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/60',
    bgLight: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    glow: 'hover:shadow-emerald-500/20',
  },
  cyan: {
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/60',
    bgLight: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
    button: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    glow: 'hover:shadow-cyan-500/20',
  },
  amber: {
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/60',
    bgLight: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    button: 'bg-amber-600 hover:bg-amber-500 text-white',
    glow: 'hover:shadow-amber-500/20',
  },
  violet: {
    border: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/60',
    bgLight: 'bg-violet-500/10',
    text: 'text-violet-400',
    badge: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
    button: 'bg-violet-600 hover:bg-violet-500 text-white',
    glow: 'hover:shadow-violet-500/20',
  },
  rose: {
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/60',
    bgLight: 'bg-rose-500/10',
    text: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
    button: 'bg-rose-600 hover:bg-rose-500 text-white',
    glow: 'hover:shadow-rose-500/20',
  },
  teal: {
    border: 'border-teal-500/20',
    hoverBorder: 'hover:border-teal-500/60',
    bgLight: 'bg-teal-500/10',
    text: 'text-teal-400',
    badge: 'bg-teal-500/10 text-teal-300 border border-teal-500/20',
    button: 'bg-teal-600 hover:bg-teal-500 text-white',
    glow: 'hover:shadow-teal-500/20',
  },
};

export const parseHostname = (urlStr: string): string => {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'link';
  }
};
