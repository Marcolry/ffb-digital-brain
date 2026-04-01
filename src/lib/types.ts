export type NodeType = 'domain' | 'subcategory' | 'norm' | 'material' | 'metier' | 'organization' | 'project';
export type LinkType = 'hierarchy' | 'cross-reference' | 'shared-material' | 'metier-norm' | 'org-metier';
export type DomainGroup = 'structure' | 'enveloppe' | 'amenagements' | 'equipements' | 'material' | 'other';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  group: DomainGroup;
  parent?: string;
  description: string;
  metadata?: Record<string, unknown>;
  size: number;
  // Runtime properties added by force-graph
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: LinkType;
  strength: number;
}

export interface GraphData {
  metadata: {
    version: string;
    source: string;
    lastUpdated: string;
    totalNodes: number;
    totalLinks: number;
  };
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface FilterState {
  nodeTypes: Record<NodeType, boolean>;
  domainGroups: Record<DomainGroup, boolean>;
  searchQuery: string;
}
