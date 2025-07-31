import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Dumbbell, Apple, BarChart2, MessageSquare, Lock } from 'lucide-react';
import ApiClient from '../../utils/ApiClient';
import { useNotification } from '../../utils/NotificationContext';

// Import client page components
import HomePage from './HomePage';
import TrainPage from './TrainPage';
import FoodPage from './FoodPage';
import ProgressPage from './ProgressPage';
import ChatPage from './ChatPage';
import PinScreen from './PinScreen';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('Home');
  const [clientData, setClientData] = useState({
    client: null,
    program: null,
    workoutHistory: [],
    nutritionLogsToday: [],
    bodyStats: [],
    progressPhotos: [],
    messages: [],
    analytics: null,
    assignedMeals: [],
    groups: []
  });

  const { showError, showSuccess } = useNotification();

  const loadClientData = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [
        client,
        program,
        history,
        nutritionLogs,
        stats,
        photos,
        messages,
        analytics,
        meals,
        groups
      ] = await Promise.all([
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
        program,
        workoutHistory: history,
        nutritionLogsToday: nutritionLogs,
        bodyStats: stats,
        progressPhotos: photos,
        messages,
        analytics,
        assignedMeals: meals,
        groups
      });
    } catch (error) {
      console.error("Failed to load client data:", error);
      showError("Failed to load client data", "Error");
    } finally {
      setIsLoading(false);
    }
  }, [clientId, showError]);

  const handlePinSubmit = async (pin) => {
    try {
      const result = await ApiClient.verifyClientPin(clientId, pin);
      if (result.success) {
        setIsAuthenticated(true);
        showSuccess("Welcome back!", "Authentication Successful");
      } else {
        showError("Invalid PIN. Please try again.", "Authentication Failed");
        return false;
      }
    } catch (error) {
      console.error("PIN verification failed:", error);
      showError("Authentication failed. Please try again.", "Error");
      return false;
    }
    return true;
  };

  useEffect(() => {
    // Check if trainer is accessing (bypass PIN)
    const isTrainer = localStorage.getItem('isTrainer') === 'true';
    if (isTrainer) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadClientData();
    }
  }, [isAuthenticated, loadClientData]);

  if (!isAuthenticated) {
    return <PinScreen onPinSubmit={handlePinSubmit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg to-accent-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-3 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-text-secondary">Loading your fitness journey...</p>
        </motion.div>
      </div>
    );
  }

  const pages = {
    Home: <HomePage 
      client={clientData.client} 
      sharedData={clientData} 
      setActivePage={setActivePage}
      onDataUpdate={loadClientData}
    />,
    Train: <TrainPage 
      client={clientData.client} 
      sharedData={clientData} 
      setActivePage={setActivePage}
      onDataUpdate={loadClientData}
    />,
    Food: <FoodPage 
      client={clientData.client} 
      sharedData={clientData} 
      setActivePage={setActivePage}
      onDataUpdate={loadClientData}
    />,
    Progress: <ProgressPage 
      client={clientData.client} 
      sharedData={clientData} 
      setActivePage={setActivePage}
      onDataUpdate={loadClientData}
    />,
    Chat: <ChatPage 
      client={clientData.client} 
      sharedData={clientData} 
      setActivePage={setActivePage}
      onDataUpdate={loadClientData}
    />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg to-accent-bg flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {pages[activePage]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="glass-card rounded-none rounded-t-3xl border-b-0 p-4">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <NavItem
              icon={Home}
              label="Home"
              isActive={activePage === 'Home'}
              onClick={() => setActivePage('Home')}
            />
            <NavItem
              icon={Dumbbell}
              label="Train"
              isActive={activePage === 'Train'}
              onClick={() => setActivePage('Train')}
            />
            <NavItem
              icon={Apple}
              label="Food"
              isActive={activePage === 'Food'}
              onClick={() => setActivePage('Food')}
            />
            <NavItem
              icon={BarChart2}
              label="Progress"
              isActive={activePage === 'Progress'}
              onClick={() => setActivePage('Progress')}
            />
            <NavItem
              icon={MessageSquare}
              label="Chat"
              isActive={activePage === 'Chat'}
              onClick={() => setActivePage('Chat')}
            />
          </div>
        </div>
      </motion.nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
        isActive
          ? 'text-brand-primary'
          : 'text-text-muted hover:text-text-primary'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`p-2 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
            : 'hover:bg-hover-bg'
        }`}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <span className={`text-xs font-medium ${
        isActive ? 'text-brand-primary' : 'text-text-muted'
      }`}>
        {label}
      </span>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -top-1 w-1 h-1 bg-brand-primary rounded-full"
          initial={false}
        />
      )}
    </motion.button>
  );
};

export default ClientDashboard;
