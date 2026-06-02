'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '@/theme/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme-mode');
    setIsDark(saved === 'dark');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? darkTheme : lightTheme;

  if (!mounted) {
    return (
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
}
