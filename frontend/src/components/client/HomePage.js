import React from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, 
  Dumbbell, 
  BarChart2, 
  MessageSquare, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock,
  Flame,
  Award,
  Zap,
  Heart
} from 'lucide-react';

const GettingStartedGuide = ({ setActivePage, hasActiveProgram }) => {
  const title = hasActiveProgram ? "Let's Get Started!" : "Welcome Aboard!";
  const subtitle = hasActiveProgram
    ? "Your journey to a better you starts now. Here are a few things you can do to kick things off:"
    : "Your trainer is preparing your personalized plan. While you wait, feel free to explore the app:";

  const guideActions = [
    { title: 'Log Your First Meal', icon: Apple, page: 'Food', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Add Your Weight', icon: BarChart2, page: 'Progress', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Say Hi to Your Trainer', icon: MessageSquare, page: 'Chat', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="card-premium p-6 text-center"
    >
      <Zap className="w-12 h-12 mx-auto text-brand-primary mb-4" />
      <h2 className="text-xl font-bold text-heading mb-2">{title}</h2>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">{subtitle}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {guideActions.map((action, index) => (
          <motion.button
            key={action.title}
            onClick={() => setActivePage(action.page)}
            className="p-6 bg-primary-bg dark:bg-gray-800/50 rounded-2xl text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            <div className={`w-14 h-14 rounded-full ${action.bgColor} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
              <action.icon className={`w-7 h-7 ${action.color}`} />
            </div>
            <p className="font-semibold text-heading group-hover:text-brand-primary transition-colors">{action.title}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const HomePage = ({ client, sharedData, setActivePage, onDataUpdate }) => {
  const { nutritionLogsToday, workoutHistory, bodyStats, activeProgram } = sharedData;

  const todaysCalories = nutritionLogsToday?.reduce((sum, log) => sum + (log.calories || 0), 0) || 0;
  const calorieGoal = client?.dailyCalorieGoal || 2000;

  const todaysWorkouts = workoutHistory?.filter(workout => {
    const today = new Date().toISOString().split('T')[0];
    return workout.actual_date?.startsWith(today);
  }) || [];

  const currentWeight = bodyStats?.length > 0 ? bodyStats[bodyStats.length - 1].weight : null;
  const goalWeight = client?.goalWeight;

  const needsOnboarding = !activeProgram || (!nutritionLogsToday?.length && !workoutHistory?.length && !bodyStats?.length);
  
  const quickActions = [
    { title: 'Log Food', description: 'Track your meals', icon: Apple, color: 'from-green-500 to-green-600', page: 'Food' },
    { title: 'Start Workout', description: 'Begin training', icon: Dumbbell, color: 'from-orange-500 to-orange-600', page: 'Train' },
    { title: 'Log Progress', description: 'Update your stats', icon: BarChart2, color: 'from-purple-500 to-purple-600', page: 'Progress' },
    { title: 'Message Trainer', description: 'Get support', icon: MessageSquare, color: 'from-blue-500 to-blue-600', page: 'Chat' }
  ];

  const stats = [
    { title: 'Calories Today', value: todaysCalories, unit: 'kcal', icon: Flame, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Workouts', value: todaysWorkouts.length, unit: 'completed', icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Current Weight', value: currentWeight || '--', unit: 'kg', icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50' }
  ];

  return (
    <div className="min-h-screen bg-primary-bg p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-display">Welcome, {client?.name?.split(' ')[0] || 'Champion'}!</h1>
          <p className="text-text-secondary">
            {needsOnboarding ? "Let's get your journey started.": "Ready to crush your goals today?"}
          </p>
        </motion.div>

        {needsOnboarding ? (
          <GettingStartedGuide setActivePage={setActivePage} hasActiveProgram={!!activeProgram} />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h2 className="text-xl font-semibold text-heading mb-4">Today's Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.title} className="card-premium flex items-center p-4 gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                    {React.createElement(stat.icon, { className: `w-6 h-6 ${stat.color}` })}
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{stat.title}</p>
                    <p className="text-2xl font-bold text-heading">{stat.value} <span className="text-base font-normal text-text-secondary">{stat.unit}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: needsOnboarding ? 0.2 : 0.4, duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-heading mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button key={action.title} onClick={() => setActivePage(action.page)} className="card-premium text-center p-4 group">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                  {React.createElement(action.icon, { className: "w-7 h-7 text-white" })}
                </div>
                <p className="font-semibold text-heading group-hover:text-brand-primary transition-colors">{action.title}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {!needsOnboarding && (todaysWorkouts.length > 0 || nutritionLogsToday?.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <h2 className="text-xl font-semibold text-heading mb-4">Recent Activity</h2>
            <div className="card-premium p-4 space-y-3">
              {todaysWorkouts.map(workout => (
                <div key={workout.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-text-secondary"><span className="font-semibold text-heading">Completed workout:</span> {workout.name}</p>
                </div>
              ))}
              {nutritionLogsToday?.length > 0 && (
                 <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                    <Apple className="w-5 h-5 text-info" />
                  </div>
                  <p className="text-text-secondary"><span className="font-semibold text-heading">Logged</span> {nutritionLogsToday.length} food items.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
