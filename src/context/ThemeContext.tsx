"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side and only once
    if (typeof window !== "undefined" && !isInitialized) {
      const savedTheme = localStorage.getItem('library-theme') as Theme;
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setThemeState(savedTheme);
      } else {
        // Set default theme to light (no system preference detection)
        setThemeState('light');
        localStorage.setItem('library-theme', 'light');
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      const root = window.document.documentElement;

      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      // Add new theme class
      root.classList.add(theme);

      // Store theme in localStorage
      localStorage.setItem('library-theme', theme);
    }
  }, [theme, isInitialized]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}