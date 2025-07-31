import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Users, Palette, Save, RotateCcw } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useNotification } from '../../utils/NotificationContext';

const SettingsPage = () => {
  const { settings, updateSettings, toggleTrainerLogin } = useSettings();
  const { showSuccess, showInfo } = useNotification();
  const [hasChanges, setHasChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (section, key, value) => {
    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    showSuccess('Settings saved successfully!', 'Settings Updated');
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
    showInfo('Changes discarded', 'Settings Reset');
  };

  return (
    <div className="min-h-screen bg-primary-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-display">App Settings</h1>
          </div>
          <p className="text-text-secondary">
            Configure your FitPortal app behavior and features
          </p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Authentication Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold text-display">Authentication</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent-bg/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Trainer Login Screen</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {localSettings.auth.enableTrainerLogin 
                      ? 'Multi-trainer mode: Show login screen for trainers'
                      : 'Single-trainer mode: Skip login screen (branded app mode)'
                    }
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSettingChange('auth', 'enableTrainerLogin', !localSettings.auth.enableTrainerLogin)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.auth.enableTrainerLogin ? 'bg-brand-primary' : 'bg-text-muted/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.auth.enableTrainerLogin ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>

              {!localSettings.auth.enableTrainerLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-info/5 border border-info/20 rounded-lg"
                >
                  <h4 className="font-medium text-info mb-2">Single-Trainer Mode Active</h4>
                  <p className="text-sm text-text-secondary">
                    Perfect for personal trainers who want their own branded fitness app. 
                    The app will automatically authenticate as the default trainer without showing a login screen.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Branding Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold text-display">Branding</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={localSettings.branding.businessName}
                  onChange={(e) => handleSettingChange('branding', 'businessName', e.target.value)}
                  className="input w-full"
                  placeholder="Your Fitness Studio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Trainer Name
                </label>
                <input
                  type="text"
                  value={localSettings.branding.trainerName}
                  onChange={(e) => handleSettingChange('branding', 'trainerName', e.target.value)}
                  className="input w-full"
                  placeholder="Your Personal Trainer"
                />
              </div>
            </div>
          </motion.div>

          {/* Feature Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-brand-primary" />
              <h2 className="text-xl font-semibold text-display">Features</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent-bg/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Group Chat</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Enable group chat functionality for clients
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSettingChange('features', 'enableGroupChat', !localSettings.features.enableGroupChat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.features.enableGroupChat ? 'bg-brand-primary' : 'bg-text-muted/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.features.enableGroupChat ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent-bg/30 rounded-lg">
                <div>
                  <h3 className="font-medium text-text-primary">Advanced Analytics</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Show detailed analytics and progress tracking
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSettingChange('features', 'enableAdvancedAnalytics', !localSettings.features.enableAdvancedAnalytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.features.enableAdvancedAnalytics ? 'bg-brand-primary' : 'bg-text-muted/30'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.features.enableAdvancedAnalytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
