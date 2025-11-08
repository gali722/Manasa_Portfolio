import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const lightTheme = {
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

const darkTheme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#34D399',
    background: '#0F172A',
    surface: '#1E293B',
    textPrimary: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textDisabled: '#64748B',
    border: '#334155',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    const root = document.documentElement;

    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Apply shadow variables
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Add theme class to html element
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
