// Enhanced Theme Management Hook
import { useState, useEffect, useCallback } from 'react';

// Default theme presets
const THEME_PRESETS = {
  default: {
    name: 'FitPortal Default',
    colors: {
      brandPrimary: '#1f1c2e',
      brandSecondary: '#4A4A4A',
      brandAccent: '#6366f1',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  },
  'fitness-pro': {
    name: 'Fitness Pro',
    colors: {
      brandPrimary: '#1e40af',
      brandSecondary: '#3b82f6',
      brandAccent: '#f97316',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  },
  'wellness-zen': {
    name: 'Wellness Zen',
    colors: {
      brandPrimary: '#166534',
      brandSecondary: '#22c55e',
      brandAccent: '#84cc16',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  },
  'power-strength': {
    name: 'Power Strength',
    colors: {
      brandPrimary: '#991b1b',
      brandSecondary: '#dc2626',
      brandAccent: '#f59e0b',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  },
  'yoga-flow': {
    name: 'Yoga Flow',
    colors: {
      brandPrimary: '#7c3aed',
      brandSecondary: '#a855f7',
      brandAccent: '#ec4899',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  },
  'crossfit-edge': {
    name: 'CrossFit Edge',
    colors: {
      brandPrimary: '#171717',
      brandSecondary: '#404040',
      brandAccent: '#22d3ee',
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    }
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const [themePreset, setThemePreset] = useState('default');
  const [customColors, setCustomColors] = useState(THEME_PRESETS.default.colors);
  const [isCustomTheme, setIsCustomTheme] = useState(false);

  // Load saved theme settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('fitportal-theme') || 'light';
    const savedPreset = localStorage.getItem('fitportal-theme-preset') || 'default';
    const savedCustomColors = localStorage.getItem('fitportal-custom-colors');
    const savedIsCustom = localStorage.getItem('fitportal-is-custom-theme') === 'true';

    setTheme(savedTheme);
    setThemePreset(savedPreset);
    setIsCustomTheme(savedIsCustom);

    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (error) {
        console.warn('Failed to parse saved custom colors:', error);
      }
    }

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!savedIsCustom && savedPreset !== 'default') {
      document.documentElement.setAttribute('data-theme-preset', savedPreset);
    }
  }, []);

  // Apply custom colors to CSS custom properties
  const applyCustomColors = useCallback((colors) => {
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fitportal-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  // Apply a preset theme
  const applyPreset = useCallback((presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;

    setThemePreset(presetKey);
    setIsCustomTheme(false);
    
    localStorage.setItem('fitportal-theme-preset', presetKey);
    localStorage.setItem('fitportal-is-custom-theme', 'false');
    
    // Remove custom colors from CSS
    const root = document.documentElement;
    Object.keys(customColors).forEach(key => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.removeProperty(cssVar);
    });
    
    // Apply preset
    if (presetKey === 'default') {
      document.documentElement.removeAttribute('data-theme-preset');
    } else {
      document.documentElement.setAttribute('data-theme-preset', presetKey);
    }
  }, [customColors]);

  // Apply custom colors
  const applyCustomTheme = useCallback((colors) => {
    setCustomColors(colors);
    setIsCustomTheme(true);
    setThemePreset('custom');
    
    localStorage.setItem('fitportal-custom-colors', JSON.stringify(colors));
    localStorage.setItem('fitportal-is-custom-theme', 'true');
    localStorage.setItem('fitportal-theme-preset', 'custom');
    
    // Remove preset attribute
    document.documentElement.removeAttribute('data-theme-preset');
    
    // Apply custom colors
    applyCustomColors(colors);
  }, [applyCustomColors]);

  // Update a single color
  const updateColor = useCallback((colorKey, colorValue) => {
    const newColors = { ...customColors, [colorKey]: colorValue };
    applyCustomTheme(newColors);
  }, [customColors, applyCustomTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    applyPreset('default');
    setCustomColors(THEME_PRESETS.default.colors);
  }, [applyPreset]);

  // Get current colors (either from preset or custom)
  const getCurrentColors = useCallback(() => {
    if (isCustomTheme) {
      return customColors;
    }
    return THEME_PRESETS[themePreset]?.colors || THEME_PRESETS.default.colors;
  }, [isCustomTheme, customColors, themePreset]);

  // Export theme configuration
  const exportTheme = useCallback(() => {
    return {
      theme,
      preset: themePreset,
      isCustom: isCustomTheme,
      colors: getCurrentColors(),
      timestamp: new Date().toISOString()
    };
  }, [theme, themePreset, isCustomTheme, getCurrentColors]);

  // Import theme configuration
  const importTheme = useCallback((themeConfig) => {
    try {
      if (themeConfig.theme) {
        setTheme(themeConfig.theme);
        document.documentElement.setAttribute('data-theme', themeConfig.theme);
        localStorage.setItem('fitportal-theme', themeConfig.theme);
      }

      if (themeConfig.isCustom && themeConfig.colors) {
        applyCustomTheme(themeConfig.colors);
      } else if (themeConfig.preset) {
        applyPreset(themeConfig.preset);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to import theme:', error);
      return { success: false, error: error.message };
    }
  }, [applyCustomTheme, applyPreset]);

  // Generate harmonious color palette from a base color
  const generatePalette = useCallback((baseColor) => {
    // Simple palette generation - in a real app, you might use a color theory library
    const hsl = hexToHsl(baseColor);
    
    return {
      brandPrimary: baseColor,
      brandSecondary: hslToHex((hsl.h + 30) % 360, hsl.s, Math.min(hsl.l + 10, 90)),
      brandAccent: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      brandSuccess: '#10b981',
      brandWarning: '#f59e0b',
      brandError: '#ef4444',
      brandInfo: '#3b82f6'
    };
  }, []);

  return {
    // Current state
    theme,
    themePreset,
    customColors,
    isCustomTheme,
    currentColors: getCurrentColors(),
    
    // Theme presets
    presets: THEME_PRESETS,
    
    // Actions
    toggleTheme,
    applyPreset,
    applyCustomTheme,
    updateColor,
    resetTheme,
    generatePalette,
    
    // Import/Export
    exportTheme,
    importTheme
  };
};

// Utility functions for color manipulation
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default useTheme;
