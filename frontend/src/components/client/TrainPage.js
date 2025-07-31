import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, Dumbbell, X, Timer, Award, Check, ChevronsUpDown, ArrowLeft, Plus, Minus, Repeat, TrendingUp, Zap } from 'lucide-react';
import ApiClient from '../../utils/ApiClient';
import EmptyState from '../common/EmptyState';

const ExerciseCard = ({ exercise, progress, onSetChange, onSetComplete, open, onToggle }) => {
  const sets = Array.from({ length: exercise.sets });
  const completedCount = sets.filter((_, i) => progress?.[i]?.completed).length;

  return (
    <motion.div layout className="card-premium overflow-hidden">
      <motion.button layout onClick={onToggle} className="w-full flex justify-between items-center p-4">
        <div>
          <h3 className="font-bold text-lg text-heading text-left">{exercise.name}</h3>
          <p className="text-sm text-text-secondary text-left">{completedCount} / {exercise.sets} sets complete</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronsUpDown className="w-5 h-5 text-text-secondary" /></motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-5 bg-primary-bg px-4 py-2 font-semibold text-sm text-text-secondary">
              <span className="text-center col-span-1">Set</span>
              <span className="text-center col-span-2">Weight (kg)</span>
              <span className="text-center col-span-1">Reps</span>
              <span className="text-center col-span-1">Done</span>
            </div>
            {sets.map((_, setIndex) => {
              const setProgress = progress?.[setIndex] || { weight: '', reps: '', completed: false };
              return (
                <div key={setIndex} className={`grid grid-cols-5 gap-2 items-center px-4 py-3 ${setProgress.completed ? 'bg-success/10' : ''}`}>
                  <span className="font-bold text-center text-text-primary">{setIndex + 1}</span>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button onClick={() => onSetChange(setIndex, 'weight', Math.max(0, (Number(setProgress.weight) || 0) - 2.5))} className="p-1.5 rounded-full bg-border-light"><Minus className="w-4 h-4" /></button>
                    <input
                      type="number"
                      placeholder={exercise.weight || '--'}
                      value={setProgress.weight}
                      onChange={(e) => onSetChange(setIndex, 'weight', e.target.value)}
                      className="w-16 bg-transparent text-text-primary text-center font-semibold text-lg p-1 focus:outline-none"
                    />
                    <button onClick={() => onSetChange(setIndex, 'weight', (Number(setProgress.weight) || 0) + 2.5)} className="p-1.5 rounded-full bg-border-light"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="col-span-1 flex items-center justify-center gap-1">
                     <input
                      type="number"
                      placeholder={exercise.reps}
                      value={setProgress.reps}
                      onChange={(e) => onSetChange(setIndex, 'reps', e.target.value)}
                      className="w-12 bg-transparent text-text-primary text-center font-semibold text-lg p-1 focus:outline-none"
                    />
                  </div>
                  <button onClick={() => onSetComplete(setIndex)} className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${setProgress.completed ? 'bg-success text-white scale-110' : 'bg-border-light text-text-secondary'}`}>
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WorkoutSummary = ({ workout, progress, onRestart, onExit }) => {
  const totalVolume = Object.values(progress).flatMap(p => Object.values(p)).reduce((sum, set) => sum + (set.completed ? (Number(set.weight) || 0) * (Number(set.reps) || 0) : 0), 0);
  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets, 0);
  const completedSets = Object.values(progress).flatMap(p => Object.values(p)).filter(s => s.completed).length;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 text-center">
      <Award className="w-16 h-16 mx-auto text-brand-primary bg-brand-primary/10 p-3 rounded-full mb-4" />
      <h1 className="text-3xl font-bold text-display mb-2">Workout Complete!</h1>
      <p className="text-text-secondary mb-8">Fantastic session. Here's how you did:</p>
      <div className="grid grid-cols-2 gap-4 text-left mb-8">
        <div className="card p-4"><TrendingUp className="w-6 h-6 text-purple-500 mb-2" /><p className="text-sm text-text-secondary">Total Volume</p><p className="text-2xl font-bold text-heading">{totalVolume.toFixed(0)} kg</p></div>
        <div className="card p-4"><Zap className="w-6 h-6 text-green-500 mb-2" /><p className="text-sm text-text-secondary">Completed Sets</p><p className="text-2xl font-bold text-heading">{completedSets}/{totalSets}</p></div>
      </div>
      <div className="flex gap-4">
        <button onClick={onRestart} className="btn-secondary flex-1 flex items-center justify-center gap-2"><Repeat className="w-4 h-4"/><span>Train Again</span></button>
        <button onClick={onExit} className="btn-primary flex-1">Back to Hub</button>
      </div>
    </motion.div>
  );
};

const TrainPage = ({ client, sharedData, onDataUpdate, showNotification }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutProgress, setWorkoutProgress] = useState({});
  const [openExercise, setOpenExercise] = useState(null);
  const [workoutState, setWorkoutState] = useState('select'); // select, active, summary

  const { activeProgram, workoutHistory } = sharedData;

  const upcomingWorkouts = activeProgram?.workout_templates?.filter(
    w => !workoutHistory.some(h => h.template_id === w.id)
  ) || [];

  const handleStartWorkout = (workout) => {
    setActiveWorkout(workout);
    setOpenExercise(workout.exercises[0]?.id);
    setWorkoutProgress({});
    setWorkoutState('active');
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setWorkoutProgress(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setIndex]: { ...prev[exerciseId]?.[setIndex], [field]: value },
      },
    }));
  };

  const handleSetComplete = (exerciseId, setIndex) => {
    const currentProgress = workoutProgress[exerciseId]?.[setIndex] || {};
    setWorkoutProgress(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setIndex]: { ...currentProgress, completed: !currentProgress.completed },
      },
    }));
  };

  const finishWorkout = async () => {
    try {
      await ApiClient.logWorkout(client.id, {
        template_id: activeWorkout.id,
        performance_data: workoutProgress,
      });
      showNotification('Workout Logged!', 'Amazing work. Your progress has been saved.', 'success');
      onDataUpdate();
      setWorkoutState('summary');
    } catch (error) {
      showNotification('Log Failed', 'Could not save your workout. Please try again.', 'error');
    }
  };
  
  const resetAndExit = () => {
    setActiveWorkout(null);
    setWorkoutProgress({});
    setOpenExercise(null);
    setWorkoutState('select');
  }

  if (!activeProgram) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center p-6">
        <EmptyState 
          icon={Dumbbell} 
          title="No Active Program" 
          message="Your trainer hasn't assigned a training program to you yet. Please check back later."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={workoutState}
          initial={{ opacity: 0, x: workoutState === 'select' ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {workoutState === 'select' && (
            <div className="p-6 space-y-6">
              <h1 className="text-3xl font-bold text-display">Training Hub</h1>
              {!sharedData.activeProgram ? (
                <EmptyState 
                  icon={Clock} 
                  title="Your Plan is on its Way!" 
                  message="Your trainer is currently building your personalized workout schedule. It will appear here once it's ready."
                />
              ) : upcomingWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingWorkouts.map((workout, index) => (
                    <motion.button
                      key={workout.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => handleStartWorkout(workout)}
                      className="card-premium w-full text-left flex items-center justify-between group p-5"
                    >
                      <div>
                        <h2 className="font-bold text-xl text-heading group-hover:text-brand-primary transition-colors">{workout.name}</h2>
                        <p className="text-sm text-text-secondary">{workout.exercises.length} exercises &bull; Approx. {workout.est_duration_mins} mins</p>
                      </div>
                      <Dumbbell className="w-8 h-8 text-text-secondary/50 group-hover:text-brand-primary transition-colors" />
                    </motion.button>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Award} 
                  title="Program Complete!" 
                  message="You've crushed all your assigned workouts. Check back later for new challenges!"
                />
              )}
            </div>
          )}

          {workoutState === 'active' && activeWorkout && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setWorkoutState('select')} className="p-2 rounded-full hover:bg-border-light transition">
                  <ArrowLeft className="w-6 h-6 text-text-secondary" />
                </button>
                <h1 className="text-2xl font-bold text-display truncate px-4">{activeWorkout.name}</h1>
                <div className="w-10"></div>
              </div>
              <div className="space-y-3">
                {activeWorkout.exercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise} 
                    progress={workoutProgress[exercise.id]}
                    onSetChange={(setIndex, field, value) => handleSetChange(exercise.id, setIndex, field, value)}
                    onSetComplete={(setIndex) => handleSetComplete(exercise.id, setIndex)}
                    open={openExercise === exercise.id}
                    onToggle={() => setOpenExercise(openExercise === exercise.id ? null : exercise.id)}
                  />
                ))}
              </div>
              <motion.button
                onClick={finishWorkout}
                className="w-full mt-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                whileTap={{ scale: 0.98 }}
              >
                Finish & Log Workout
              </motion.button>
            </div>
          )}

          {workoutState === 'summary' && activeWorkout && (
            <WorkoutSummary 
              workout={activeWorkout}
              progress={workoutProgress}
              onRestart={() => handleStartWorkout(activeWorkout)}
              onExit={resetAndExit}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TrainPage;
