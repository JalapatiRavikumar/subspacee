import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider');
    // Return a fallback theme to prevent crashes
    return {
      currentTheme: 'default',
      themes: {},
      currentThemeData: {
        name: 'Default',
        colors: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f8fafc',
          border: '#334155'
        }
      },
      changeTheme: () => console.warn('Theme change not available')
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  console.log('ThemeProvider initialized with theme:', currentTheme);

  const themes = {
    default: {
      name: 'Default',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f8fafc',
        border: '#334155'
      },
      gradients: {
        primary: 'from-blue-600 to-indigo-600',
        secondary: 'from-purple-600 to-pink-600',
        background: 'from-slate-900 via-blue-900 to-slate-900'
      }
    },
    cosmic: {
      name: 'Cosmic',
      colors: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#ffff00',
        background: '#000033',
        surface: '#110022',
        text: '#ffffff',
        border: '#ff00ff'
      },
      gradients: {
        primary: 'from-fuchsia-600 to-cyan-400',
        secondary: 'from-cyan-400 to-yellow-400',
        background: 'from-indigo-900 via-purple-900 to-indigo-900'
      }
    },
    inferno: {
      name: 'Inferno',
      colors: {
        primary: '#ff3d00',
        secondary: '#ff9100',
        accent: '#ffea00',
        background: '#330000',
        surface: '#220000',
        text: '#ffffff',
        border: '#ff3d00'
      },
      gradients: {
        primary: 'from-red-600 to-orange-500',
        secondary: 'from-orange-500 to-yellow-400',
        background: 'from-red-900 via-orange-900 to-red-900'
      }
    }
  };

  // Initialize CSS custom properties on mount
  useEffect(() => {
    const root = document.documentElement;
    const defaultTheme = themes.default;
    root.style.setProperty('--theme-primary', defaultTheme.colors.primary);
    root.style.setProperty('--theme-secondary', defaultTheme.colors.secondary);
    root.style.setProperty('--theme-accent', defaultTheme.colors.accent);
    root.style.setProperty('--theme-background', defaultTheme.colors.background);
    root.style.setProperty('--theme-surface', defaultTheme.colors.surface);
    root.style.setProperty('--theme-text', defaultTheme.colors.text);
    root.style.setProperty('--theme-border', defaultTheme.colors.border);
    
    // Initialize glow color variables for animations
    root.style.setProperty('--glow-color', defaultTheme.colors.primary + '80');
    root.style.setProperty('--glow-color-brighter', defaultTheme.colors.primary);
  }, [themes.default]); // Added themes.default as a dependency

  const changeTheme = (themeName) => {
    console.log('Changing theme from', currentTheme, 'to', themeName);
    setCurrentTheme(themeName);
    
    // Update CSS custom properties for immediate visual feedback
    const root = document.documentElement;
    const newTheme = themes[themeName];
    if (newTheme) {
      root.style.setProperty('--theme-primary', newTheme.colors.primary);
      root.style.setProperty('--theme-secondary', newTheme.colors.secondary);
      root.style.setProperty('--theme-accent', newTheme.colors.accent);
      root.style.setProperty('--theme-background', newTheme.colors.background);
      root.style.setProperty('--theme-surface', newTheme.colors.surface);
      root.style.setProperty('--theme-text', newTheme.colors.text);
      root.style.setProperty('--theme-border', newTheme.colors.border);
      
      // Add glow color variables for animations
      root.style.setProperty('--glow-color', newTheme.colors.primary + '80');
      root.style.setProperty('--glow-color-brighter', newTheme.colors.primary);
    }
  };

  const value = {
    currentTheme,
    themes,
    currentThemeData: themes[currentTheme],
    changeTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
