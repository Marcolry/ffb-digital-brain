'use client';

import { useState, useEffect, useMemo } from 'react';
import { GraphData, FilterState, NodeType, DomainGroup } from '@/lib/types';
import { filterGraphData } from '@/lib/graph-utils';
import rawData from '@/data/graph-data.json';

const defaultFilters: FilterState = {
  nodeTypes: {
    domain: true,
    subcategory: true,
    norm: true,
    material: true,
    metier: true,
    organization: true,
    project: true,
  },
  domainGroups: {
    structure: true,
    enveloppe: true,
    amenagements: true,
    equipements: true,
    material: true,
    other: true,
  },
  searchQuery: '',
};

export function useGraphData() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  const graphData = useMemo(() => rawData as unknown as GraphData, []);

  const filteredData = useMemo(() => {
    const hasActiveFilters =
      Object.values(filters.nodeTypes).some(v => !v) ||
      Object.values(filters.domainGroups).some(v => !v) ||
      filters.searchQuery !== '';

    if (!hasActiveFilters) return graphData;
    return filterGraphData(graphData, filters);
  }, [graphData, filters]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleNodeType = (type: NodeType) => {
    setFilters(prev => ({
      ...prev,
      nodeTypes: { ...prev.nodeTypes, [type]: !prev.nodeTypes[type] },
    }));
  };

  const toggleDomainGroup = (group: DomainGroup) => {
    setFilters(prev => ({
      ...prev,
      domainGroups: { ...prev.domainGroups, [group]: !prev.domainGroups[group] },
    }));
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  return {
    graphData,
    filteredData,
    filters,
    isLoaded,
    toggleNodeType,
    toggleDomainGroup,
    setSearchQuery,
  };
}
