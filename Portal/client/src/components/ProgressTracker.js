import React, { useState, useEffect } from 'react';
import ClientAPI from '../utils/api';

const ProgressTracker = ({ clientId }) => {
  const [bodyStats, setBodyStats] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [showAddStatForm, setShowAddStatForm] = useState(false);
  const [newStat, setNewStat] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: ''
  });

  useEffect(() => {
    if (clientId) {
      loadProgressData();
    }
  }, [clientId]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      
      // Load all progress data in parallel
      const [
        statsData,
        recordsData,
        achievementsData,
        historyData
      ] = await Promise.all([
        ClientAPI.getBodyStats(clientId).catch(() => []),
        ClientAPI.getPersonalRecords(clientId).catch(() => []),
        ClientAPI.getAchievements(clientId).catch(() => []),
        ClientAPI.getWorkoutHistory(clientId).catch(() => [])
      ]);

      setBodyStats(statsData || []);
      setPersonalRecords(recordsData || []);
      setAchievements(achievementsData || []);
      setWorkoutHistory(historyData || []);
      
      setError(null);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error loading progress data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStat = async (e) => {
    e.preventDefault();
    
    try {
      const statData = {
        date: newStat.date,
        weight: parseFloat(newStat.weight) || null,
        measurements: {
          chest: parseFloat(newStat.chest) || null,
          waist: parseFloat(newStat.waist) || null,
          hips: parseFloat(newStat.hips) || null,
          arms: parseFloat(newStat.arms) || null,
          thighs: parseFloat(newStat.thighs) || null
        }
      };
      
      await ClientAPI.addBodyStat(clientId, statData);
      
      // Reset form
      setNewStat({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: ''
      });
      setShowAddStatForm(false);
      
      // Reload data
      loadProgressData();
    } catch (err) {
      console.error('Error adding body stat:', err);
      alert('Failed to add body stat');
    }
  };

  const formatMeasurement = (value) => {
    return value ? `${value} cm` : 'N/A';
  };

  const formatWeight = (value) => {
    return value ? `${value} kg` : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="dashboard-card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '1rem' }}>Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Progress Tracking</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#e74c3c' }}>{error}</p>
          <button 
            onClick={loadProgressData}
            style={{ 
              background: '#667eea', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'Body Stats', icon: '📏' },
    { id: 'records', label: 'Records', icon: '🏆' },
    { id: 'achievements', label: 'Achievements', icon: '⭐' },
    { id: 'history', label: 'History', icon: '📅' }
  ];

  const renderStatsTab = () => (
    <div>
      <div className="dashboard-card" style={{ textAlign: 'center' }}>
        <button
          onClick={() => setShowAddStatForm(!showAddStatForm)}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          {showAddStatForm ? 'Cancel' : '➕ Add Measurement'}
        </button>
      </div>

      {showAddStatForm && (
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Add Body Measurement</h2>
          </div>
          <form onSubmit={handleAddStat}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newStat.date}
                  onChange={(e) => setNewStat({ ...newStat, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.weight}
                  onChange={(e) => setNewStat({ ...newStat, weight: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Chest (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.chest}
                  onChange={(e) => setNewStat({ ...newStat, chest: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Waist (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.waist}
                  onChange={(e) => setNewStat({ ...newStat, waist: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Hips (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.hips}
                  onChange={(e) => setNewStat({ ...newStat, hips: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Arms (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.arms}
                  onChange={(e) => setNewStat({ ...newStat, arms: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Thighs (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newStat.thighs}
                  onChange={(e) => setNewStat({ ...newStat, thighs: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              Add Measurement
            </button>
          </form>
        </div>
      )}

      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Body Measurements History</h2>
        </div>
        
        {bodyStats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No body measurements recorded yet.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Click "Add Measurement" to start tracking your progress.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '600' }}>Date</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Weight</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Chest</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Waist</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Hips</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Arms</th>
                  <th style={{ textAlign: 'center', padding: '1rem', fontWeight: '600' }}>Thighs</th>
                </tr>
              </thead>
              <tbody>
                {bodyStats.map((stat, index) => (
                  <tr 
                    key={stat.id} 
                    style={{ 
                      borderBottom: index < bodyStats.length - 1 ? '1px solid #f0f0f0' : 'none',
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      {new Date(stat.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatWeight(stat.weight)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatMeasurement(stat.measurements?.chest)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatMeasurement(stat.measurements?.waist)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatMeasurement(stat.measurements?.hips)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatMeasurement(stat.measurements?.arms)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {formatMeasurement(stat.measurements?.thighs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderRecordsTab = () => (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Personal Records</h2>
      </div>
      
      {personalRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No personal records yet.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Complete workouts to start setting personal records!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {personalRecords.map((record, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '1rem', 
                border: '1px solid #eee', 
                borderRadius: '8px', 
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Exercise #{record.exercise_id}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', margin: '0.5rem 0' }}>
                {record.weight}kg × {record.reps}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                1RM: {record.one_rm}kg
              </div>
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                Achieved: {new Date(record.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Achievements</h2>
      </div>
      
      {achievements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No achievements earned yet.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Keep working out to earn achievements!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '1.5rem', 
                border: '1px solid #eee', 
                borderRadius: '8px', 
                backgroundColor: '#fafafa',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {achievement.icon || '🏆'}
              </div>
              <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                {achievement.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                {achievement.description}
              </div>
              {achievement.date_earned && (
                <div style={{ fontSize: '0.75rem', color: '#999' }}>
                  Earned: {new Date(achievement.date_earned).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="dashboard-card">
      <div className="card-header">
        <h2 className="card-title">Workout History</h2>
      </div>
      
      {workoutHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p>No workout history yet.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Complete workouts to build your history!
          </p>
        </div>
      ) : (
        <div>
          {workoutHistory.map((workout, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '1rem', 
                borderBottom: index < workoutHistory.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>
                    Day {workout.day_index_completed + 1}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {new Date(workout.actual_date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {workout.performance_data?.elapsedTime ? 
                      `${Math.round(workout.performance_data.elapsedTime / 60)} min` : 
                      'Duration unknown'
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats': return renderStatsTab();
      case 'records': return renderRecordsTab();
      case 'achievements': return renderAchievementsTab();
      case 'history': return renderHistoryTab();
      default: return renderStatsTab();
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        borderBottom: '2px solid #eee',
        paddingBottom: '1rem'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === tab.id ? '#667eea' : '#f8f9fa',
              color: activeTab === tab.id ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ProgressTracker;
