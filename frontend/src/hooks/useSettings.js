// Settings Management Hook
import { useState, useEffect } from 'react';
import appSettings from '../config/appSettings';

export const useSettings = () => {
  const [settings, setSettings] = useState(appSettings);

  // In the future, this could load settings from localStorage, API, etc.
  useEffect(() => {
    // Load any saved settings from localStorage
    const savedSettings = localStorage.getItem('fitportal-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('fitportal-settings', JSON.stringify(updatedSettings));
  };

  // Helper methods for common settings
  const isTrainerLoginEnabled = () => settings.auth.enableTrainerLogin;
  const getDefaultTrainer = () => settings.auth.defaultTrainer;
  const getBrandingInfo = () => settings.branding;
  
  // Toggle trainer login mode
  const toggleTrainerLogin = () => {
    updateSettings({
      auth: {
        ...settings.auth,
        enableTrainerLogin: !settings.auth.enableTrainerLogin
      }
    });
  };

  return {
    settings,
    updateSettings,
    isTrainerLoginEnabled,
    getDefaultTrainer,
    getBrandingInfo,
    toggleTrainerLogin
  };
};

export default useSettings;
