import React, { createContext, useState, useContext, useEffect } from 'react';

const themes = {
  modern: {
    name: 'Modern Minimal',
    colors: {
      primary: '#6366f1',
      primaryDark: '#4f46e5',
      primaryLight: '#818cf8',
      secondary: '#8b5cf6',
      secondaryDark: '#7c3aed',
      secondaryLight: '#a78bfa',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      
      text: '#111827',
      textSecondary: '#6b7280',
      textTertiary: '#9ca3af',
      textInverse: '#ffffff',
      
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowMedium: 'rgba(0, 0, 0, 0.15)',
      shadowLarge: 'rgba(0, 0, 0, 0.2)',
      
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(0, 0, 0, 0.3)',
      
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontFamilyHeading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSizeBase: '16px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightSemibold: '600',
      fontWeightBold: '700',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      xxl: '1.5rem',
      full: '9999px',
    },
    animation: {
      duration: '200ms',
      durationSlow: '300ms',
      durationSlower: '500ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  energy: {
    name: 'Bold Energy',
    colors: {
      primary: '#ff6b35',
      primaryDark: '#ee5a24',
      primaryLight: '#ff8c42',
      secondary: '#4ecdc4',
      secondaryDark: '#3aa59f',
      secondaryLight: '#6ddbd3',
      accent: '#ffe66d',
      success: '#00d9a3',
      warning: '#ffb800',
      error: '#ff3855',
      info: '#00a8ff',
      
      background: '#0a0e27',
      surface: '#1a1f3a',
      surfaceHover: '#242a4a',
      border: '#2a3050',
      borderLight: '#353b5a',
      
      text: '#ffffff',
      textSecondary: '#b8bcd8',
      textTertiary: '#8890b5',
      textInverse: '#0a0e27',
      
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowMedium: 'rgba(0, 0, 0, 0.4)',
      shadowLarge: 'rgba(0, 0, 0, 0.5)',
      
      overlay: 'rgba(0, 0, 0, 0.7)',
      overlayLight: 'rgba(0, 0, 0, 0.5)',
      
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #ff3855 100%)',
      gradientSecondary: 'linear-gradient(135deg, #4ecdc4 0%, #00d9a3 100%)',
    },
    typography: {
      fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontFamilyHeading: "'Bebas Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSizeBase: '16px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightSemibold: '600',
      fontWeightBold: '700',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      xxl: '1rem',
      full: '9999px',
    },
    animation: {
      duration: '150ms',
      durationSlow: '250ms',
      durationSlower: '400ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easingBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('modern');
  const [customColors, setCustomColors] = useState({});
  const [customBranding, setCustomBranding] = useState({
    logoUrl: null,
    appName: 'FitPortal',
    primaryColor: null,
    accentColor: null,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('fitportal_theme');
    const savedCustomColors = localStorage.getItem('fitportal_custom_colors');
    const savedBranding = localStorage.getItem('fitportal_branding');
    
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    if (savedCustomColors) {
      setCustomColors(JSON.parse(savedCustomColors));
    }
    if (savedBranding) {
      setCustomBranding(JSON.parse(savedBranding));
    }
    
    applyTheme(savedTheme || 'modern', savedCustomColors ? JSON.parse(savedCustomColors) : {});
  }, []);

  const applyTheme = (themeName, customOverrides = {}) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    const finalColors = {
      ...theme.colors,
      ...customOverrides,
      ...(customBranding.primaryColor && { primary: customBranding.primaryColor }),
      ...(customBranding.accentColor && { accent: customBranding.accentColor }),
    };
    
    Object.entries(finalColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    Object.entries(theme.animation).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
    });
    
    root.setAttribute('data-theme', themeName);
  };

  const switchTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('fitportal_theme', themeName);
    applyTheme(themeName, customColors);
  };

  const updateCustomColors = (colors) => {
    const newColors = { ...customColors, ...colors };
    setCustomColors(newColors);
    localStorage.setItem('fitportal_custom_colors', JSON.stringify(newColors));
    applyTheme(currentTheme, newColors);
  };

  const updateBranding = (branding) => {
    const newBranding = { ...customBranding, ...branding };
    setCustomBranding(newBranding);
    localStorage.setItem('fitportal_branding', JSON.stringify(newBranding));
    applyTheme(currentTheme, customColors);
  };

  const resetTheme = () => {
    setCustomColors({});
    localStorage.removeItem('fitportal_custom_colors');
    applyTheme(currentTheme, {});
  };

  const exportThemeConfig = () => {
    return {
      theme: currentTheme,
      customColors,
      branding: customBranding,
    };
  };

  const importThemeConfig = (config) => {
    if (config.theme) {
      setCurrentTheme(config.theme);
      localStorage.setItem('fitportal_theme', config.theme);
    }
    if (config.customColors) {
      setCustomColors(config.customColors);
      localStorage.setItem('fitportal_custom_colors', JSON.stringify(config.customColors));
    }
    if (config.branding) {
      setCustomBranding(config.branding);
      localStorage.setItem('fitportal_branding', JSON.stringify(config.branding));
    }
    applyTheme(config.theme || currentTheme, config.customColors || {});
  };

  const value = {
    theme: themes[currentTheme],
    currentTheme,
    themes,
    switchTheme,
    updateCustomColors,
    updateBranding,
    resetTheme,
    customColors,
    customBranding,
    exportThemeConfig,
    importThemeConfig,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;