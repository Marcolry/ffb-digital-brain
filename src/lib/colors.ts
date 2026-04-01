import { DomainGroup, NodeType } from './types';

export const DOMAIN_COLORS: Record<DomainGroup, string> = {
  structure: '#E8825A',
  enveloppe: '#6BC9C0',
  amenagements: '#B87FE8',
  equipements: '#6BA3E8',
  material: '#D4A855',
  other: '#8899AA',
};

export const DOMAIN_COLORS_DIM: Record<DomainGroup, string> = {
  structure: '#FF6B3566',
  enveloppe: '#4ECDC466',
  amenagements: '#A855F766',
  equipements: '#3B82F666',
  material: '#F59E0B66',
  other: '#6B728066',
};

export function getNodeColor(group: DomainGroup, type: NodeType): string {
  const base = DOMAIN_COLORS[group] || DOMAIN_COLORS.other;
  if (type === 'material') return DOMAIN_COLORS.material;
  return base;
}

export function getNodeOpacity(type: NodeType): number {
  if (type === 'domain') return 1;
  if (type === 'subcategory') return 0.8;
  return 0.6;
}

export function getNodeGlowColor(group: DomainGroup): string {
  return DOMAIN_COLORS[group] || DOMAIN_COLORS.other;
}

export const LINK_COLORS: Record<string, string> = {
  hierarchy: 'rgba(255,255,255,0.08)',
  'cross-reference': 'rgba(255,200,50,0.25)',
  'shared-material': 'rgba(245,158,11,0.12)',
};

export const BACKGROUND_COLOR = '#101018';

export const DOMAIN_LABELS: Record<DomainGroup, string> = {
  structure: 'Structure',
  enveloppe: 'Enveloppe',
  amenagements: 'Aménagements Intérieurs',
  equipements: 'Équipements Techniques',
  material: 'Matériaux',
  other: 'Autre',
};
