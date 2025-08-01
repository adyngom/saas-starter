'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { THEME_CONFIGS, DEFAULT_THEME, type ThemeConfig } from './theme-config';

interface ThemeContextType {
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  themeConfig: ThemeConfig;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'color-theme';

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState(DEFAULT_THEME);

  const themeConfig = THEME_CONFIGS.find(t => t.name === colorTheme) || THEME_CONFIGS[0];

  const setColorTheme = (theme: string) => {
    if (!THEME_CONFIGS.find(t => t.name === theme)) return;
    
    setColorThemeState(theme);
    
    // Store in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save color theme to localStorage');
    }
    
    // Dynamically load the theme CSS
    loadThemeCSS(theme);
  };

  const loadThemeCSS = (themeName: string) => {
    const config = THEME_CONFIGS.find(t => t.name === themeName);
    if (!config) return;

    // Remove existing theme stylesheets
    const existingThemes = document.querySelectorAll('link[data-theme-css]');
    existingThemes.forEach(link => link.remove());

    // Add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.cssFile;
    link.setAttribute('data-theme-css', themeName);
    document.head.appendChild(link);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      if (savedTheme && THEME_CONFIGS.find(t => t.name === savedTheme)) {
        setColorThemeState(savedTheme);
        loadThemeCSS(savedTheme);
      } else {
        // Load default theme
        loadThemeCSS(DEFAULT_THEME);
      }
    } catch (e) {
      console.warn('Failed to load color theme from localStorage');
      loadThemeCSS(DEFAULT_THEME);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        setColorTheme,
        themeConfig,
        availableThemes: THEME_CONFIGS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
}