import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ClientManagement from './ClientManagement';
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutEditor from './WorkoutEditor';
import AdvancedSettingsPage from './trainer/AdvancedSettingsPage';

const TrainerMainContent = ({ renderDashboard }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={renderDashboard()} />
      <Route 
        path="/clients" 
        element={<ClientManagement onSelectClient={(id) => {
          localStorage.setItem('isTrainer', 'true');
          navigate(`/client/${id}`);
        }} />} 
      />
      <Route path="/exercises" element={<ExerciseLibrary />} />
      <Route path="/workouts" element={<WorkoutEditor onClose={() => navigate('/')} />} />
      <Route path="/settings" element={<AdvancedSettingsPage />} />
    </Routes>
  );
};

export default TrainerMainContent;
