import React, { useState, useEffect } from 'react';
import ClientAPI from '../utils/api';

const NutritionTracker = ({ clientId }) => {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLog, setNewLog] = useState({
    food_item: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving_size: '',
    meal_type: 'other'
  });

  useEffect(() => {
    if (clientId) {
      loadNutritionData();
    }
  }, [clientId]);

  const loadNutritionData = async () => {
    try {
      setIsLoading(true);
      
      // Load today's nutrition logs
      const logs = await ClientAPI.getNutritionLogs(clientId);
      setNutritionLogs(logs || []);
      
      // Load nutrition goals
      const goalsData = await ClientAPI.getNutritionGoals(clientId);
      if (goalsData) {
        setGoals(goalsData);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load nutrition data');
      console.error('Error loading nutrition data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    
    try {
      const logData = {
        ...newLog,
        calories: parseFloat(newLog.calories) || 0,
        protein: parseFloat(newLog.protein) || 0,
        carbs: parseFloat(newLog.carbs) || 0,
        fat: parseFloat(newLog.fat) || 0
      };
      
      await ClientAPI.addNutritionLog(clientId, logData);
      setNewLog({
        food_item: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving_size: '',
        meal_type: 'other'
      });
      setShowAddForm(false);
      loadNutritionData(); // Reload to get updated data
    } catch (err) {
      console.error('Error adding nutrition log:', err);
      alert('Failed to add nutrition log');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this food entry?')) {
      try {
        await ClientAPI.deleteNutritionLog(clientId, logId);
        loadNutritionData(); // Reload to get updated data
      } catch (err) {
        console.error('Error deleting nutrition log:', err);
        alert('Failed to delete nutrition log');
      }
    }
  };

  const calculateTotals = () => {
    return nutritionLogs.reduce((totals, log) => {
      return {
        calories: totals.calories + (log.calories || 0),
        protein: totals.protein + (log.protein || 0),
        carbs: totals.carbs + (log.carbs || 0),
        fat: totals.fat + (log.fat || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotals();
  const progress = {
    calories: Math.min(100, (totals.calories / goals.calories) * 100),
    protein: Math.min(100, (totals.protein / goals.protein) * 100),
    carbs: Math.min(100, (totals.carbs / goals.carbs) * 100),
    fat: Math.min(100, (totals.fat / goals.fat) * 100)
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
          <p style={{ marginTop: '1rem' }}>Loading nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Nutrition Tracking</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#e74c3c' }}>{error}</p>
          <button 
            onClick={loadNutritionData}
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

  return (
    <div>
      {/* Nutrition Summary Cards */}
      <div className="nutrition-grid">
        <div className="nutrition-card">
          <div className="nutrition-label">Calories</div>
          <div className="nutrition-value">{totals.calories}</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            of {goals.calories} goal
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '3px', 
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: progress.calories > 100 ? '#e74c3c' : '#667eea',
              width: `${Math.min(100, progress.calories)}%`
            }}></div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="nutrition-label">Protein (g)</div>
          <div className="nutrition-value">{totals.protein}</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            of {goals.protein} goal
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '3px', 
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: progress.protein > 100 ? '#e74c3c' : '#27ae60',
              width: `${Math.min(100, progress.protein)}%`
            }}></div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="nutrition-label">Carbs (g)</div>
          <div className="nutrition-value">{totals.carbs}</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            of {goals.carbs} goal
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '3px', 
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: progress.carbs > 100 ? '#e74c3c' : '#f39c12',
              width: `${Math.min(100, progress.carbs)}%`
            }}></div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="nutrition-label">Fat (g)</div>
          <div className="nutrition-value">{totals.fat}</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            of {goals.fat} goal
          </div>
          <div style={{ 
            height: '6px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '3px', 
            marginTop: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: progress.fat > 100 ? '#e74c3c' : '#9b59b6',
              width: `${Math.min(100, progress.fat)}%`
            }}></div>
          </div>
        </div>
      </div>

      {/* Add Food Button */}
      <div className="dashboard-card" style={{ textAlign: 'center' }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
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
          {showAddForm ? 'Cancel' : '➕ Add Food'}
        </button>
      </div>

      {/* Add Food Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Add Food Entry</h2>
          </div>
          <form onSubmit={handleAddLog}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Food Item *
                </label>
                <input
                  type="text"
                  value={newLog.food_item}
                  onChange={(e) => setNewLog({ ...newLog, food_item: e.target.value })}
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
                  Meal Type
                </label>
                <select
                  value={newLog.meal_type}
                  onChange={(e) => setNewLog({ ...newLog, meal_type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Calories
                </label>
                <input
                  type="number"
                  value={newLog.calories}
                  onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
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
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={newLog.protein}
                  onChange={(e) => setNewLog({ ...newLog, protein: e.target.value })}
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
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={newLog.carbs}
                  onChange={(e) => setNewLog({ ...newLog, carbs: e.target.value })}
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
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={newLog.fat}
                  onChange={(e) => setNewLog({ ...newLog, fat: e.target.value })}
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Serving Size
              </label>
              <input
                type="text"
                value={newLog.serving_size}
                onChange={(e) => setNewLog({ ...newLog, serving_size: e.target.value })}
                placeholder="e.g., 1 cup, 100g, 1 slice"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
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
              Add Food Entry
            </button>
          </form>
        </div>
      )}

      {/* Food Entries List */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Today's Food Entries</h2>
        </div>
        
        {nutritionLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No food entries logged today.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Click "Add Food" to log your meals and snacks.
            </p>
          </div>
        ) : (
          <div>
            {nutritionLogs.map((log) => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  marginBottom: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                    {log.food_item}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {log.serving_size && `${log.serving_size} • `}
                    {log.meal_type?.charAt(0).toUpperCase() + log.meal_type?.slice(1) || 'Other'}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600' }}>
                    {log.calories || 0} cal
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    P:{log.protein || 0} C:{log.carbs || 0} F:{log.fat || 0}
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionTracker;
