import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientDashboard from './components/ClientDashboard';
import PINLogin from './components/PINLogin';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [clientData, setClientData] = useState(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('clientAuth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        // Check if auth is still valid (you might want to add expiration logic)
        if (authData.clientId && authData.isAuthenticated) {
          setIsAuthenticated(true);
          setClientId(authData.clientId);
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error);
      }
    }
  }, []);

  const handleLogin = (clientId, pin) => {
    // In a real app, you would verify the PIN with the backend
    // For now, we'll just store the authentication state
    setIsAuthenticated(true);
    setClientId(clientId);
    
    // Store in localStorage for persistence
    localStorage.setItem('clientAuth', JSON.stringify({
      clientId,
      isAuthenticated: true,
      timestamp: Date.now()
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setClientId(null);
    setClientData(null);
    localStorage.removeItem('clientAuth');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <PINLogin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <ClientDashboard clientId={clientId} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/trainer-access/:clientId" 
            element={<ClientDashboard isTrainerMode={true} onLogout={() => {}} />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
