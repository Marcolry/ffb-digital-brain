'use client';

import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/lib/colors';
import { DomainGroup } from '@/lib/types';

const legendItems: { group: DomainGroup; label: string }[] = [
  { group: 'structure', label: DOMAIN_LABELS.structure },
  { group: 'enveloppe', label: DOMAIN_LABELS.enveloppe },
  { group: 'amenagements', label: DOMAIN_LABELS.amenagements },
  { group: 'equipements', label: DOMAIN_LABELS.equipements },
  { group: 'material', label: DOMAIN_LABELS.material },
];

export default function LegendPanel({ isDark, colors }: { isDark: boolean; colors: Record<string, string> }) {
  return (
    <div className="absolute bottom-4 left-[320px] z-20 backdrop-blur-xl rounded-xl p-3 space-y-1.5" style={{ background: colors.panelBg, borderWidth: 1, borderStyle: 'solid', borderColor: colors.panelBorder }}>
      <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Légende</div>
      {legendItems.map(({ group, label }) => (
        <div key={group} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: DOMAIN_COLORS[group] }}
          />
          <span className="text-white/60 text-xs">{label}</span>
        </div>
      ))}
      <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-white/20" />
          <span className="text-white/40 text-[10px]">Hiérarchie</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 border-t border-dashed border-yellow-500/50" />
          <span className="text-white/40 text-[10px]">Référence croisée</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 border-t border-dotted border-amber-500/30" />
          <span className="text-white/40 text-[10px]">Matériau partagé</span>
        </div>
      </div>
    </div>
  );
}
