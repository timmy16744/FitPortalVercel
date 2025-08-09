// Premium Theme Selector Component
import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  Dumbbell, 
  Heart, 
  Zap, 
  Flower, 
  Target 
} from 'lucide-react';

const ThemeSelector = ({ currentTheme, onThemeChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'fitness-pro',
      name: 'Fitness Pro',
      description: 'Professional blue tones for serious training',
      icon: Dumbbell,
      primary: '#3B82F6',
      accent: '#F59E0B',
      preview: ['#3B82F6', '#1E40AF', '#F59E0B']
    },
    {
      id: 'wellness-zen',
      name: 'Wellness Zen',
      description: 'Calming greens for mindful fitness',
      icon: Flower,
      primary: '#10B981',
      accent: '#84CC16',
      preview: ['#10B981', '#059669', '#84CC16']
    },
    {
      id: 'power-strength',
      name: 'Power & Strength',
      description: 'Bold reds for intense workouts',
      icon: Target,
      primary: '#EF4444',
      accent: '#F97316',
      preview: ['#EF4444', '#DC2626', '#F97316']
    },
    {
      id: 'yoga-flow',
      name: 'Yoga Flow',
      description: 'Peaceful purples for harmony',
      icon: Heart,
      primary: '#8B5CF6',
      accent: '#EC4899',
      preview: ['#8B5CF6', '#7C3AED', '#EC4899']
    },
    {
      id: 'crossfit-edge',
      name: 'CrossFit Edge',
      description: 'Dynamic teals for high-intensity training',
      icon: Zap,
      primary: '#06B6D4',
      accent: '#14B8A6',
      preview: ['#06B6D4', '#0891B2', '#14B8A6']
    }
  ];

  const handleThemeSelect = (themeId) => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme-preset', themeId);
    
    // Store theme preference
    localStorage.setItem('fitportal-theme-preset', themeId);
    
    // Notify parent component
    onThemeChange?.(themeId);
    
    setIsOpen(false);
  };

  const selectedTheme = themes.find(theme => theme.id === currentTheme) || themes[0];

  return (
    <div className={`relative ${className}`}>
      {/* Theme Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-premium btn-premium--secondary btn-premium--sm hover-lift focus-visible flex items-center gap-2"
        title="Change Theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden md:inline">Theme</span>
        <div className="flex gap-1">
          {selectedTheme.preview.map((color, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-modal-backdrop bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Panel */}
          <div className="absolute top-full right-0 mt-2 w-80 z-modal bg-glass-heavy backdrop-blur-xl border border-interactive rounded-2xl shadow-2xl overflow-hidden animate-scale-in origin-top-right">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <Palette className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Choose Your Theme</h3>
                  <p className="text-sm text-secondary">Personalize your FitPortal experience</p>
                </div>
              </div>

              <div className="space-y-3">
                {themes.map((theme, index) => {
                  const Icon = theme.icon;
                  const isSelected = theme.id === currentTheme;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] focus-visible group animate-fade-in-up stagger-${index + 1} ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-border-subtle hover:border-border-medium bg-surface-primary'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Theme Icon */}
                        <div 
                          className={`p-3 rounded-lg transition-colors ${
                            isSelected ? 'bg-brand-100' : 'bg-surface-secondary group-hover:bg-surface-tertiary'
                          }`}
                          style={{ 
                            backgroundColor: isSelected ? `${theme.primary}20` : undefined,
                            color: isSelected ? theme.primary : undefined
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Theme Info */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-primary">{theme.name}</h4>
                            {isSelected && (
                              <div className="p-1 bg-brand-500 rounded-full">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-secondary">{theme.description}</p>
                        </div>

                        {/* Color Preview */}
                        <div className="flex gap-1">
                          {theme.preview.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pro Features Teaser */}
              <div className="mt-6 p-4 bg-gradient-to-r from-brand-50 to-accent-50 rounded-xl border border-brand-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-brand-700 text-sm">FitPortal Pro</h4>
                    <p className="text-xs text-brand-600">Unlock custom themes, advanced analytics, and more</p>
                  </div>
                  <button className="btn-premium btn-premium--primary btn-premium--sm">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;