'use client';

import { useState, useRef, useEffect } from 'react';
import { GraphNode, GraphData } from '@/lib/types';
import { searchNodes } from '@/lib/graph-utils';
import { getNodeColor } from '@/lib/colors';

interface SearchPanelProps {
  data: GraphData;
  onNodeSelect: (node: GraphNode) => void;
  isDark: boolean;
  colors: Record<string, string>;
}

export default function SearchPanel({ data, onNodeSelect, isDark, colors }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GraphNode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchNodes(data.nodes, query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, data.nodes]);

  const handleSelect = (node: GraphNode) => {
    onNodeSelect(node);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="absolute top-4 left-[320px] z-30 w-[280px]">
      <div className="relative">
        <div className="flex items-center backdrop-blur-xl rounded-xl px-4 py-2.5 shadow-2xl transition-all" style={{ background: colors.panelBg, borderWidth: 1, borderStyle: 'solid', borderColor: colors.panelBorder }}>
          <svg
            className="w-4 h-4 text-white/40 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: colors.text + 'ee', }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white/70 ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {results.map(node => (
              <button
                key={node.id}
                onClick={() => handleSelect(node)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getNodeColor(node.group, node.type) }}
                />
                <div className="min-w-0">
                  <div className="text-white/90 text-sm font-medium truncate">{node.label}</div>
                  <div className="text-white/40 text-xs truncate">{node.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
