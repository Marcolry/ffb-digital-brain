'use client';

import { useState } from 'react';
import { NodeType, DomainGroup, FilterState } from '@/lib/types';
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/lib/colors';

interface FilterPanelProps {
  filters: FilterState;
  onToggleNodeType: (type: NodeType) => void;
  onToggleDomainGroup: (group: DomainGroup) => void;
  isDark: boolean;
  colors: Record<string, string>;
}

const nodeTypeLabels: { type: NodeType; label: string }[] = [
  { type: 'domain', label: 'Domaines' },
  { type: 'subcategory', label: 'Sous-catégories' },
  { type: 'norm', label: 'Normes NF DTU' },
  { type: 'material', label: 'Matériaux' },
];

const domainGroups: DomainGroup[] = ['structure', 'enveloppe', 'amenagements', 'equipements', 'material'];

export default function FilterPanel({ filters, onToggleNodeType, onToggleDomainGroup, isDark, colors }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 hover:bg-white/10 transition-colors"
        title="Filtres"
      >
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl p-4 w-[220px] shadow-2xl space-y-4">
          <div>
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Types de nœuds</h3>
            <div className="space-y-1">
              {nodeTypeLabels.map(({ type, label }) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={filters.nodeTypes[type]}
                    onChange={() => onToggleNodeType(type)}
                    className="w-3 h-3 rounded border-white/20 bg-transparent accent-blue-500"
                  />
                  <span className="text-white/70 text-xs">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Domaines</h3>
            <div className="space-y-1">
              {domainGroups.map(group => (
                <label key={group} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={filters.domainGroups[group]}
                    onChange={() => onToggleDomainGroup(group)}
                    className="w-3 h-3 rounded border-white/20 bg-transparent"
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: DOMAIN_COLORS[group] }}
                  />
                  <span className="text-white/70 text-xs">{DOMAIN_LABELS[group]}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
