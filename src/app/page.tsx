'use client';

import { useCallback, useState, useRef } from 'react';
import ForceGraph from '@/components/Graph/ForceGraph';
import SearchPanel from '@/components/Panels/SearchPanel';
import NodeDetailPanel from '@/components/Panels/NodeDetailPanel';
import FilterPanel from '@/components/Panels/FilterPanel';
import LegendPanel from '@/components/Panels/LegendPanel';
import { useGraphData } from '@/hooks/useGraphData';
import { useNodeSelection } from '@/hooks/useNodeSelection';
import { useTheme } from '@/hooks/useTheme';
import { GraphNode } from '@/lib/types';

const ACCESS_CODE = 'Joucas-84';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const {
    graphData,
    filteredData,
    filters,
    isLoaded,
    toggleNodeType,
    toggleDomainGroup,
  } = useGraphData();

  const {
    selectedNode,
    hoveredNode,
    selectNode,
    hoverNode,
    clearSelection,
  } = useNodeSelection();

  const { isDark, colors } = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);

  const handleNodeSelect = useCallback(
    (node: GraphNode) => {
      selectNode(node);
    },
    [selectNode]
  );

  const handleResetView = useCallback(() => {
    clearSelection();
    if (graphRef.current?.resetView) {
      graphRef.current.resetView();
    }
  }, [clearSelection]);

  const handleCodeSubmit = () => {
    if (codeInput === ACCESS_CODE) {
      setIsAuthenticated(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  // Access gate
  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center bg-[#101018]">
        <div className="w-[360px] text-center">
          <div className="text-3xl font-bold text-white/80 mb-2">FFB Digital Brain</div>
          <p className="text-white/30 text-sm mb-8">Accès réservé</p>
          <div className="space-y-3">
            <input
              type="password"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleCodeSubmit()}
              placeholder="Code d'accès"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-sm outline-none focus:border-white/25 transition-colors placeholder-white/25"
              autoFocus
            />
            {codeError && (
              <p className="text-red-400/80 text-xs">Code incorrect</p>
            )}
            <button
              onClick={handleCodeSubmit}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm transition-colors"
            >
              Accéder
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: colors.bg }}>
        <div className="text-center">
          <div className="text-4xl font-bold animate-pulse-glow mb-4" style={{ color: colors.textDim }}>FFB</div>
          <div className="text-sm" style={{ color: colors.textDim }}>Chargement du graphe...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative h-full w-full">
      <ForceGraph
        ref={graphRef}
        data={filteredData}
        selectedNode={selectedNode}
        hoveredNode={hoveredNode}
        onNodeClick={selectNode}
        onNodeHover={hoverNode}
        isDark={isDark}
        colors={colors}
      />

      <SearchPanel data={graphData} onNodeSelect={handleNodeSelect} isDark={isDark} colors={colors} />
      <FilterPanel
        filters={filters}
        onToggleNodeType={toggleNodeType}
        onToggleDomainGroup={toggleDomainGroup}
        isDark={isDark}
        colors={colors}
      />
      <LegendPanel isDark={isDark} colors={colors} />
      <NodeDetailPanel
        node={hoveredNode || selectedNode}
        data={graphData}
        onNodeSelect={handleNodeSelect}
        onClose={clearSelection}
        isDark={isDark}
        colors={colors}
      />

      {/* Reset view button — bottom center */}
      <button
        onClick={handleResetView}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl backdrop-blur-xl text-xs transition-all hover:scale-105"
        style={{
          background: colors.panelBg,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: colors.panelBorder,
          color: colors.textMuted,
        }}
      >
        Réinitialiser la vue
      </button>

      <div className="absolute bottom-5 right-4 z-10 text-xs" style={{ color: colors.textDim }}>
        {graphData.nodes.length} noeuds &middot; {graphData.links.length} liens
      </div>
    </main>
  );
}
