import React, { useState } from 'react';

const PINLogin = ({ onLogin }) => {
  const [clientId, setClientId] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!clientId || !pin) {
      setError('Please enter both Client ID and PIN');
      setIsLoading(false);
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      setIsLoading(false);
      return;
    }

    // In a real application, you would verify the PIN with the backend
    // For now, we'll simulate a successful login
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 4-digit PIN
      // In production, you would verify against the backend
      onLogin(clientId, pin);
    } catch (err) {
      setError('Invalid Client ID or PIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pin-login-container">
      <div className="pin-login-card">
        <h1 className="pin-login-title">FitPortal Client Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Enter your Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="pin-input"
              style={{ marginBottom: '1rem', fontSize: '1rem', textAlign: 'left' }}
            />
            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="pin-input"
              maxLength="4"
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#666' }}>
          <p>Your Client ID and PIN were provided by your trainer.</p>
          <p style={{ marginTop: '0.5rem' }}>
            Example: Client ID: abc123, PIN: 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default PINLogin;
