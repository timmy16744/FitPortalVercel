import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Shield, 
  Dumbbell, 
  MessageSquare, 
  Cog,
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Eye,
  Moon,
  Sun,
  Zap,
  Image,
  Type,
  Layout,
  Sliders,
  Sparkles,
  Check,
  X,
  Info
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../hooks/useSettings';
import { useNotification } from '../../utils/NotificationContext';

const AdvancedSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef(null);

  const { 
    theme, 
    themePreset, 
    currentColors, 
    isCustomTheme,
    presets,
    toggleTheme,
    applyPreset,
    updateColor,
    resetTheme,
    generatePalette,
    exportTheme,
    importTheme
  } = useTheme();

  const { settings, updateSettings } = useSettings();
  const { showSuccess, showError, showInfo } = useNotification();

  const tabs = [
    { id: 'appearance', label: 'Appearance & Branding', icon: Palette },
    { id: 'authentication', label: 'Authentication & Access', icon: Shield },
    { id: 'fitness', label: 'Fitness Features', icon: Dumbbell },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'advanced', label: 'Advanced Settings', icon: Cog }
  ];

  const handleColorChange = (colorKey, colorValue) => {
    updateColor(colorKey, colorValue);
    setHasChanges(true);
  };

  const handlePresetChange = (presetKey) => {
    applyPreset(presetKey);
    setHasChanges(true);
  };

  const handleGeneratePalette = (baseColor) => {
    const palette = generatePalette(baseColor);
    Object.entries(palette).forEach(([key, value]) => {
      updateColor(key, value);
    });
    setHasChanges(true);
    showInfo('Color palette generated from base color!', 'Theme Updated');
  };

  const handleExportTheme = () => {
    const themeConfig = exportTheme();
    const blob = new Blob([JSON.stringify(themeConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitportal-theme-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('Theme exported successfully!', 'Export Complete');
  };

  const handleImportTheme = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeConfig = JSON.parse(e.target.result);
        const result = importTheme(themeConfig);
        if (result.success) {
          showSuccess('Theme imported successfully!', 'Import Complete');
          setHasChanges(true);
        } else {
          showError(result.error, 'Import Failed');
        }
      } catch (error) {
        showError('Invalid theme file format', 'Import Failed');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveChanges = () => {
    // Save any pending settings changes
    setHasChanges(false);
    showSuccess('All settings saved successfully!', 'Settings Updated');
  };

  const handleResetAll = () => {
    resetTheme();
    setHasChanges(false);
    showInfo('Settings reset to defaults', 'Settings Reset');
  };

  const ColorPicker = ({ label, colorKey, value, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">
        {label}
      </label>
      {description && (
        <p className="text-xs text-secondary">{description}</p>
      )}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-primary/20 cursor-pointer transition-all hover:scale-105"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${colorKey}`).click()}
        />
        <input
          id={`color-${colorKey}`}
          type="color"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="input flex-1 font-mono text-sm"
          placeholder="#000000"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleGeneratePalette(value)}
          className="btn btn-ghost p-2"
          title="Generate palette from this color"
        >
          <Sparkles className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );

  const PresetCard = ({ presetKey, preset, isActive }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handlePresetChange(presetKey)}
      className={`card cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-brand-accent' : ''
      }`}
    >
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-primary">{preset.name}</h4>
          {isActive && <Check className="w-5 h-5 text-brand-accent" />}
        </div>
        <div className="flex gap-2">
          {Object.entries(preset.colors).slice(0, 4).map(([key, color]) => (
            <div
              key={key}
              className="w-8 h-8 rounded-md border border-primary/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-app-container">
      {/* Import the enhanced design system */}
      <link rel="stylesheet" href="/src/styles/enhanced-design-system.css" />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                <Settings className="w-6 h-6 text-inverse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Advanced Settings</h1>
                <p className="text-secondary">
                  Customize your FitPortal experience and branding
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn ${previewMode ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Exit Preview' : 'Preview Mode'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="btn btn-ghost p-3"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className="glass-card p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-brand-accent text-inverse'
                          : 'text-secondary hover:bg-surface-secondary hover:text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Appearance & Branding Tab */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    {/* Theme Mode */}
                    <div className="glass-card p-6">
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                        <Layout className="w-5 h-5" />
                        Theme Mode
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                        <div>
                          <h4 className="font-medium text-primary">Dark Mode</h4>
                          <p className="text-sm text-secondary mt-1">
                            Switch between light and dark themes
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleTheme}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            theme === 'dark' ? 'bg-brand-accent' : 'bg-text-muted/30'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Theme Presets */}
                    <div className="glass-card p-6">
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Theme Presets
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(presets).map(([key, preset]) => (
                          <PresetCard
                            key={key}
                            presetKey={key}
                            preset={preset}
                            isActive={!isCustomTheme && themePreset === key}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                          <Sliders className="w-5 h-5" />
                          Custom Colors
                        </h3>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportTheme}
                            className="btn btn-secondary btn-sm"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="btn btn-secondary btn-sm"
                          >
                            <Upload className="w-4 h-4" />
                            Import
                          </motion.button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImportTheme}
                            className="hidden"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ColorPicker
                          label="Primary Brand Color"
                          colorKey="brandPrimary"
                          value={currentColors.brandPrimary}
                          description="Main brand color for buttons and accents"
                        />
                        <ColorPicker
                          label="Secondary Brand Color"
                          colorKey="brandSecondary"
                          value={currentColors.brandSecondary}
                          description="Secondary brand color for gradients"
                        />
                        <ColorPicker
                          label="Accent Color"
                          colorKey="brandAccent"
                          value={currentColors.brandAccent}
                          description="Accent color for highlights and focus states"
                        />
                        <ColorPicker
                          label="Success Color"
                          colorKey="brandSuccess"
                          value={currentColors.brandSuccess}
                          description="Color for success messages and positive actions"
                        />
                        <ColorPicker
                          label="Warning Color"
                          colorKey="brandWarning"
                          value={currentColors.brandWarning}
                          description="Color for warnings and caution messages"
                        />
                        <ColorPicker
                          label="Error Color"
                          colorKey="brandError"
                          value={currentColors.brandError}
                          description="Color for errors and destructive actions"
                        />
                      </div>
                    </div>

                    {/* Branding Settings */}
                    <div className="glass-card p-6">
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5" />
                        Business Branding
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={settings.branding?.businessName || ''}
                            onChange={(e) => updateSettings({
                              branding: { ...settings.branding, businessName: e.target.value }
                            })}
                            className="input w-full"
                            placeholder="Your Fitness Studio"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">
                            Trainer Name
                          </label>
                          <input
                            type="text"
                            value={settings.branding?.trainerName || ''}
                            onChange={(e) => updateSettings({
                              branding: { ...settings.branding, trainerName: e.target.value }
                            })}
                            className="input w-full"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Authentication Tab */}
                {activeTab === 'authentication' && (
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Authentication Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                        <div>
                          <h4 className="font-medium text-primary">Trainer Login Screen</h4>
                          <p className="text-sm text-secondary mt-1">
                            {settings.auth?.enableTrainerLogin 
                              ? 'Multi-trainer mode: Show login screen for trainers'
                              : 'Single-trainer mode: Skip login screen (branded app mode)'
                            }
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateSettings({
                            auth: { ...settings.auth, enableTrainerLogin: !settings.auth?.enableTrainerLogin }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.auth?.enableTrainerLogin ? 'bg-brand-accent' : 'bg-text-muted/30'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.auth?.enableTrainerLogin ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other tabs would go here... */}
                {activeTab === 'fitness' && (
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5" />
                      Fitness Features
                    </h3>
                    <p className="text-secondary">Fitness feature settings coming soon...</p>
                  </div>
                )}

                {activeTab === 'communication' && (
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Communication Settings
                    </h3>
                    <p className="text-secondary">Communication settings coming soon...</p>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                      <Cog className="w-5 h-5" />
                      Advanced Settings
                    </h3>
                    <p className="text-secondary">Advanced settings coming soon...</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 flex gap-3 z-50"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetAll}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveChanges}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedSettingsPage;
