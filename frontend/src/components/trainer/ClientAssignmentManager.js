import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Settings, Eye, EyeOff, Calendar, 
  Target, CheckCircle, Clock, ArrowRight, Save, X, Edit3
} from 'lucide-react';
import ApiClient from '../../utils/api';

const ClientAssignmentManager = () => {
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [customizationMode, setCustomizationMode] = useState(false);
  
  // Assignment customization state
  const [assignmentData, setAssignmentData] = useState({
    template_id: '',
    custom_name: '',
    enabled_days: [],
    day_customizations: {},
    notes: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDays, setTemplateDays] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [clientsData, templatesData] = await Promise.all([
        ApiClient.getClients(),
        ApiClient.getWorkoutTemplates()
      ]);
      
      setClients(clientsData || []);
      setTemplates(templatesData || []);
      
      // Fetch assignments for each client
      const assignmentPromises = clientsData.map(async (client) => {
        try {
          const assignment = await ApiClient.request(`/clients/${client.id}/workout-assignment`, 'GET');
          return { clientId: client.id, assignment };
        } catch (error) {
          return { clientId: client.id, assignment: null };
        }
      });
      
      const assignmentResults = await Promise.all(assignmentPromises);
      const assignmentsMap = {};
      assignmentResults.forEach(({ clientId, assignment }) => {
        assignmentsMap[clientId] = assignment;
      });
      setAssignments(assignmentsMap);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const startAssignment = (client) => {
    setSelectedClient(client);
    
    // Check if client has existing assignment
    const existingAssignment = assignments[client.id];
    if (existingAssignment) {
      setAssignmentData({
        template_id: existingAssignment.template_id,
        custom_name: existingAssignment.custom_name || '',
        enabled_days: existingAssignment.enabled_days || [],
        day_customizations: existingAssignment.day_customizations || {},
        notes: existingAssignment.notes || ''
      });
      
      const template = templates.find(t => t.id === existingAssignment.template_id);
      if (template) {
        setSelectedTemplate(template);
        loadTemplateDays(template);
      }
    } else {
      setAssignmentData({
        template_id: '',
        custom_name: '',
        enabled_days: [],
        day_customizations: {},
        notes: ''
      });
      setSelectedTemplate(null);
      setTemplateDays([]);
    }
    
    setShowAssignModal(true);
    setCustomizationMode(!!existingAssignment);
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setAssignmentData(prev => ({
      ...prev,
      template_id: template.id,
      custom_name: prev.custom_name || `${selectedClient.name}'s ${template.name}`
    }));
    loadTemplateDays(template);
    setCustomizationMode(true);
  };

  const loadTemplateDays = (template) => {
    try {
      const days = typeof template.days === 'string' ? JSON.parse(template.days) : template.days;
      setTemplateDays(days || []);
      
      // Initialize enabled_days if not set
      if (assignmentData.enabled_days.length === 0) {
        setAssignmentData(prev => ({
          ...prev,
          enabled_days: Array.from({ length: days.length }, (_, i) => i)
        }));
      }
    } catch (error) {
      console.error('Error parsing template days:', error);
      setTemplateDays([]);
    }
  };

  const toggleDay = (dayIndex) => {
    setAssignmentData(prev => {
      const enabled_days = [...prev.enabled_days];
      if (enabled_days.includes(dayIndex)) {
        // Remove day
        const newEnabledDays = enabled_days.filter(i => i !== dayIndex);
        return { ...prev, enabled_days: newEnabledDays };
      } else {
        // Add day
        const newEnabledDays = [...enabled_days, dayIndex].sort((a, b) => a - b);
        return { ...prev, enabled_days: newEnabledDays };
      }
    });
  };

  const updateDayCustomization = (dayIndex, field, value) => {
    setAssignmentData(prev => ({
      ...prev,
      day_customizations: {
        ...prev.day_customizations,
        [dayIndex]: {
          ...prev.day_customizations[dayIndex],
          [field]: value
        }
      }
    }));
  };

  const saveAssignment = async () => {
    try {
      const method = assignments[selectedClient.id] ? 'PUT' : 'POST';
      await ApiClient.request(`/clients/${selectedClient.id}/workout-assignment`, method, assignmentData);
      
      await fetchData(); // Refresh data
      setShowAssignModal(false);
      setSelectedClient(null);
      setCustomizationMode(false);
    } catch (error) {
      console.error('Error saving assignment:', error);
      setError('Failed to save assignment');
    }
  };

  const getDayTypeColor = (type) => {
    const colors = {
      'push': '#ef4444',
      'pull': '#3b82f6',
      'legs': '#10b981',
      'upper': '#8b5cf6',
      'lower': '#f59e0b',
      'full_body': '#6366f1',
      'cardio': '#ec4899',
      'rest': '#6b7280'
    };
    return colors[type] || '#6366f1';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary-color)', fontSize: '16px' }}>
          Loading client assignments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button onClick={fetchData} style={{
          padding: '8px 16px',
          backgroundColor: 'var(--button-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ 
            color: 'var(--main-color)', 
            fontSize: '24px', 
            fontWeight: '700', 
            margin: 0,
            marginBottom: '4px'
          }}>
            Client Assignment Manager
          </h1>
          <p style={{
            color: 'var(--secondary-color)',
            fontSize: '14px',
            margin: 0
          }}>
            Assign and customize workout templates for your clients
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { 
            label: 'Total Clients', 
            value: clients.length,
            icon: <Users size={20} />,
            color: '#6366f1'
          },
          { 
            label: 'Assigned', 
            value: Object.values(assignments).filter(a => a).length,
            icon: <CheckCircle size={20} />,
            color: '#10b981'
          },
          { 
            label: 'Unassigned', 
            value: clients.length - Object.values(assignments).filter(a => a).length,
            icon: <Clock size={20} />,
            color: '#f59e0b'
          },
          { 
            label: 'Templates', 
            value: templates.length,
            icon: <Target size={20} />,
            color: '#8b5cf6'
          }
        ].map((stat, index) => (
          <div key={index} style={{
            padding: '20px',
            backgroundColor: 'var(--projects-section)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: `${stat.color}15`,
              color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--main-color)',
                marginBottom: '2px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--secondary-color)'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {clients.map((client) => {
          const assignment = assignments[client.id];
          const template = assignment ? templates.find(t => t.id === assignment.template_id) : null;
          
          return (
            <div
              key={client.id}
              style={{
                backgroundColor: 'var(--projects-section)',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Client Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--main-color)',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    {client.name}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--secondary-color)',
                    margin: 0
                  }}>
                    {client.email}
                  </p>
                </div>
                
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: assignment ? '#10b98115' : '#f59e0b15',
                  color: assignment ? '#10b981' : '#f59e0b',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {assignment ? 'Assigned' : 'Unassigned'}
                </div>
              </div>

              {/* Assignment Details */}
              {assignment && template ? (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <Target size={14} style={{ color: 'var(--secondary-color)' }} />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--main-color)'
                    }}>
                      {assignment.custom_name || template.name}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'var(--secondary-color)',
                    marginBottom: '8px'
                  }}>
                    <Calendar size={12} />
                    <span>
                      {assignment.enabled_days.length} of {templateDays.length || JSON.parse(template.days || '[]').length} days enabled
                    </span>
                  </div>

                  {/* Day Preview */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {JSON.parse(template.days || '[]').map((day, index) => {
                      const isEnabled = assignment.enabled_days.includes(index);
                      return (
                        <div
                          key={index}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: isEnabled ? getDayTypeColor(day.type) : '#e5e7eb',
                            opacity: isEnabled ? 1 : 0.3,
                            fontSize: '10px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600'
                          }}
                          title={`${day.name} ${isEnabled ? '(Enabled)' : '(Disabled)'}`}
                        >
                          {index + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--search-area-bg)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <Target size={24} style={{ 
                    color: 'var(--secondary-color)', 
                    opacity: 0.5,
                    marginBottom: '8px'
                  }} />
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--secondary-color)',
                    margin: 0
                  }}>
                    No workout assigned
                  </p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => startAssignment(client)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: assignment ? 'transparent' : 'var(--button-bg)',
                    color: assignment ? 'var(--main-color)' : 'white',
                    border: assignment ? '1px solid var(--border-color)' : 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {assignment ? <Settings size={12} /> : <Plus size={12} />}
                  {assignment ? 'Customize' : 'Assign'}
                </button>
                
                {assignment && (
                  <button
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      color: 'var(--secondary-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="View Client Dashboard"
                  >
                    <Eye size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--main-color)',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {assignments[selectedClient?.id] ? 'Customize Assignment' : 'Assign Workout'}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--secondary-color)',
                  margin: 0
                }}>
                  {selectedClient?.name}
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--secondary-color)',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {!customizationMode ? (
                // Template Selection
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--main-color)',
                    marginBottom: '16px'
                  }}>
                    Choose a Template
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '16px'
                  }}>
                    {templates.map(template => {
                      const days = JSON.parse(template.days || '[]');
                      return (
                        <div
                          key={template.id}
                          onClick={() => selectTemplate(template)}
                          style={{
                            padding: '16px',
                            backgroundColor: 'var(--projects-section)',
                            borderRadius: '8px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#6366f1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                          }}
                        >
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--main-color)',
                            margin: '0 0 8px 0'
                          }}>
                            {template.name}
                          </h4>
                          
                          <p style={{
                            fontSize: '12px',
                            color: 'var(--secondary-color)',
                            margin: '0 0 12px 0',
                            lineHeight: '1.4'
                          }}>
                            {template.description || 'No description'}
                          </p>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: 'var(--secondary-color)'
                          }}>
                            <span>{days.length} days</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Customization Interface
                <div>
                  {/* Custom Name */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--main-color)',
                      marginBottom: '6px'
                    }}>
                      Custom Program Name
                    </label>
                    <input
                      type="text"
                      value={assignmentData.custom_name}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, custom_name: e.target.value }))}
                      placeholder={`${selectedClient?.name}'s Program`}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--search-area-bg)',
                        color: 'var(--main-color)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Day Selection */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--main-color)',
                      margin: '0 0 12px 0'
                    }}>
                      Customize Days
                    </h4>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--secondary-color)',
                      margin: '0 0 16px 0'
                    }}>
                      Enable or disable specific days for this client
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {templateDays.map((day, index) => {
                        const isEnabled = assignmentData.enabled_days.includes(index);
                        const customization = assignmentData.day_customizations[index] || {};
                        
                        return (
                          <div
                            key={index}
                            style={{
                              padding: '16px',
                              backgroundColor: isEnabled ? 'var(--search-area-bg)' : '#f9fafb',
                              borderRadius: '8px',
                              border: `1px solid ${isEnabled ? 'rgba(0, 0, 0, 0.05)' : '#e5e7eb'}`,
                              opacity: isEnabled ? 1 : 0.6,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: isEnabled ? '12px' : 0
                            }}>
                              <button
                                onClick={() => toggleDay(index)}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '4px',
                                  backgroundColor: isEnabled ? getDayTypeColor(day.type) : 'transparent',
                                  border: `2px solid ${isEnabled ? getDayTypeColor(day.type) : '#d1d5db'}`,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                              >
                                {isEnabled ? (index + 1) : ''}
                              </button>
                              
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <span style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: 'var(--main-color)'
                                  }}>
                                    {day.name}
                                  </span>
                                  <span style={{
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    backgroundColor: `${getDayTypeColor(day.type)}15`,
                                    color: getDayTypeColor(day.type),
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                  }}>
                                    {day.type?.replace('_', ' ')}
                                  </span>
                                </div>
                                <p style={{
                                  fontSize: '12px',
                                  color: 'var(--secondary-color)',
                                  margin: '2px 0 0 0'
                                }}>
                                  {day.description || 'No description'}
                                </p>
                              </div>
                              
                              <div style={{
                                fontSize: '11px',
                                color: 'var(--secondary-color)'
                              }}>
                                {day.exercises?.length || 0} exercises
                              </div>
                            </div>
                            
                            {/* Day Customization Options */}
                            {isEnabled && (
                              <div style={{
                                paddingLeft: '32px',
                                display: 'flex',
                                gap: '8px'
                              }}>
                                <input
                                  type="text"
                                  placeholder="Custom day name (optional)"
                                  value={customization.name || ''}
                                  onChange={(e) => updateDayCustomization(index, 'name', e.target.value)}
                                  style={{
                                    flex: 1,
                                    padding: '6px 8px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    backgroundColor: 'white',
                                    outline: 'none'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--main-color)',
                      marginBottom: '6px'
                    }}>
                      Notes for {selectedClient?.name}
                    </label>
                    <textarea
                      value={assignmentData.notes}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any specific instructions or notes for this client..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--search-area-bg)',
                        color: 'var(--main-color)',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Summary */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe',
                    marginBottom: '24px'
                  }}>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0369a1',
                      margin: '0 0 8px 0'
                    }}>
                      Assignment Summary
                    </h5>
                    <div style={{ fontSize: '13px', color: '#0c4a6e' }}>
                      <p style={{ margin: '0 0 4px 0' }}>
                        <strong>Template:</strong> {selectedTemplate?.name}
                      </p>
                      <p style={{ margin: '0 0 4px 0' }}>
                        <strong>Enabled Days:</strong> {assignmentData.enabled_days.length} of {templateDays.length}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Custom Name:</strong> {assignmentData.custom_name || 'None'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={saveAssignment}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        backgroundColor: 'var(--button-bg)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      <Save size={16} />
                      Save Assignment
                    </button>
                    <button
                      onClick={() => setCustomizationMode(false)}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#f8f9fa',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAssignmentManager;