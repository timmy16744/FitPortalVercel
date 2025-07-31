// FitPortal App Settings Configuration
// This file controls various app features and behaviors

const appSettings = {
  // Authentication Settings
  auth: {
    // Enable/disable trainer login screen
    // When false: Trainers bypass login (single-trainer mode for branded apps)
    // When true: Full multi-trainer login system (gym/enterprise mode)
    enableTrainerLogin: false,
    
    // Client login is always PIN-based via URL, this setting doesn't affect it
    enableClientPinLogin: true,
    
    // Default trainer credentials when trainer login is disabled
    // This allows the app to automatically authenticate as the default trainer
    defaultTrainer: {
      id: 1,
      email: 'trainer@fitportal.com',
      name: 'Personal Trainer',
      role: 'trainer'
    }
  },
  
  // Branding Settings
  branding: {
    // App name shown in UI
    appName: 'FitPortal',
    
    // Enable custom branding for single-trainer mode
    enableCustomBranding: true,
    
    // Custom trainer/business name (when enableCustomBranding is true)
    businessName: 'Your Fitness Studio',
    trainerName: 'Your Personal Trainer'
  },
  
  // Feature Flags
  features: {
    // Enable multi-trainer/gym features
    enableMultiTrainer: false,
    
    // Enable advanced analytics
    enableAdvancedAnalytics: true,
    
    // Enable group chat features
    enableGroupChat: true
  },
  
  // Development Settings
  development: {
    // Show demo credentials on login page
    showDemoCredentials: true,
    
    // Enable debug logging
    enableDebugLogging: false
  }
};

export default appSettings;
