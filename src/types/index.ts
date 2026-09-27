export type CategoryType = 'MANAGERIAL' | 'UNIT';

export interface WorkLink {
  id: string;
  title: string;
  category: CategoryType;
  url: string;
  description: string;
  iconName: string;
  accentColor: 'indigo' | 'blue' | 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose' | 'teal';
  tags: string[];
  isPinned?: boolean;
  clickCount?: number;
  lastOpened?: string;
  createdAt: string;
}

export interface CategoryMeta {
  id: CategoryType;
  title: string;
  subtitle: string;
  description: string;
  shortLabel: string;
  primaryColor: string;
  badgeBg: string;
  badgeText: string;
  glowClass: string;
  borderHover: string;
}
