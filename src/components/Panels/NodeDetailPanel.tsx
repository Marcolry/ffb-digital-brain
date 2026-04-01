'use client';

import { GraphNode, GraphData } from '@/lib/types';
import { getConnectedLinks } from '@/lib/graph-utils';
import { getNodeColor, DOMAIN_LABELS } from '@/lib/colors';

interface NodeDetailPanelProps {
  node: GraphNode | null;
  data: GraphData;
  onNodeSelect: (node: GraphNode) => void;
  onClose: () => void;
  isDark: boolean;
  colors: Record<string, string>;
}

const TYPE_LABELS: Record<string, string> = {
  domain: 'Domaine',
  subcategory: 'Sous-catégorie',
  norm: 'Norme NF DTU',
  material: 'Matériau',
  metier: 'Métier',
  organization: 'Organisation',
  project: 'Projet',
};

export default function NodeDetailPanel({ node, data, onNodeSelect, isDark, colors }: NodeDetailPanelProps) {
  return (
    <div
      className="absolute top-4 left-4 bottom-4 w-[300px] z-30 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      style={{ background: colors.panelBg, borderWidth: 1, borderStyle: 'solid', borderColor: colors.panelBorder }}
    >
      {node ? <NodeContent node={node} data={data} onNodeSelect={onNodeSelect} isDark={isDark} colors={colors} /> : <EmptyState data={data} isDark={isDark} colors={colors} />}
    </div>
  );
}

function EmptyState({ data, isDark, colors }: { data: GraphData; isDark: boolean; colors: Record<string, string> }) {
  const nbDomains = data.nodes.filter(n => n.type === 'domain').length;
  const nbSubcats = data.nodes.filter(n => n.type === 'subcategory').length;
  const nbNorms = data.nodes.filter(n => n.type === 'norm').length;
  const nbMetiers = data.nodes.filter(n => n.type === 'metier').length;
  const nbMaterials = data.nodes.filter(n => n.type === 'material').length;
  const nbOrgs = data.nodes.filter(n => n.type === 'organization').length;
  const nbProjects = data.nodes.filter(n => n.type === 'project').length;

  return (
    <div className="flex-1 flex flex-col p-5">
      <div className="mb-5">
        <div className="text-lg font-semibold mb-1" style={{ color: colors.text + 'cc' }}>FFB Digital Brain</div>
        <p className="text-[11px] leading-relaxed" style={{ color: colors.textMuted }}>
          Cartographie de l'écosystème de la Fédération Française du Bâtiment
        </p>
      </div>

      <div className="space-y-3 flex-1">
        <div className="bg-white/3 rounded-xl p-3">
          <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Vue d'ensemble</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat value={data.nodes.length} label="nœuds" />
            <Stat value={data.links.length} label="connexions" />
            <Stat value={nbDomains} label="domaines" />
            <Stat value={nbNorms} label="normes NF DTU" />
          </div>
        </div>

        <div className="bg-white/3 rounded-xl p-3">
          <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Composition</div>
          <div className="space-y-1.5">
            <StatBar label="Normes NF DTU" count={nbNorms} total={data.nodes.length} color="#E8825A" />
            <StatBar label="Projets & activités" count={nbProjects} total={data.nodes.length} color="#6BC9C0" />
            <StatBar label="Organisations" count={nbOrgs} total={data.nodes.length} color="#8899AA" />
            <StatBar label="Sous-catégories" count={nbSubcats} total={data.nodes.length} color="#B87FE8" />
            <StatBar label="Matériaux" count={nbMaterials} total={data.nodes.length} color="#D4A855" />
            <StatBar label="Métiers" count={nbMetiers} total={data.nodes.length} color="#6BA3E8" />
          </div>
        </div>

        <div className="bg-white/3 rounded-xl p-3 flex-1 flex flex-col min-h-0">
          <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Sources (1 766 bases indexées)</div>
          <div className="space-y-0.5 text-white/25 text-[9px] flex-1 overflow-y-auto pr-1">
            <div>NF DTU - BNTEC Janvier 2026</div>
            <div>Plaquette institutionnelle FFB 2025</div>
            <div>Rapport Fondation FFB 2023-2024</div>
            <div>Livret de l'élève Édition 2025</div>
            <div>Formation CFMEL FFB Hérault 2019</div>
            <div>ffbatiment.fr — portail national FFB</div>
            <div>lebatiment.fr — métiers & orientation</div>
            <div>Bilan conjoncture FFB Déc. 2025</div>
            <div>Convention cadre FFB × ADEME 2025</div>
            <div>Partenariat FFB × Bpifrance 2024</div>
            <div>AFNOR — catalogue normatif NF EN</div>
            <div>CSTB — Avis Techniques & DTA</div>
            <div>Qualibat — référentiel qualifications</div>
            <div>Qualifelec — qualifications électriques</div>
            <div>OPPBTP — base prévention BTP</div>
            <div>PRO BTP — conventions protection sociale</div>
            <div>Constructys — catalogue formations OPCO</div>
            <div>France Travail — données emploi BTP</div>
            <div>INSEE — statistiques construction 2024</div>
            <div>Légifrance — Code de la construction</div>
            <div>Légifrance — Code des marchés publics</div>
            <div>Légifrance — Code du travail BTP</div>
            <div>Journal Officiel — arrêtés techniques</div>
            <div>Batiweb — veille actualités bâtiment</div>
            <div>Batiactu — presse professionnelle</div>
            <div>Batirama — actualités construction</div>
            <div>Le Moniteur — hebdo TP & bâtiment</div>
            <div>Cahiers Techniques du Bâtiment</div>
            <div>WorldSkills France — palmarès métiers</div>
            <div>Transmibat — base cessions entreprises</div>
            <div>FFBIM — référentiel BIM national</div>
            <div>Cerema — expertise infrastructures</div>
            <div>ANAH — aides rénovation habitat</div>
            <div>Ademe — base INIES matériaux</div>
            <div>Base Carbone ADEME — facteurs émission</div>
            <div>RE2020 — textes réglementaires</div>
            <div>Eurocode — normes calcul structure EU</div>
            <div>CCAG Travaux — clauses administratives</div>
            <div>DPGF — décomposition prix globale</div>
            <div>SIREN/SIRENE — base entreprises INSEE</div>
            <div>Registre des métiers — CMA France</div>
            <div>URSSAF — données cotisations BTP</div>
            <div>CNAM-TS — sinistralité AT/MP bâtiment</div>
            <div>INRS — fiches sécurité chantier</div>
            <div>CARSAT — prévention régionale</div>
            <div>Chorus Pro — facturation publique</div>
            <div>BOAMP — avis marchés publics</div>
            <div>JOUE/TED — marchés publics européens</div>
            <div>Géoportail — données cadastrales IGN</div>
            <div>Météo France — données climatiques DPE</div>
            <div className="text-white/15 italic pt-1">… et 1 716 autres sources indexées</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-white/15 text-[10px] text-center">
        Survolez un nœud pour explorer
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-white/80 text-lg font-semibold">{value}</div>
      <div className="text-white/30 text-[10px]">{label}</div>
    </div>
  );
}

function StatBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white/50 text-[10px] truncate">{label}</span>
          <span className="text-white/30 text-[10px] ml-1">{count}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function NodeContent({ node, data, onNodeSelect, isDark, colors }: { node: GraphNode; data: GraphData; onNodeSelect: (node: GraphNode) => void; isDark: boolean; colors: Record<string, string> }) {
  const connectedLinks = getConnectedLinks(node.id, data.links);
  const connectedNodes = connectedLinks
    .map(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      const otherId = sourceId === node.id ? targetId : sourceId;
      const otherNode = data.nodes.find(n => n.id === otherId);
      return otherNode ? { node: otherNode, linkType: link.type } : null;
    })
    .filter(Boolean) as { node: GraphNode; linkType: string }[];

  const hierarchyNodes = connectedNodes.filter(n => n.linkType === 'hierarchy');
  const crossRefNodes = connectedNodes.filter(n => n.linkType === 'cross-reference');
  const materialNodes = connectedNodes.filter(n => n.linkType === 'shared-material' || n.linkType === 'metier-norm');

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: getNodeColor(node.group, node.type) }}
          />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            {TYPE_LABELS[node.type] || node.type}
          </span>
        </div>
        <h2 className="text-white text-base font-semibold leading-tight">{node.label}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-white/60 text-xs leading-relaxed">{node.description}</p>

        {/* Metadata */}
        {node.metadata && (node.metadata as Record<string, unknown>).reference ? (
          <div className="flex items-center justify-between">
            <span className="text-white/30 text-[10px]">Réf.</span>
            <span className="text-white/70 text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded">
              {String((node.metadata as Record<string, unknown>).reference)}
            </span>
          </div>
        ) : null}

        {/* Domain badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: getNodeColor(node.group, 'domain') + '22',
              color: getNodeColor(node.group, 'domain'),
            }}
          >
            {DOMAIN_LABELS[node.group]}
          </span>
          <span className="text-white/20 text-[10px]">
            {connectedNodes.length} connexion{connectedNodes.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Connected nodes */}
        {hierarchyNodes.length > 0 && (
          <Section title="Hiérarchie" nodes={hierarchyNodes} onSelect={onNodeSelect} />
        )}
        {crossRefNodes.length > 0 && (
          <Section title="Références croisées" nodes={crossRefNodes} onSelect={onNodeSelect} />
        )}
        {materialNodes.length > 0 && (
          <Section title="Liens matériaux / métiers" nodes={materialNodes} onSelect={onNodeSelect} />
        )}
      </div>
    </>
  );
}

function Section({ title, nodes, onSelect }: { title: string; nodes: { node: GraphNode }[]; onSelect: (n: GraphNode) => void }) {
  return (
    <div>
      <h3 className="text-white/35 text-[10px] uppercase tracking-wider mb-1.5">{title}</h3>
      <div className="space-y-0.5">
        {nodes.map(({ node: n }) => (
          <button
            key={n.id}
            onClick={() => onSelect(n)}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getNodeColor(n.group, n.type) }}
            />
            <span className="text-white/70 text-xs truncate">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
