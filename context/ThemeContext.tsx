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
    // Carregar preferência salva ou usar light mode como padrão
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      setIsDark(false); // Light mode como padrão
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => setIsDark(!isDark);
  const theme = isDark ? darkTheme : lightTheme;

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
