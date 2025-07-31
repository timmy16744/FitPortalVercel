import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from './ApiClient';
import appSettings from '../config/appSettings';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('fitportal-token');
      const userData = localStorage.getItem('fitportal-user');
      
      if (token && userData) {
        // Set token in ApiClient
        ApiClient.setAuthToken(token);
        
        // Parse user data
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Optionally verify token with backend
        try {
          await ApiClient.verifyToken();
        } catch (error) {
          // Token invalid, clear auth
          await logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await ApiClient.login(email, password);
      
      if (response.token && response.user) {
        // Store auth data
        localStorage.setItem('fitportal-token', response.token);
        localStorage.setItem('fitportal-user', JSON.stringify(response.user));
        
        // Set token in ApiClient
        ApiClient.setAuthToken(response.token);
        
        // Update state
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('fitportal-token');
      localStorage.removeItem('fitportal-user');
      
      // Clear ApiClient token
      ApiClient.clearAuthToken();
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      
      // Optionally notify backend
      try {
        await ApiClient.logout();
      } catch (error) {
        // Ignore logout errors
        console.warn('Logout notification failed:', error);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('fitportal-user', JSON.stringify(updatedUser));
  };

  // Auto-login for single trainer mode
  const autoLoginTrainer = async () => {
    try {
      if (!appSettings.auth.enableTrainerLogin && !isAuthenticated) {
        // Create a mock successful login response for the default trainer
        const mockTrainerData = {
          token: 'auto-login-token-' + Date.now(),
          user: appSettings.auth.defaultTrainer
        };
        
        // Store auth data
        localStorage.setItem('fitportal-token', mockTrainerData.token);
        localStorage.setItem('fitportal-user', JSON.stringify(mockTrainerData.user));
        
        // Set token in ApiClient
        ApiClient.setAuthToken(mockTrainerData.token);
        
        // Update state
        setUser(mockTrainerData.user);
        setIsAuthenticated(true);
        
        return { success: true, user: mockTrainerData.user };
      }
    } catch (error) {
      console.error('Auto-login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    autoLoginTrainer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
