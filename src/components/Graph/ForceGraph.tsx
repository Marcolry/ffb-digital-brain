'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { GraphNode, GraphData } from '@/lib/types';
import { getNodeColor, getNodeGlowColor, BACKGROUND_COLOR } from '@/lib/colors';
import { getNeighborIds } from '@/lib/graph-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D = dynamic(() => import('react-force-graph-2d').then(mod => mod.default) as any, {
  ssr: false,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

interface ForceGraphProps {
  data: GraphData;
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  onNodeClick: (node: GraphNode | null) => void;
  onNodeHover: (node: GraphNode | null) => void;
  isDark: boolean;
  colors: Record<string, string>;
}

// Will be set dynamically based on viewport
let DISC_RADIUS = 300;

function getObsidianColor(node: GraphNode): string {
  return getNodeColor(node.group, node.type);
}

function getRadius(type: string): number {
  if (type === 'domain') return 5;
  if (type === 'subcategory') return 2.8;
  if (type === 'material') return 2.5;
  return 1.3;
}

// Seeded random for consistent positions across refreshes
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// Gaussian-like random using Box-Muller (organic spread)
function gaussRandom(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
}

// Cluster centers for each group
const GROUP_CENTERS: Record<string, [number, number]> = {
  structure: [0.35, -0.25],
  enveloppe: [-0.35, 0.3],
  amenagements: [0.1, 0.4],
  equipements: [-0.25, -0.35],
  material: [0.0, 0.0],
  other: [-0.05, 0.05],
};

function positionInDisc(nodes: GraphNode[]): GraphNode[] {
  const rng = seededRandom(42);
  const positioned: GraphNode[] = [];

  nodes.forEach(node => {
    const [cx, cy] = GROUP_CENTERS[node.group] || [0, 0];
    const centerX = cx * DISC_RADIUS;
    const centerY = cy * DISC_RADIUS;

    if (node.type === 'domain') {
      // Domains at their cluster center with tiny jitter
      positioned.push({
        ...node,
        fx: centerX + gaussRandom(rng) * 8,
        fy: centerY + gaussRandom(rng) * 8,
      });
    } else {
      // Other nodes: gaussian spread around cluster center
      const spread = node.type === 'subcategory' ? 0.35 : 0.6;
      let x = centerX + gaussRandom(rng) * DISC_RADIUS * spread;
      let y = centerY + gaussRandom(rng) * DISC_RADIUS * spread;

      // Clamp to disc boundary
      const dist = Math.sqrt(x * x + y * y);
      if (dist > DISC_RADIUS * 0.95) {
        const scale = (DISC_RADIUS * 0.95) / dist;
        x *= scale;
        y *= scale;
      }

      positioned.push({ ...node, fx: x, fy: y });
    }
  });

  return positioned;
}

