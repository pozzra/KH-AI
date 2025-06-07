
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Theme } from '../types'; // Theme enum: 'light', 'dark', 'system'
import { useLanguage } from './LanguageContext'; // To use translations if needed for labels

interface ThemeContextType {
  theme: Theme; // The user's selected theme (light, dark, system)
  effectiveTheme: 'light' | 'dark'; // The actual theme being applied
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const APP_THEME_STORAGE_KEY = 'appTheme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(APP_THEME_STORAGE_KEY) as Theme;
    return storedTheme || Theme.SYSTEM; // Default to system preference
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  const applyTheme = useCallback((selectedTheme: Theme) => {
    let currentEffectiveTheme: 'light' | 'dark';
    if (selectedTheme === Theme.SYSTEM) {
      currentEffectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      currentEffectiveTheme = selectedTheme as 'light' | 'dark';
    }

    setEffectiveTheme(currentEffectiveTheme);

    if (currentEffectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === Theme.SYSTEM) {
        applyTheme(Theme.SYSTEM);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
