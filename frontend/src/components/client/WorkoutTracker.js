import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Check, 
  X,
  ChevronRight,
  Clock,
  Target,
  Flame,
  TrendingUp,
  Edit2,
  Save,
  AlertCircle
} from 'lucide-react';
import './WorkoutTracker.css';

const WorkoutTracker = () => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [sets, setSets] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(90);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const intervalRef = useRef(null);
  const restIntervalRef = useRef(null);

  const sampleWorkouts = [
    {
      id: 1,
      name: "Upper Body Power",
      exercises: [
        { id: 1, name: "Bench Press", sets: 4, reps: "8-10", weight: 135, rest: 90 },
        { id: 2, name: "Pull Ups", sets: 4, reps: "8-12", weight: "BW", rest: 90 },
        { id: 3, name: "Shoulder Press", sets: 3, reps: "10-12", weight: 95, rest: 60 },
        { id: 4, name: "Barbell Rows", sets: 4, reps: "10-12", weight: 115, rest: 90 },
        { id: 5, name: "Bicep Curls", sets: 3, reps: "12-15", weight: 30, rest: 60 },
        { id: 6, name: "Tricep Dips", sets: 3, reps: "12-15", weight: "BW", rest: 60 }
      ],
      duration: "45 mins",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      name: "Leg Day",
      exercises: [
        { id: 1, name: "Squats", sets: 4, reps: "8-10", weight: 185, rest: 120 },
        { id: 2, name: "Romanian Deadlifts", sets: 4, reps: "10-12", weight: 135, rest: 90 },
        { id: 3, name: "Leg Press", sets: 3, reps: "12-15", weight: 270, rest: 90 },
        { id: 4, name: "Leg Curls", sets: 3, reps: "12-15", weight: 80, rest: 60 },
        { id: 5, name: "Calf Raises", sets: 4, reps: "15-20", weight: 135, rest: 60 }
      ],
      duration: "50 mins",
      difficulty: "Advanced"
    }
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning && !isResting) {
      intervalRef.current = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, isResting]);

  useEffect(() => {
    if (isResting && restTime > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [isResting, restTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = (workout) => {
    setSelectedWorkout(workout);
    setActiveWorkout(workout);
    setCurrentExercise(0);
    const initialSets = workout.exercises[0].sets;
    setSets(Array(initialSets).fill(null).map((_, index) => ({
      setNumber: index + 1,
      reps: null,
      weight: workout.exercises[0].weight,
      completed: false
    })));
    setWorkoutTime(0);
    setIsTimerRunning(true);
  };

  const completeSet = (setIndex) => {
    const newSets = [...sets];
    newSets[setIndex].completed = true;
    setSets(newSets);
    
    if (setIndex < sets.length - 1) {
      const restDur = activeWorkout.exercises[currentExercise].rest || 90;
      setRestDuration(restDur);
      setRestTime(restDur);
      setIsResting(true);
    }
  };

  const updateSetData = (setIndex, field, value) => {
    const newSets = [...sets];
    newSets[setIndex][field] = value;
    setSets(newSets);
  };

  const nextExercise = () => {
    if (currentExercise < activeWorkout.exercises.length - 1) {
      const nextEx = currentExercise + 1;
      setCurrentExercise(nextEx);
      const initialSets = activeWorkout.exercises[nextEx].sets;
      setSets(Array(initialSets).fill(null).map((_, index) => ({
        setNumber: index + 1,
        reps: null,
        weight: activeWorkout.exercises[nextEx].weight,
        completed: false
      })));
      setIsResting(false);
      setRestTime(0);
    }
  };

  const finishWorkout = () => {
    setIsTimerRunning(false);
    const completedWorkout = {
      ...activeWorkout,
      completedAt: new Date(),
      duration: workoutTime,
      totalSets: sets.filter(s => s.completed).length
    };
    setTodayWorkouts([...todayWorkouts, completedWorkout]);
    setActiveWorkout(null);
    setSelectedWorkout(null);
    setCurrentExercise(0);
    setSets([]);
    setWorkoutTime(0);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  if (!selectedWorkout) {
    return (
      <div className="workout-tracker">
        <div className="tracker-header">
          <h1>Today's Workouts</h1>
          <p className="subtitle">Choose a workout to get started</p>
        </div>

        <div className="workout-stats-summary">
          <div className="summary-stat">
            <Flame className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Calories</span>
            </div>
          </div>
          <div className="summary-stat">
            <Clock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Minutes</span>
            </div>
          </div>
          <div className="summary-stat">
            <Target className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">0</span>
              <span className="stat-label">Exercises</span>
            </div>
          </div>
        </div>

        <div className="available-workouts">
          <h2>Available Workouts</h2>
          {sampleWorkouts.map(workout => (
            <div key={workout.id} className="workout-card" onClick={() => startWorkout(workout)}>
              <div className="workout-info">
                <h3>{workout.name}</h3>
                <div className="workout-meta">
                  <span className="meta-item">
                    <Clock size={14} />
                    {workout.duration}
                  </span>
                  <span className="meta-item">{workout.exercises.length} exercises</span>
                  <span className={`difficulty ${workout.difficulty.toLowerCase()}`}>
                    {workout.difficulty}
                  </span>
                </div>
              </div>
              <ChevronRight className="workout-arrow" />
            </div>
          ))}
        </div>

        {todayWorkouts.length > 0 && (
          <div className="completed-workouts">
            <h2>Completed Today</h2>
            {todayWorkouts.map((workout, index) => (
              <div key={index} className="completed-card">
                <Check className="check-icon" />
                <div className="completed-info">
                  <h3>{workout.name}</h3>
                  <p>Duration: {formatTime(workout.duration)} • {workout.totalSets} sets completed</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentEx = activeWorkout.exercises[currentExercise];

  return (
    <div className="workout-tracker active">
      <div className="workout-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => setSelectedWorkout(null)}>
            <X size={20} />
          </button>
          <h2>{activeWorkout.name}</h2>
          <div className="workout-timer">
            <Clock size={16} />
            <span>{formatTime(workoutTime)}</span>
          </div>
        </div>
        
        <div className="exercise-progress">
          <div className="progress-info">
            <span>Exercise {currentExercise + 1} of {activeWorkout.exercises.length}</span>
            <span className="exercise-name">{currentEx.name}</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentExercise + 1) / activeWorkout.exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {isResting && (
        <div className="rest-timer-overlay">
          <div className="rest-content">
            <h2>Rest Time</h2>
            <div className="rest-countdown">{formatTime(restTime)}</div>
            <div className="rest-progress">
              <div 
                className="rest-progress-fill" 
                style={{ width: `${(restTime / restDuration) * 100}%` }}
              />
            </div>
            <button className="skip-rest-btn" onClick={skipRest}>
              Skip Rest
            </button>
            <p className="next-set-info">Next: Set {sets.filter(s => s.completed).length + 2} of {sets.length}</p>
          </div>
        </div>
      )}

      <div className="exercise-details">
        <div className="exercise-header">
          <h1>{currentEx.name}</h1>
          <div className="exercise-meta">
            <span>{currentEx.sets} sets</span>
            <span>•</span>
            <span>{currentEx.reps} reps</span>
            <span>•</span>
            <span>{currentEx.weight === "BW" ? "Bodyweight" : `${currentEx.weight} lbs`}</span>
          </div>
        </div>

        <div className="timer-controls">
          <button 
            className={`timer-btn ${isTimerRunning ? 'pause' : 'play'}`}
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        <div className="sets-tracker">
          <h3>Sets</h3>
          {sets.map((set, index) => (
            <div key={index} className={`set-row ${set.completed ? 'completed' : ''}`}>
              <div className="set-number">Set {set.setNumber}</div>
              
              <div className="set-inputs">
                <div className="input-group">
                  <label>Weight</label>
                  <div className="input-controls">
                    <button 
                      onClick={() => updateSetData(index, 'weight', Math.max(0, (set.weight || 0) - 5))}
                      disabled={set.completed}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={set.weight || ''} 
                      onChange={(e) => updateSetData(index, 'weight', parseInt(e.target.value) || 0)}
                      disabled={set.completed}
                    />
                    <button 
                      onClick={() => updateSetData(index, 'weight', (set.weight || 0) + 5)}
                      disabled={set.completed}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Reps</label>
                  <div className="input-controls">
                    <button 
                      onClick={() => updateSetData(index, 'reps', Math.max(0, (set.reps || 0) - 1))}
                      disabled={set.completed}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={set.reps || ''} 
                      onChange={(e) => updateSetData(index, 'reps', parseInt(e.target.value) || 0)}
                      disabled={set.completed}
                      placeholder={currentEx.reps}
                    />
                    <button 
                      onClick={() => updateSetData(index, 'reps', (set.reps || 0) + 1)}
                      disabled={set.completed}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                className={`complete-set-btn ${set.completed ? 'completed' : ''}`}
                onClick={() => completeSet(index)}
                disabled={set.completed || !set.reps}
              >
                <Check size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="exercise-actions">
          {currentExercise < activeWorkout.exercises.length - 1 ? (
            <button 
              className="next-exercise-btn"
              onClick={nextExercise}
              disabled={!sets.every(s => s.completed)}
            >
              Next Exercise
              <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              className="finish-workout-btn"
              onClick={finishWorkout}
              disabled={!sets.every(s => s.completed)}
            >
              Finish Workout
              <Check size={20} />
            </button>
          )}
        </div>

        <div className="previous-performance">
          <h3>Previous Performance</h3>
          <div className="performance-card">
            <AlertCircle size={16} className="info-icon" />
            <p>Last time: 4 sets • 135 lbs • 10, 10, 9, 8 reps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;