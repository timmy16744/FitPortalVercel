import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrainerDashboardHome from './TrainerDashboardHome';
import ClientManagement from './ClientManagement';
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutEditor from './WorkoutEditor';
import TrainerAnalytics from './TrainerAnalytics';
import TrainerMessages from './TrainerMessages';
import TrainerCalendar from './TrainerCalendar';

const TrainerMainContent = () => {
  // Set trainer flag for client dashboard access
  React.useEffect(() => {
    localStorage.setItem('isTrainer', 'true');
  }, []);

  return (
    <div className="h-full">
      <Routes>
        {/* Main Dashboard */}
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrainerDashboardHome />
            </motion.div>
          } 
        />
        
        {/* Analytics */}
        <Route 
          path="/analytics" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrainerAnalytics />
            </motion.div>
          } 
        />
        
        {/* Calendar */}
        <Route 
          path="/calendar" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrainerCalendar />
            </motion.div>
          } 
        />
        
        {/* Client Management */}
        <Route 
          path="/clients" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ClientManagement />
            </motion.div>
          } 
        />
        
        {/* Messages */}
        <Route 
          path="/messages" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrainerMessages />
            </motion.div>
          } 
        />
        
        {/* Exercise Library */}
        <Route 
          path="/exercises" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ExerciseLibrary />
            </motion.div>
          } 
        />
        
        {/* Workout Editor */}
        <Route 
          path="/workouts" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WorkoutEditor />
            </motion.div>
          } 
        />
      </Routes>
    </div>
  );
};

export default TrainerMainContent;
