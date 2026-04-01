'use client';

import { useCallback } from 'react';
import ForceGraph from '@/components/Graph/ForceGraph';
import SearchPanel from '@/components/Panels/SearchPanel';
import NodeDetailPanel from '@/components/Panels/NodeDetailPanel';
import FilterPanel from '@/components/Panels/FilterPanel';
import LegendPanel from '@/components/Panels/LegendPanel';
import { useGraphData } from '@/hooks/useGraphData';
import { useNodeSelection } from '@/hooks/useNodeSelection';
import { useTheme } from '@/hooks/useTheme';
import { GraphNode } from '@/lib/types';

export default function Home() {
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

  const { isDark, colors, toggleTheme } = useTheme();

  const handleNodeSelect = useCallback(
    (node: GraphNode) => {
      selectNode(node);
    },
    [selectNode]
  );

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

      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-14 z-30 p-2.5 rounded-xl backdrop-blur-xl border transition-colors"
        style={{
          background: colors.inputBg,
          borderColor: colors.panelBorder,
        }}
        title={isDark ? 'Mode clair' : 'Mode sombre'}
      >
        {isDark ? (
          <svg className="w-4 h-4" fill="none" stroke="rgba(255,255,255,0.6)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="rgba(0,0,0,0.6)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <div className="absolute bottom-4 right-4 z-10 text-xs" style={{ color: colors.textDim }}>
        {graphData.nodes.length} noeuds &middot; {graphData.links.length} liens
      </div>
    </main>
  );
}
