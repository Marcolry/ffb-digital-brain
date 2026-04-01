'use client';

import { useState, useCallback } from 'react';
import { GraphNode } from '@/lib/types';

export function useNodeSelection() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  const selectNode = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
  }, []);

  const hoverNode = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return {
    selectedNode,
    hoveredNode,
    selectNode,
    hoverNode,
    clearSelection,
  };
}
