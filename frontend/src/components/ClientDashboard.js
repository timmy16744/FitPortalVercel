import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, TrendingUp, MessageCircle, Dumbbell, 
  Target, Clock, Camera, Plus, Award, Activity,
  Heart, Zap, BarChart3, Users, Settings, Edit, Save, X
} from 'lucide-react';
import ApiClient from '../utils/api';
import { getClientAvatarColor, formatDuration } from '../utils/exerciseUtils';

const ClientDashboard = ({ clientId: propClientId, onBack }) => {
  const { clientId: paramClientId } = useParams();
  const navigate = useNavigate();
  const clientId = propClientId || paramClientId;
  
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [bodyStats, setBodyStats] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);

  useEffect(() => {
    if (clientId) {
      loadClientData();
    }
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      
      // Load all client data in parallel
      const [
        clientData,
        workoutData,
        nutritionData,
        bodyStatsData,
        achievementsData,
        messagesData,
        recordsData
      ] = await Promise.all([
        ApiClient.getClient(clientId),
        ApiClient.getWorkoutHistory(clientId).catch(() => []),
        ApiClient.getNutritionLogs(clientId).catch(() => []),
        ApiClient.getBodyStats(clientId).catch(() => []),
        ApiClient.getAchievements(clientId).catch(() => []),
        ApiClient.getMessages(clientId).catch(() => []),
        ApiClient.getPersonalRecords(clientId).catch(() => [])
      ]);

      setClient(clientData);
      setWorkoutHistory(workoutData);
      setNutritionLogs(nutritionData);
      setBodyStats(bodyStatsData);
      setAchievements(achievementsData);
      setMessages(messagesData);
      setPersonalRecords(recordsData);
    } catch (error) {
      console.error('Failed to load client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/clients');
    }
  };

  if (isLoading) {
    return (
      <div className="projects-section">
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
          <p>Loading client dashboard...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="projects-section">
        <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Client not found</h3>
          <p>The requested client could not be found.</p>
          <button onClick={handleBack} className="btn-primary">
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'nutrition', label: 'Nutrition', icon: Target },
    { id: 'messages', label: 'Messages', icon: MessageCircle }
  ];

  const renderOverview = () => (
    <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* Client Info Card */}
      <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
        <div className="client-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            className="client-avatar-large"
            style={{ 
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: getClientAvatarColor(client.name).replace('bg-', ''),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              marginRight: '16px'
            }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px 0' }}>{client.name}</h2>
            <p style={{ margin: '0', color: '#6b7280' }}>{client.email}</p>
            {client.phone && (
              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>{client.phone}</p>
            )}
          </div>
        </div>
        
        <div className="client-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="stat-item">
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Age</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>{client.age || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Gender</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>{client.gender || 'N/A'}</div>
          </div>
          <div className="stat-item">
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Height</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {client.height ? `${client.height} cm` : 'N/A'}
            </div>
          </div>
          <div className="stat-item">
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Weight</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {client.weight ? `${client.weight} kg` : 'N/A'}
            </div>
          </div>
        </div>
        
        {client.goals && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Goals</h4>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>{client.goals}</p>
          </div>
        )}
      </div>

      {/* Workout Summary */}
      <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Dumbbell size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
          <h3 style={{ margin: 0 }}>Workout Summary</h3>
        </div>
        
        <div className="workout-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div className="stat-card" style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {workoutHistory.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Workouts</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
              {workoutHistory.filter(w => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(w.actual_date) > weekAgo;
              }).length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>This Week</div>
          </div>
        </div>
        
        <div className="recent-workouts">
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>Recent Workouts</h4>
          {workoutHistory.slice(0, 3).map((workout, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < 2 ? '1px solid #f3f4f6' : 'none'
            }}>
              <span style={{ fontSize: '14px' }}>Day {workout.day_index_completed + 1}</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {new Date(workout.actual_date).toLocaleDateString()}
              </span>
            </div>
          ))}
          {workoutHistory.length === 0 && (
            <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: '16px 0' }}>
              No workouts completed yet
            </p>
          )}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <TrendingUp size={20} style={{ marginRight: '8px', color: '#10b981' }} />
          <h3 style={{ margin: 0 }}>Progress Tracking</h3>
        </div>
        
        {bodyStats.length > 0 ? (
          <div className="progress-stats">
            {bodyStats.slice(-5).map((stat, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none'
              }}>
                <span style={{ fontSize: '14px' }}>
                  {new Date(stat.date).toLocaleDateString()}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  {stat.weight} kg
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <TrendingUp size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>No progress data yet</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Award size={20} style={{ marginRight: '8px', color: '#f59e0b' }} />
          <h3 style={{ margin: 0 }}>Recent Achievements</h3>
        </div>
        
        {achievements.length > 0 ? (
          <div className="achievements-list">
            {achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < 2 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{ fontSize: '20px', marginRight: '12px' }}>
                  {achievement.icon || '🏆'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Award size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>No achievements yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="workouts-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Workout History</h3>
        <button className="btn-primary">
          <Plus size={16} style={{ marginRight: '8px' }} />
          Assign Workout
        </button>
      </div>
      
      {workoutHistory.length > 0 ? (
        <div className="workouts-grid" style={{ display: 'grid', gap: '16px' }}>
          {workoutHistory.map((workout, index) => (
            <div key={index} className="project-box" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Day {workout.day_index_completed + 1}</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    {new Date(workout.actual_date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#dcfce7', 
                  color: '#16a34a', 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Completed
                </div>
              </div>
              
              {workout.performance_data && (
                <div className="workout-details">
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    Duration: {Math.round((workout.performance_data.elapsedTime || 0) / 60)} minutes
                  </p>
                  {workout.performance_data.exerciseNotes && (
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                      Notes: {Object.values(workout.performance_data.exerciseNotes).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Dumbbell size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
          <h3>No workouts completed</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            This client hasn't completed any workouts yet.
          </p>
          <button className="btn-primary">
            <Plus size={16} style={{ marginRight: '8px' }} />
            Assign First Workout
          </button>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="progress-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Progress Tracking</h3>
        <button className="btn-primary">
          <Plus size={16} style={{ marginRight: '8px' }} />
          Add Measurement
        </button>
      </div>
      
      <div className="progress-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Body Stats */}
        <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Body Statistics</h4>
          {bodyStats.length > 0 ? (
            <div className="body-stats-list">
              {bodyStats.slice(-10).map((stat, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 9 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: '14px' }}>
                    {new Date(stat.date).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {stat.weight} kg
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>No body stats recorded yet</p>
          )}
        </div>

        {/* Personal Records */}
        <div className="project-box" style={{ backgroundColor: '#ffffff', padding: '24px' }}>
          <h4 style={{ margin: '0 0 16px 0' }}>Personal Records</h4>
          {personalRecords.length > 0 ? (
            <div className="records-list">
              {personalRecords.slice(0, 5).map((record, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <span style={{ fontSize: '14px' }}>Exercise #{record.exercise_id}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {record.weight}kg × {record.reps}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>No personal records yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="nutrition-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Nutrition Tracking</h3>
        <button className="btn-primary">
          <Plus size={16} style={{ marginRight: '8px' }} />
          Add Food Log
        </button>
      </div>
      
      {nutritionLogs.length > 0 ? (
        <div className="nutrition-grid" style={{ display: 'grid', gap: '16px' }}>
          {nutritionLogs.slice(0, 10).map((log, index) => (
            <div key={index} className="project-box" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{log.food_item}</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    {new Date(log.log_date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {log.calories || log.macros?.calories || 0} cal
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    P: {log.protein || log.macros?.protein || 0}g | 
                    C: {log.carbs || log.macros?.carbs || 0}g | 
                    F: {log.fat || log.macros?.fat || 0}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Target size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
          <h3>No nutrition logs</h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            This client hasn't logged any meals yet.
          </p>
          <button className="btn-primary">
            <Plus size={16} style={{ marginRight: '8px' }} />
            Add First Meal Log
          </button>
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="messages-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Messages</h3>
      </div>
      
      <div className="messages-container" style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px',
        maxHeight: '500px',
        overflow: 'auto',
        padding: '20px'
      }}>
        {messages.length > 0 ? (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div key={index} style={{ 
                marginBottom: '16px',
                display: 'flex',
                justifyContent: message.sender_type === 'trainer' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  backgroundColor: message.sender_type === 'trainer' ? '#3b82f6' : '#f3f4f6',
                  color: message.sender_type === 'trainer' ? 'white' : '#1f2937',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  maxWidth: '70%'
                }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>{message.text}</p>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7, 
                    marginTop: '4px' 
                  }}>
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
            <MessageCircle size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
            <h3>No messages</h3>
            <p style={{ color: '#6b7280' }}>Start a conversation with {client.name}</p>
          </div>
        )}
        
        {/* Message Input */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '16px', 
          marginTop: '16px',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button className="btn-primary" style={{ padding: '8px 16px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'workouts': return renderWorkouts();
      case 'progress': return renderProgress();
      case 'nutrition': return renderNutrition();
      case 'messages': return renderMessages();
      default: return renderOverview();
    }
  };

  return (
    <div className="projects-section">
      {/* Header */}
      <div className="projects-section-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={handleBack}
            style={{ 
              background: 'none', 
              border: 'none', 
              marginRight: '16px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>{client.name}</p>
            <p className="time" style={{ margin: 0 }}>Client Dashboard</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container" style={{ 
        borderBottom: '1px solid #e5e7eb', 
        marginBottom: '24px',
        display: 'flex',
        gap: '0'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ClientDashboard; 