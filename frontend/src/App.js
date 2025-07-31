// FitPortal - Premium Fitness Management Platform
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Design System
import './styles/design-system.css';
import './styles/enhanced-design-system.css';

// Import Components
import LoginPage from './components/auth/LoginPage';
import TrainerDashboard from './components/trainer/TrainerDashboard';
import ClientDashboard from './components/client/ClientDashboard';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import ThemeProvider from './components/common/ThemeProvider';
import NotificationSystem from './components/common/NotificationSystem';

// Import Utils
import { AuthProvider, useAuth } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import appSettings from './config/appSettings';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('fitportal-theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Reduced initialization time for performance
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('fitportal-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
        <NotificationProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Main App Content Component
function AppContent() {
  const { user, isAuthenticated, autoLoginTrainer } = useAuth();

  // Auto-login default trainer if trainer login is disabled
  React.useEffect(() => {
    if (!appSettings.auth.enableTrainerLogin && !isAuthenticated) {
      const performAutoLogin = async () => {
        try {
          const result = await autoLoginTrainer();
          if (!result?.success) {
            console.warn('Auto-login failed, trainer login may be required');
          }
        } catch (error) {
          console.warn('Auto-login failed:', error);
        }
      };
      performAutoLogin();
    }
  }, [isAuthenticated, autoLoginTrainer]);

  return (
    <div className="app-container">
      <div className="noise-overlay" />
      
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            !appSettings.auth.enableTrainerLogin ? 
              <Navigate to="/trainer" replace /> :
              isAuthenticated ? 
                <Navigate to={user?.role === 'trainer' ? '/trainer' : '/client'} replace /> : 
                <LoginPage />
          } 
        />
        
        {/* Trainer Routes */}
        <Route 
          path="/trainer/*" 
          element={
            <ProtectedRoute requiredRole="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Client Routes */}
        <Route 
          path="/client/:clientId" 
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Default Redirects */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to={user?.role === 'trainer' ? '/trainer' : '/client'} replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Error Routes */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-error mb-4">403</h1>
                <p className="text-lg text-secondary mb-6">Unauthorized Access</p>
                <button 
                  onClick={() => window.history.back()}
                  className="btn btn-primary hover-scale"
                >
                  Go Back
                </button>
              </div>
            </div>
          } 
        />
        
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-error mb-4">404</h1>
                <p className="text-lg text-secondary mb-6">Page Not Found</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn btn-primary hover-scale"
                >
                  Go Home
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
      
      <NotificationSystem />
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default App;
