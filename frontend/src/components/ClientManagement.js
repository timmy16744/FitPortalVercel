import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Filter, Calendar, TrendingUp, MessageCircle, Settings, Eye, Edit, Archive, MoreVertical } from 'lucide-react';
import ApiClient from '../utils/api';
import { getClientAvatarColor } from '../utils/exerciseUtils';

const ClientManagement = ({ onSelectClient, onCreateClient }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, [statusFilter]);

  // Filter clients based on search and status
  useEffect(() => {
    let filtered = clients;
    
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const clientData = await ApiClient.getClients(statusFilter);
      setClients(clientData);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveClient = async (clientId) => {
    try {
      await ApiClient.archiveClient(clientId);
      loadClients(); // Refresh the list
    } catch (error) {
      console.error('Failed to archive client:', error);
    }
  };

  const getClientStats = () => {
    const activeClients = clients.filter(c => !c.archived).length;
    const totalClients = clients.length;
    const newThisWeek = clients.filter(c => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.created_at || Date.now()) > weekAgo;
    }).length;

    return { activeClients, totalClients, newThisWeek };
  };

  const ClientCard = ({ client }) => (
    <div className="project-box-wrapper">
      <div className="project-box hover-scale" style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}>
        <div className="project-box-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div className="client-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              className="client-avatar"
              style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '18px',
                flexShrink: 0
              }}
            >
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1f2937',
                lineHeight: '1.4'
              }}>
                {client.name}
              </h3>
              <p style={{ 
                margin: '2px 0 0 0', 
                fontSize: '14px', 
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                {client.email}
              </p>
            </div>
          </div>
          <div className="more-wrapper" style={{ position: 'relative' }}>
            <button className="project-btn-more hover-scale" style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'all 0.2s ease'
            }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
        
        <div className="client-stats" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '2px'
            }}>
              {client.workouts_completed || 0}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Workouts Completed
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '2px'
            }}>
              {client.current_weight ? `${client.current_weight}kg` : 'Not set'}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Current Weight
            </div>
          </div>
        </div>
        
        <div className="client-actions" style={{ 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          gap: '8px'
        }}>
          <button 
            onClick={() => onSelectClient(client.id)}
            className="btn-primary hover-scale"
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '500',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Eye size={14} />
            View App
          </button>
          <button 
            onClick={() => console.log('Edit client', client.id)}
            className="btn-secondary hover-scale"
            style={{
              padding: '10px 12px',
              fontSize: '13px',
              fontWeight: '500',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Edit size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const stats = getClientStats();

  if (isLoading) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Client Management</p>
          <p className="time">Loading clients...</p>
        </div>
        <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f4f6', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ 
      padding: '24px 32px',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="content-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#1f2937',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>
            Client <span style={{ color: '#667eea' }}>Management</span>
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280',
            margin: 0,
            fontWeight: '400'
          }}>
            Manage your fitness clients
          </p>
        </div>
        <button 
          className="btn-primary hover-scale"
          onClick={() => setShowCreateModal(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          <Plus size={16} />
          Add New Client
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #fee4cb 0%, #f59e0b 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              marginBottom: '4px',
              color: '#1f2937'
            }}>
              {stats.activeClients}
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#1f2937',
              opacity: 0.8
            }}>
              Active Clients
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #e9e7fd 0%, #8b5cf6 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              marginBottom: '4px',
              color: '#1f2937'
            }}>
              {stats.totalClients}
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#1f2937',
              opacity: 0.8
            }}>
              Total Clients
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #dbf6fd 0%, #06b6d4 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              marginBottom: '4px',
              color: '#1f2937'
            }}>
              {stats.newThisWeek}
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#1f2937',
              opacity: 0.8
            }}>
              New This Week
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        gap: '16px'
      }}>
        <div className="search-wrapper" style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
          <Search size={16} style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af' 
          }} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="active">Active Clients</option>
            <option value="archived">Archived Clients</option>
            <option value="all">All Clients</option>
          </select>
          
          <div className="view-toggle" style={{ display: 'flex', gap: '4px' }}>
            <button 
              className={`view-btn hover-scale ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: viewMode === 'list' ? '#667eea' : 'white',
                color: viewMode === 'list' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button 
              className={`view-btn hover-scale ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: viewMode === 'grid' ? '#667eea' : 'white',
                color: viewMode === 'grid' ? 'white' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Client Grid */}
      <div className={`clients-grid ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`} style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="empty-state" style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <Users size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No clients found
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
            </p>
            <button 
              className="btn-primary hover-scale"
              onClick={() => setShowCreateModal(true)}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} />
              Add Your First Client
            </button>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <ClientOnboardingModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadClients();
          }}
        />
      )}
    </div>
  );
};

