import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import consolidated CSS
import './styles/main.css';

// Import Context Providers
import { ThemeProvider } from './contexts/ThemeContext';

// Import Components
import TrainerDashboard from './components/trainer/TrainerDashboard';
import ClientMobileDashboard from './components/client/ClientMobileDashboard';
import LoginPage from './components/auth/LoginPage';

// Simple loading component
const LoadingPage = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f6fd'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '32px',
        height: '32px',
        margin: '0 auto 8px',
        backgroundColor: '#1f1c2e',
        borderRadius: '8px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}></div>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1f1c2e' }}>
        Loading FitPortal...
      </h1>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Minimal initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Default route - go to trainer dashboard */}
          <Route path="/" element={<Navigate to="/trainer" replace />} />
          
          {/* Trainer Dashboard */}
          <Route path="/trainer/*" element={<TrainerDashboard />} />
          
          {/* Client Mobile Dashboard */}
          <Route path="/client/mobile" element={<ClientMobileDashboard />} />
          <Route path="/client/:clientId/dashboard" element={<ClientMobileDashboard trainerAccess={true} />} />
          <Route path="/client/:clientId" element={<ClientMobileDashboard trainerAccess={false} />} />
          
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/trainer" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;