'use client';

import { useState, useCallback } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_COLORS = {
  dark: {
    bg: '#101018',
    panelBg: 'rgba(0,0,0,0.5)',
    panelBorder: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textMuted: 'rgba(255,255,255,0.5)',
    textDim: 'rgba(255,255,255,0.25)',
    linkColor: 'rgba(255,255,255,0.1)',
    linkHighlight: 'rgba(255,255,255,0.35)',
    linkDim: 'rgba(255,255,255,0.015)',
    nodeDim: '#1a1a1a',
    glowBase: '#ffffff',
    inputBg: 'rgba(255,255,255,0.05)',
  },
  light: {
    bg: '#f0f0f5',
    panelBg: 'rgba(255,255,255,0.8)',
    panelBorder: 'rgba(0,0,0,0.1)',
    text: '#111111',
    textMuted: 'rgba(0,0,0,0.5)',
    textDim: 'rgba(0,0,0,0.2)',
    linkColor: 'rgba(0,0,0,0.08)',
    linkHighlight: 'rgba(0,0,0,0.3)',
    linkDim: 'rgba(0,0,0,0.015)',
    nodeDim: '#dddddd',
    glowBase: '#000000',
    inputBg: 'rgba(0,0,0,0.05)',
  },
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const colors = THEME_COLORS[theme];
  const isDark = theme === 'dark';

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, isDark, colors, toggleTheme };
}
