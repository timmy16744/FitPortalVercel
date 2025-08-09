import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Dumbbell, Apple, BarChart2, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { clientId } = useParams();
  const [activePage, setActivePage] = useState('Home');
  const navigate = useNavigate();

  const pages = ['Home', 'Train', 'Food', 'Progress', 'Chat'];
  
  const pageIcons = {
    Home: Home,
    Train: Dumbbell,
    Food: Apple,
    Progress: BarChart2,
    Chat: MessageSquare
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold mb-2">Today's Workout</h3>
                <p className="text-secondary">Upper Body Strength Training</p>
                <button className="btn-premium btn-premium--primary mt-4">Start Workout</button>
              </div>
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold mb-2">Nutrition Goals</h3>
                <p className="text-secondary">2,200 calories remaining</p>
                <button className="btn-premium btn-premium--secondary mt-4">Log Food</button>
              </div>
            </div>
          </div>
        );
      case 'Train':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Workout Library</h1>
            <div className="space-y-4">
              {['Upper Body', 'Lower Body', 'Cardio', 'Flexibility'].map((workout) => (
                <div key={workout} className="card-premium p-4 hover-lift cursor-pointer">
                  <h3 className="font-semibold">{workout}</h3>
                  <p className="text-secondary text-sm">45 minutes • Intermediate</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Food':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Nutrition Tracking</h1>
            <div className="card-premium p-6">
              <h3 className="text-lg font-semibold mb-4">Today's Intake</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Calories</span>
                  <span>1,800 / 2,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein</span>
                  <span>120g / 150g</span>
                </div>
                <div className="flex justify-between">
                  <span>Carbs</span>
                  <span>180g / 220g</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Progress':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Progress Tracking</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold mb-2">Weight Progress</h3>
                <p className="text-3xl font-bold text-brand-600">165 lbs</p>
                <p className="text-sm text-success-600">-5 lbs this month</p>
              </div>
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold mb-2">Workouts Completed</h3>
                <p className="text-3xl font-bold text-brand-600">24</p>
                <p className="text-sm text-success-600">+6 from last month</p>
              </div>
            </div>
          </div>
        );
      case 'Chat':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Messages</h1>
            <div className="card-premium p-6">
              <div className="space-y-4">
                <div className="bg-brand-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold">Trainer</p>
                  <p className="text-sm">Great job on today's workout! Keep it up!</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg ml-8">
                  <p className="text-sm font-semibold">You</p>
                  <p className="text-sm">Thank you! Ready for tomorrow's session.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="app-layout min-h-screen bg-surface-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <button 
          onClick={() => navigate('/trainer')}
          className="btn-premium btn-premium--ghost btn-premium--sm mr-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold">Client Dashboard</h1>
        <span className="text-sm text-secondary ml-2">ID: {clientId}</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-around max-w-md mx-auto">
          {pages.map((page) => {
            const Icon = pageIcons[page];
            const isActive = activePage === page;
            
            return (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-brand-100 text-brand-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{page}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default ClientDashboard;