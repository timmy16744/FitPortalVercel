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
      <div className="project-box" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div className="project-box-header">
          <div className="client-avatar">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getClientAvatarColor(client.name)}`}
              style={{ 
                backgroundColor: getClientAvatarColor(client.name).replace('bg-', ''),
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {client.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="more-wrapper">
            <button className="project-btn-more">
              <MoreVertical size={16} />
            </button>
            <div className="more-list" style={{ display: 'none' }}>
              <button onClick={() => onSelectClient(client.id)}>
                <Eye size={14} /> View Dashboard
              </button>
              <button onClick={() => console.log('Edit client', client.id)}>
                <Edit size={14} /> Edit Details
              </button>
              <button onClick={() => handleArchiveClient(client.id)}>
                <Archive size={14} /> {client.archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="project-box-content-header">
          <h3 className="box-content-header">{client.name}</h3>
          <p className="box-content-subheader">{client.email}</p>
        </div>

        <div className="client-stats" style={{ margin: '16px 0' }}>
          <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Workouts Completed</span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {client.workout_count || 0}
            </span>
          </div>
          <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Current Weight</span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {client.weight ? `${client.weight} kg` : 'Not set'}
            </span>
          </div>
          <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Goal</span>
            <span style={{ fontSize: '12px', fontWeight: '600' }}>
              {client.goals || 'Not set'}
            </span>
          </div>
        </div>

        <div className="project-box-footer">
          <div className="participants">
            <button 
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => onSelectClient(client.id)}
            >
              <Users size={14} style={{ marginRight: '4px' }} />
              View Client
            </button>
          </div>
          <div className="days-left" style={{ 
            backgroundColor: client.archived ? '#fee2e2' : '#dcfce7',
            color: client.archived ? '#dc2626' : '#16a34a',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            {client.archived ? 'Archived' : 'Active'}
          </div>
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
    <div className="projects-section">
      {/* Header */}
      <div className="projects-section-header">
        <div>
          <p>Client Management</p>
          <p className="time">Manage your fitness clients</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} />
            Add New Client
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="projects-section-line">
        <div className="projects-status">
          <div className="item-status">
            <span className="status-number">{stats.activeClients}</span>
            <span className="status-type">Active Clients</span>
          </div>
          <div className="item-status">
            <span className="status-number">{stats.totalClients}</span>
            <span className="status-type">Total Clients</span>
          </div>
          <div className="item-status">
            <span className="status-number">{stats.newThisWeek}</span>
            <span className="status-type">New This Week</span>
          </div>
        </div>
        
        <div className="view-actions">
          <button 
            className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`}
            title="List View"
            onClick={() => setViewMode('list')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button 
            className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`}
            title="Grid View"
            onClick={() => setViewMode('grid')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="client-filters" style={{ margin: '20px 0', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div className="search-wrapper" style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="active">Active Clients</option>
          <option value="archived">Archived Clients</option>
          <option value="all">All Clients</option>
        </select>
      </div>

      {/* Client Grid */}
      <div className={`project-boxes client-grid ${viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
            <Users size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
            <h3>No clients found</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
            </p>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
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