const ForceGraph = forwardRef(function ForceGraph({
  data,
  selectedNode,
  hoveredNode,
  onNodeClick,
  onNodeHover,
  isDark,
  colors,
}: ForceGraphProps, ref) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(null);

  const highlightNodes = useMemo(() => {
    const active = hoveredNode || selectedNode;
    if (!active) return null;
    const neighbors = getNeighborIds(active.id, data.links);
    neighbors.add(active.id);
    return neighbors;
  }, [hoveredNode, selectedNode, data.links]);

  // Pre-position nodes in a disc with FIXED positions
  const discData = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    // Compact disc — camera zoom will fill the screen
    DISC_RADIUS = 280;
    return {
      ...data,
      nodes: positionInDisc(data.nodes),
    };
  }, [data]);

  useEffect(() => {
    if (!graphRef.current) return;
    const fg = graphRef.current;
    // Kill all forces — positions are fixed
    fg.d3Force('charge', null);
    fg.d3Force('link', null);
    fg.d3Force('center', null);
    // Animate: briefly enable forces so nodes "breathe", then freeze
    fg.d3Force('charge')?.strength(-8);
    fg.d3AlphaTarget(0.3);
    fg.zoom(1, 0);
    fg.centerAt(0, 0, 0);

    // After 1.2s of alive movement, freeze and zoom to final view
    setTimeout(() => {
      fg.d3AlphaTarget(0);
      fg.d3Force('charge', null);
      fg.d3Force('link', null);
      fg.d3Force('center', null);
      // Re-fix positions
      data.nodes.forEach((n: any) => { n.fx = n.x; n.fy = n.y; });
      setTimeout(() => resetView(), 200);
    }, 1200);
  }, [data]);

  const nodeCanvasObject = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (nodeRaw: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const node = nodeRaw as GraphNode;
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const isActive = hoveredNode?.id === node.id || selectedNode?.id === node.id;
      const isDimmed = highlightNodes && !highlightNodes.has(node.id);

      const r = getRadius(node.type);
      const radius = isActive ? r * 2 : r;
      const color = getObsidianColor(node);
      const glowColor = getNodeGlowColor(node.group);

      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.04 : 1;

      // Soft glow halo
      if (!isDimmed) {
        const glowR = radius * (isActive ? 8 : 4);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        const glowBase = node.type === 'domain' ? glowColor : colors.glowBase;
        glow.addColorStop(0, glowBase + '30');
        glow.addColorStop(0.5, glowBase + '08');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, 2 * Math.PI);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Solid dot
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isDimmed ? colors.nodeDim : color;
      ctx.fill();

      // Label: show on hover, for domains, AND for neighbors of hovered node
      const isNeighbor = highlightNodes && highlightNodes.has(node.id) && !isActive;
      if ((isActive || isNeighbor || (node.type === 'domain' && globalScale > 1.2)) && !isDimmed) {
        const fontSize = node.type === 'domain'
          ? Math.max(11 / globalScale, 3)
          : Math.max(9 / globalScale, 2);
        ctx.font = `${node.type === 'domain' ? '600 ' : '400 '}${fontSize}px Inter, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const labelY = y + radius + 2 / globalScale;
        const labelText = node.label;
        const textWidth = ctx.measureText(labelText).width;
        const padX = 3 / globalScale;
        const padY = 1.5 / globalScale;

        // Background pill behind label
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        const rx = x - textWidth / 2 - padX;
        const ry = labelY - padY;
        const rw = textWidth + padX * 2;
        const rh = fontSize + padY * 2;
        const cornerR = 2 / globalScale;
        ctx.roundRect(rx, ry, rw, rh, cornerR);
        ctx.fill();

        // Label text
        ctx.fillStyle = isActive ? (isDark ? '#ffffffee' : '#000000ee') : (isDark ? '#ffffffcc' : '#000000aa');
        ctx.fillText(labelText, x, labelY);

        if (isActive && node.description) {
          const dSize = Math.max(7 / globalScale, 1.5);
          ctx.font = `300 ${dSize}px Inter, sans-serif`;
          const desc = node.description.length > 55
            ? node.description.substring(0, 52) + '...'
            : node.description;
          const descY = labelY + fontSize + padY * 2 + 1 / globalScale;
          const descW = ctx.measureText(desc).width;

          // Background for description
          ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
          ctx.beginPath();
          ctx.roundRect(x - descW / 2 - padX, descY - padY, descW + padX * 2, dSize + padY * 2, cornerR);
          ctx.fill();

          ctx.fillStyle = isDark ? '#ffffff88' : '#00000077';
          ctx.fillText(desc, x, descY);
        }
      }

      ctx.restore();
    },
    [hoveredNode, selectedNode, highlightNodes]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((nodeRaw: any) => {
    const node = nodeRaw as GraphNode;
    onNodeClick(node);
    if (graphRef.current) {
      // Gentle zoom: center on node but keep neighbors visible
      graphRef.current.centerAt(node.x, node.y, 800);
      const currentZoom = graphRef.current.zoom();
      const targetZoom = Math.min(currentZoom * 1.3, 2.5);
      graphRef.current.zoom(targetZoom, 800);
    }
  }, [onNodeClick]);

  useImperativeHandle(ref, () => ({
    resetView: () => resetView(),
  }));

  const resetView = useCallback(() => {
    onNodeClick(null);
    if (graphRef.current) {
      const w = typeof window !== 'undefined' ? window.innerWidth - 340 : 800;
      const h = typeof window !== 'undefined' ? window.innerHeight : 600;
      const viewSize = Math.min(w, h);
      const zoom = viewSize / (DISC_RADIUS * 2) * 0.85;
      graphRef.current.zoom(zoom, 800);
      graphRef.current.centerAt(0, 0, 800);
    }
  }, [onNodeClick]);

  // Escape key resets view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetView();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetView]);

  const handleBackgroundClick = useCallback(() => {
    resetView();
  }, [resetView]);

  return (
    <div className="absolute inset-0" style={{ background: colors.bg }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={discData}
        nodeId="id"
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (nodeRaw: any, color: string, ctx: CanvasRenderingContext2D) => {
            const node = nodeRaw as GraphNode;
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, getRadius(node.type) * 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }
        }
        linkCanvasObject={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (linkRaw: any, ctx: CanvasRenderingContext2D) => {
            const src = linkRaw.source;
            const tgt = linkRaw.target;
            if (!src || !tgt || src.x == null || tgt.x == null) return;

            const isHighlighted = highlightNodes &&
              (highlightNodes.has(src.id) && highlightNodes.has(tgt.id));
            const isDimmed = highlightNodes && !isHighlighted;

            ctx.save();
            if (isHighlighted) {
              ctx.strokeStyle = colors.linkHighlight;
              ctx.lineWidth = 1.2;
            } else if (isDimmed) {
              ctx.strokeStyle = colors.linkDim;
              ctx.lineWidth = 0.2;
            } else {
              ctx.strokeStyle = colors.linkColor;
              ctx.lineWidth = 0.4;
            }
            ctx.beginPath();
            ctx.moveTo(src.x, src.y);
            ctx.lineTo(tgt.x, tgt.y);
            ctx.stroke();
            ctx.restore();
          }
        }
        onNodeClick={handleNodeClick}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeHover={(node: any) => onNodeHover(node ? (node as GraphNode) : null)}
        onBackgroundClick={handleBackgroundClick}
        backgroundColor="rgba(0,0,0,0)"
        warmupTicks={0}
        cooldownTicks={0}
        enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
});

export default ForceGraph;
