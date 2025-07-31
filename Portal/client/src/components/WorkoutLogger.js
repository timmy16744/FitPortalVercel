import React, { useState, useEffect } from 'react';
import ClientAPI from '../utils/api';

const WorkoutLogger = ({ clientId }) => {
  const [workoutData, setWorkoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceLog, setPerformanceLog] = useState({});
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (clientId) {
      loadWorkoutData();
    }
  }, [clientId]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && elapsedTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, elapsedTime]);

  const loadWorkoutData = async () => {
    try {
      setIsLoading(true);
      const data = await ClientAPI.getClientActiveProgram(clientId);
      setWorkoutData(data);
      
      // Load any saved workout session
      const session = await ClientAPI.getWorkoutSession(clientId);
      if (session && session.session) {
        const sessionData = session.session.workout_data;
        setPerformanceLog(sessionData.performanceLog || {});
        setExerciseNotes(sessionData.exerciseNotes || {});
        setElapsedTime(sessionData.elapsedTime || 0);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load workout data');
      console.error('Error loading workout data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setStartTime(Date.now() - (elapsedTime * 1000));
      setIsTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  const saveProgress = async () => {
    try {
      const sessionData = {
        performanceLog,
        exerciseNotes,
        elapsedTime
      };
      await ClientAPI.saveWorkoutProgress(clientId, sessionData);
      alert('Workout progress saved!');
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Failed to save progress');
    }
  };

  const completeWorkout = async () => {
    try {
      if (!workoutData || !workoutData.assignmentId) {
        throw new Error('No active workout assignment found');
      }

      const workoutLogData = {
        assignment_id: workoutData.assignmentId,
        day_index_completed: workoutData.currentDayIndex || 0,
        performanceLog,
        exerciseNotes,
        elapsedTime
      };

      await ClientAPI.logWorkout(clientId, workoutLogData);
      
      // Clear the saved session
      await ClientAPI.clearWorkoutSession(clientId);
      
      alert('Workout completed successfully!');
      loadWorkoutData(); // Reload to get fresh data
    } catch (err) {
      console.error('Error completing workout:', err);
      alert('Failed to complete workout');
    }
  };

  const updateSet = (exerciseId, setIndex, field, value) => {
    setPerformanceLog(prev => {
      const exerciseSets = prev[exerciseId] || [];
      const updatedSets = [...exerciseSets];
      
      if (!updatedSets[setIndex]) {
        updatedSets[setIndex] = { completed: false };
      }
      
      updatedSets[setIndex][field] = value;
      return {
        ...prev,
        [exerciseId]: updatedSets
      };
    });
  };

  const toggleSetCompletion = (exerciseId, setIndex) => {
    setPerformanceLog(prev => {
      const exerciseSets = prev[exerciseId] || [];
      const updatedSets = [...exerciseSets];
      
      if (!updatedSets[setIndex]) {
        updatedSets[setIndex] = { completed: false };
      }
      
      updatedSets[setIndex].completed = !updatedSets[setIndex].completed;
      return {
        ...prev,
        [exerciseId]: updatedSets
      };
    });
  };

  const updateNotes = (exerciseId, notes) => {
    setExerciseNotes(prev => ({
      ...prev,
      [exerciseId]: notes
    }));
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
          <p style={{ marginTop: '1rem' }}>Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Today's Workout</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#e74c3c' }}>{error}</p>
          <button 
            onClick={loadWorkoutData}
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

  if (!workoutData || !workoutData.workout || workoutData.workout.id === 'default-empty') {
    return (
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">Today's Workout</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No workout assigned for today.</p>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Check back later or contact your trainer.</p>
        </div>
      </div>
    );
  }

  const { workout } = workoutData;
  const currentDay = workout.days[workoutData.currentDayIndex] || workout.days[0];

  return (
    <div>
      <div className="dashboard-card">
        <div className="card-header">
          <h2 className="card-title">{workout.templateName} - {currentDay?.name || 'Day 1'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              ⏱️ {formatTime(elapsedTime)}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isTimerRunning ? (
                <button 
                  onClick={startTimer}
                  style={{ 
                    background: '#27ae60', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Start
                </button>
              ) : (
                <button 
                  onClick={pauseTimer}
                  style={{ 
                    background: '#f39c12', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}
                >
                  Pause
                </button>
              )}
              <button 
                onClick={resetTimer}
                style={{ 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Workout Progress</strong>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
                Day {workoutData.currentDayIndex + 1} of {workout.days.length}
              </p>
            </div>
            <button 
              onClick={saveProgress}
              style={{ 
                background: '#3498db', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Save Progress
            </button>
          </div>
        </div>
      </div>

      {currentDay?.groups?.map((group, groupIndex) => (
        <div key={groupIndex} className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">{group.name || `Group ${groupIndex + 1}`}</h3>
          </div>
          
          {group.exercises?.map((exercise, exerciseIndex) => {
            const exerciseId = exercise.id || `exercise-${groupIndex}-${exerciseIndex}`;
            const sets = performanceLog[exerciseId] || exercise.sets || [{ reps: '', weight: '', completed: false }];
            const notes = exerciseNotes[exerciseId] || '';

            return (
              <div key={exerciseIndex} className="exercise-item">
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {exercise.name || 'Unnamed Exercise'}
                  </h4>
                  {exercise.instructions && (
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#666' }}>
                      {exercise.instructions}
                    </p>
                  )}
                </div>

                {/* Sets */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <div className="set-label">Set</div>
                    <div className="set-label">Reps</div>
                    <div className="set-label">Weight</div>
                    <div className="set-label">Action</div>
                  </div>
                  
                  {sets.map((set, setIndex) => (
                    <div key={setIndex} className="set-item">
                      <div className="set-label">{setIndex + 1}</div>
                      <input
                        type="number"
                        className="set-input"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) => updateSet(exerciseId, setIndex, 'reps', e.target.value)}
                      />
                      <input
                        type="number"
                        className="set-input"
                        placeholder="Weight"
                        value={set.weight}
                        onChange={(e) => updateSet(exerciseId, setIndex, 'weight', e.target.value)}
                      />
                      <button
                        className={`complete-button ${set.completed ? 'completed' : ''}`}
                        onClick={() => toggleSetCompletion(exerciseId, setIndex)}
                      >
                        {set.completed ? '✓' : 'Complete'}
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => {
                      setPerformanceLog(prev => ({
                        ...prev,
                        [exerciseId]: [...(prev[exerciseId] || []), { reps: '', weight: '', completed: false }]
                      }));
                    }}
                    style={{ 
                      background: 'none', 
                      border: '1px dashed #ddd', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      color: '#666',
                      marginTop: '0.5rem'
                    }}
                  >
                    + Add Set
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Notes:
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => updateNotes(exerciseId, e.target.value)}
                    placeholder="How did this exercise feel? Any notes for your trainer?"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '60px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="dashboard-card" style={{ textAlign: 'center' }}>
        <button
          onClick={completeWorkout}
          style={{
            background: '#27ae60',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#219a52'}
          onMouseOut={(e) => e.target.style.background = '#27ae60'}
        >
          🏁 Complete Workout
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          This will save your workout and notify your trainer
        </p>
      </div>
    </div>
  );
};

export default WorkoutLogger;
