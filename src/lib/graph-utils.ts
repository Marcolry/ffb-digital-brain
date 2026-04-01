import { GraphNode, GraphLink, GraphData, FilterState } from './types';

export function getNeighborIds(nodeId: string, links: GraphLink[]): Set<string> {
  const neighbors = new Set<string>();
  for (const link of links) {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    if (sourceId === nodeId) neighbors.add(targetId);
    if (targetId === nodeId) neighbors.add(sourceId);
  }
  return neighbors;
}

export function getConnectedLinks(nodeId: string, links: GraphLink[]): GraphLink[] {
  return links.filter(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return sourceId === nodeId || targetId === nodeId;
  });
}

export function searchNodes(nodes: GraphNode[], query: string): GraphNode[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return nodes
    .filter(n => {
      const label = n.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const desc = n.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return label.includes(q) || desc.includes(q);
    })
    .slice(0, 8);
}

export function filterGraphData(data: GraphData, filters: FilterState): GraphData {
  const visibleNodes = new Set<string>();
  const filteredNodes = data.nodes.filter(node => {
    if (!filters.nodeTypes[node.type]) return false;
    if (!filters.domainGroups[node.group]) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match = node.label.toLowerCase().includes(q) || node.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    visibleNodes.add(node.id);
    return true;
  });

  const filteredLinks = data.links.filter(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return visibleNodes.has(sourceId) && visibleNodes.has(targetId);
  });

  return {
    ...data,
    nodes: filteredNodes,
    links: filteredLinks,
  };
}
