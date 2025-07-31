import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WorkoutLogger from './WorkoutLogger';
import NutritionTracker from './NutritionTracker';
import ProgressTracker from './ProgressTracker';
import ClientAPI from '../utils/api';

const ClientDashboard = ({ clientId: propClientId, onLogout, isTrainerMode = false }) => {
  const navigate = useNavigate();
  const { clientId: urlClientId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [activeTab, setActiveTab] = useState('workout');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use clientId from props first, then from URL params (for trainer mode)
  const effectiveClientId = propClientId || urlClientId;

  useEffect(() => {
    if (effectiveClientId) {
      loadClientData();
    }
  }, [effectiveClientId]);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      const data = await ClientAPI.getClient(effectiveClientId);
      setClientData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load client data');
      console.error('Error loading client data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="client-dashboard" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="dashboard-content" style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-dashboard" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="dashboard-content" style={{ 
          flex: 1, 
          padding: '1rem',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div className="dashboard-card" style={{ 
            textAlign: 'center', 
            maxWidth: '400px',
            width: '100%'
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h2>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button 
              onClick={loadClientData} 
              style={{ 
                background: '#667eea', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'workout', label: 'Workout', icon: '💪' },
    { id: 'nutrition', label: 'Nutrition', icon: '🍎' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workout':
        return <WorkoutLogger clientId={effectiveClientId} />;
      case 'nutrition':
        return <NutritionTracker clientId={effectiveClientId} />;
      case 'progress':
        return <ProgressTracker clientId={effectiveClientId} />;
      case 'profile':
        return (
          <div className="dashboard-card" style={{ 
            padding: '1.5rem',
            margin: '1rem',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="card-header" style={{ marginBottom: '1.5rem' }}>
              <h2 className="card-title" style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                margin: 0,
                color: '#1f2937'
              }}>
                Profile Information
              </h2>
            </div>
            {clientData && (
              <div style={{ 
                display: 'grid', 
                gap: '1rem',
                fontSize: '0.95rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong style={{ color: '#6b7280' }}>Name:</strong>
                  <span style={{ color: '#1f2937' }}>{clientData.name}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong style={{ color: '#6b7280' }}>Email:</strong>
                  <span style={{ color: '#1f2937' }}>{clientData.email}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong style={{ color: '#6b7280' }}>Age:</strong>
                  <span style={{ color: '#1f2937' }}>{clientData.age || 'Not specified'}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong style={{ color: '#6b7280' }}>Gender:</strong>
                  <span style={{ color: '#1f2937' }}>{clientData.gender || 'Not specified'}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong style={{ color: '#6b7280' }}>Height:</strong>
                  <span style={{ color: '#1f2937' }}>
                    {clientData.height ? `${clientData.height} cm` : 'Not specified'}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem 0'
                }}>
                  <strong style={{ color: '#6b7280' }}>Weight:</strong>
                  <span style={{ color: '#1f2937' }}>
                    {clientData.weight ? `${clientData.weight} kg` : 'Not specified'}
                  </span>
                </div>
                <div style={{ 
                  padding: '0.75rem 0'
                }}>
                  <strong style={{ color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                    Goals:
                  </strong>
                  <p style={{ 
                    color: '#1f2937', 
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {clientData.goals || 'Not specified'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <WorkoutLogger clientId={effectiveClientId} />;
    }
  };

  return (
    <div className="client-dashboard" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      paddingBottom: '70px' // Space for bottom nav
    }}>
      {/* Header */}
      <div className="dashboard-header" style={{ 
        backgroundColor: '#667eea', 
        color: 'white', 
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            margin: 0 
          }}>
            FitPortal
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {clientData && (
              <span style={{ fontSize: '0.9rem' }}>
                Hi, {clientData.name.split(' ')[0]}!
              </span>
            )}
            {!isTrainerMode && (
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  color: 'white', 
                  border: '1px solid rgba(255,255,255,0.5)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-content" style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '1rem 0'
      }}>
        {renderTabContent()}
      </div>

      {/* Bottom Navigation (Mobile Optimized) */}
      <div className="bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 100
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: activeTab === tab.id ? '#667eea' : '#6b7280',
              fontSize: '0.75rem',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
          >
            <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
