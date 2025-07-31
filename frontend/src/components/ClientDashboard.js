import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Dumbbell, Apple, BarChart2, MessageSquare, Lock } from 'lucide-react';
import ApiClient from '../utils/api';

// Import the new page components
import HomePage from './client/HomePage';
import TrainPage from './client/TrainPage';
import FoodPage from './client/FoodPage';
import ProgressPage from './client/ProgressPage';
import ChatPage from './client/ChatPage';

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <motion.div
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: isActive ? '#4ECDC4' : '#aaa',
      cursor: 'pointer',
    }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={28} />
    <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{label}</span>
  </motion.div>
);

const PinScreen = ({ onPinSubmit }) => {
  const [pin, setPin] = useState('');

  const handleInput = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  useEffect(() => {
    if (pin.length === 4) {
      onPinSubmit(pin);
      setPin('');
    }
  }, [pin, onPinSubmit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Lock size={48} color="#4ECDC4" />
      <h2 style={{ marginTop: '1rem', color: '#333' }}>Enter PIN</h2>
      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: i < pin.length ? '#4ECDC4' : '#ccc' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '300px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <motion.button key={num} onClick={() => handleInput(num)} whileTap={{ scale: 0.95 }} style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', fontSize: '2rem', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{num}</motion.button>
        ))}
        <div />
        <motion.button onClick={() => handleInput(0)} whileTap={{ scale: 0.95 }} style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', fontSize: '2rem', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>0</motion.button>
        <motion.button onClick={handleDelete} whileTap={{ scale: 0.95 }} style={{ width: '70px', height: '70px', borderRadius: '50%', border: 'none', fontSize: '1.5rem', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>DEL</motion.button>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  const { clientId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('Home');
  const [clientData, setClientData] = useState({
    client: null,
    activeProgram: null,
    workoutHistory: [],
    nutritionGoals: { calories: 2000, protein: 150, carbs: 200, fat: 60 }, // Default goals
    nutritionLogsToday: [],
    bodyStats: [],
    progressPhotos: [],
    messages: [],
    analytics: null,
    assignedMeals: [],
    groups: [],
  });

  const loadClientData = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [client, program, history, nutritionLogs, stats, photos, messages, analytics, meals, groups] = await Promise.all([
        ApiClient.getClient(clientId),
        ApiClient.getActiveProgram(clientId),
        ApiClient.getWorkoutHistory(clientId),
        ApiClient.getNutritionLogs(clientId, today),
        ApiClient.getBodyStats(clientId),
        ApiClient.getProgressPhotos(clientId),
        ApiClient.getMessages(clientId),
        ApiClient.getClientAnalytics(clientId),
        ApiClient.getClientMealPlan(clientId),
        ApiClient.getClientGroups(clientId),
      ]);

      setClientData({
        client,
        activeProgram: program,
        workoutHistory: history,
        nutritionGoals: client.nutrition_goals || { calories: 2000, protein: 150, carbs: 200, fat: 60 },
        nutritionLogsToday: nutritionLogs,
        bodyStats: stats,
        progressPhotos: photos,
        messages,
        analytics: analytics || { workout_consistency: 0, diet_adherence: 0 },
        assignedMeals: meals || [],
        groups: groups || [],
      });

    } catch (error) {
      console.error("Failed to load client data:", error);
      // Handle error display to user
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  const handlePinSubmit = async (pin) => {
    // In a real app, you'd verify this PIN against a backend endpoint.
    // For this demo, we'll use a mock check and assume it's correct.
    // You could store the PIN in localStorage after first setup.
    const storedPin = localStorage.getItem(`client_${clientId}_pin`);
    if (!storedPin) {
      // First time login, set PIN
      localStorage.setItem(`client_${clientId}_pin`, pin);
      setIsAuthenticated(true);
    } else if (storedPin === pin) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN');
    }
  };

  useEffect(() => {
    // Bypass PIN for trainer view or if already authenticated
    const isTrainer = localStorage.getItem('isTrainer') === 'true';
    if (isTrainer) {
      setIsAuthenticated(true);
    }

    if (isAuthenticated) {
      loadClientData();
    }
  }, [isAuthenticated, loadClientData]);

  if (!isAuthenticated) {
    return <PinScreen onPinSubmit={handlePinSubmit} />;
  }

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a nice loading spinner
  }

  const pages = {
    Home: <HomePage clientId={clientId} client={clientData.client} sharedData={clientData} loadClientData={loadClientData} />,
    Train: <TrainPage clientId={clientId} client={clientData.client} sharedData={clientData} loadClientData={loadClientData} />,
    Food: <FoodPage clientId={clientId} client={clientData.client} sharedData={clientData} loadClientData={loadClientData} />,
    Progress: <ProgressPage clientId={clientId} sharedData={{ bodyStats: clientData.bodyStats, progressPhotos: clientData.progressPhotos, analytics: clientData.analytics }} loadClientData={loadClientData} />,
    Chat: <ChatPage clientId={clientId} client={clientData.client} sharedData={clientData} loadClientData={loadClientData} />,
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        <motion.main
          key={activePage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {pages[activePage]}
        </motion.main>
      </AnimatePresence>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1rem 0.5rem',
        backgroundColor: 'white',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <NavItem icon={Home} label="Home" isActive={activePage === 'Home'} onClick={() => setActivePage('Home')} />
        <NavItem icon={Dumbbell} label="Train" isActive={activePage === 'Train'} onClick={() => setActivePage('Train')} />
        <NavItem icon={Apple} label="Food" isActive={activePage === 'Food'} onClick={() => setActivePage('Food')} />
        <NavItem icon={BarChart2} label="Progress" isActive={activePage === 'Progress'} onClick={() => setActivePage('Progress')} />
        <NavItem icon={MessageSquare} label="Chat" isActive={activePage === 'Chat'} onClick={() => setActivePage('Chat')} />
      </div>
    </div>
  );
};

export default ClientDashboard;