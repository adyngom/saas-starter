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
  const [isLoaded, setIsLoaded] = useState(false);

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

  const loadThemeCSS = async (themeName: string) => {
    const config = THEME_CONFIGS.find(t => t.name === themeName);
    if (!config) return;

    try {
      // Remove existing dynamic theme styles
      const existingStyle = document.getElementById('dynamic-color-theme');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Fetch and inject theme CSS with higher specificity
      const response = await fetch(config.cssFile);
      if (!response.ok) return;
      
      const cssText = await response.text();
      
      // Wrap in higher specificity layer
      const wrappedCSS = `
        @layer dynamic-theme {
          ${cssText}
        }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-color-theme';
      styleElement.textContent = wrappedCSS;
      
      // Append to head for higher specificity
      document.head.appendChild(styleElement);
      setIsLoaded(true);
    } catch (error) {
      console.warn('Failed to load theme CSS:', error);
      setIsLoaded(true);
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      const themeToLoad = savedTheme && THEME_CONFIGS.find(t => t.name === savedTheme) 
        ? savedTheme 
        : DEFAULT_THEME;
      
      setColorThemeState(themeToLoad);
      loadThemeCSS(themeToLoad);
    } catch (e) {
      console.warn('Failed to load color theme from localStorage');
      setColorThemeState(DEFAULT_THEME);
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