// Client Onboarding Modal Component
const ClientOnboardingModal = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    
    // Physical Stats
    height: '',
    weight: '',
    bodyfat: '',
    
    // Goals & Background
    goals: '',
    medical_history: '',
    injuries: '',
    lifestyle: '',
    
    // Fitness Background
    workout_history: '',
    workout_frequency: '',
    workout_preference: '',
    workout_availability: '',
    
    // Lifestyle
    hours_sleep: '',
    stress_level: '',
    hydration_level: '',
    nutrition_habits: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { title: 'Basic Information', icon: Users },
    { title: 'Physical Stats', icon: TrendingUp },
    { title: 'Goals & Health', icon: Settings },
    { title: 'Fitness Background', icon: Calendar }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await ApiClient.createClient(formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              <div>
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label>Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age in years"
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="form-step">
            <h3>Physical Statistics</h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                />
              </div>
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label>Body Fat Percentage (optional)</label>
                <input
                  type="number"
                  value={formData.bodyfat}
                  onChange={(e) => handleInputChange('bodyfat', e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="form-step">
            <h3>Goals & Health Information</h3>
            <div className="form-grid" style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label>Primary Goals</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="Weight loss, muscle gain, strength improvement, etc."
                  rows="3"
                />
              </div>
              <div>
                <label>Medical History</label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => handleInputChange('medical_history', e.target.value)}
                  placeholder="Any relevant medical conditions or history"
                  rows="3"
                />
              </div>
              <div>
                <label>Current Injuries or Limitations</label>
                <textarea
                  value={formData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  placeholder="Current injuries, past injuries, or physical limitations"
                  rows="3"
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="form-step">
            <h3>Fitness & Lifestyle</h3>
            <div className="form-grid" style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label>Workout History</label>
                <textarea
                  value={formData.workout_history}
                  onChange={(e) => handleInputChange('workout_history', e.target.value)}
                  placeholder="Previous training experience, favorite exercises, etc."
                  rows="2"
                />
              </div>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Workout Frequency (per week)</label>
                  <input
                    type="number"
                    value={formData.workout_frequency}
                    onChange={(e) => handleInputChange('workout_frequency', e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label>Sleep Hours (per night)</label>
                  <input
                    type="number"
                    value={formData.hours_sleep}
                    onChange={(e) => handleInputChange('hours_sleep', e.target.value)}
                    placeholder="8"
                  />
                </div>
              </div>
              <div>
                <label>Workout Preferences</label>
                <textarea
                  value={formData.workout_preference}
                  onChange={(e) => handleInputChange('workout_preference', e.target.value)}
                  placeholder="Gym, home workouts, outdoor activities, specific equipment preferences"
                  rows="2"
                />
              </div>
              <div>
                <label>Availability</label>
                <textarea
                  value={formData.workout_availability}
                  onChange={(e) => handleInputChange('workout_availability', e.target.value)}
                  placeholder="Available days and times for workouts"
                  rows="2"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Add New Client</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator" style={{ display: 'flex', marginBottom: '32px' }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={stepNumber} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#e5e7eb',
                  color: isCompleted || isActive ? 'white' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}>
                  {stepNumber}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: isActive ? '#3b82f6' : '#6b7280' }}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={{ 
                    width: '40px', 
                    height: '2px', 
                    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
                    margin: '0 16px'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="modal-content">
          {renderStep()}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <button 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button 
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary"
              disabled={currentStep === 1 && (!formData.name || !formData.email)}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email}
              className="btn-primary"
            >
              {isSubmitting ? 'Creating Client...' : 'Create Client'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
