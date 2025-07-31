import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Flame, Drumstick, Wheat, Apple, BookOpen, Edit3, CheckCircle, UtensilsCrossed } from 'lucide-react';
import ApiClient from '../../utils/ApiClient';
import EmptyState from '../common/EmptyState';

const AddFoodModal = ({ isOpen, onClose, clientId, onFoodLogged, showNotification }) => {
  const [food, setFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: food.name,
        calories: parseInt(food.calories),
        protein: parseInt(food.protein),
        carbs: parseInt(food.carbs),
        fat: parseInt(food.fat),
      };
      await ApiClient.addNutritionLog(clientId, payload);
      showNotification('Food Logged!', `${food.name} has been added to your log.`, 'success');
      onFoodLogged();
      onClose();
      setFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    } catch (error) {
      showNotification('Log Failed', 'Could not save your food log. Please try again.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="card-premium w-full max-w-md" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-display">Log Food Item</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-border-light transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={food.name} onChange={handleChange} placeholder="e.g., Grilled Chicken Salad" className="input-premium" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="calories" value={food.calories} onChange={handleChange} placeholder="Calories" className="input-premium" required />
            <input type="number" name="protein" value={food.protein} onChange={handleChange} placeholder="Protein (g)" className="input-premium" required />
            <input type="number" name="carbs" value={food.carbs} onChange={handleChange} placeholder="Carbs (g)" className="input-premium" required />
            <input type="number" name="fat" value={food.fat} onChange={handleChange} placeholder="Fat (g)" className="input-premium" required />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">Log Food</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const MacroDisplay = ({ label, value, goal, color, icon: Icon }) => {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  return (
    <div className="flex flex-col items-center text-center">
        <div className="w-full bg-primary-bg rounded-full h-2.5 mb-2">
            <motion.div 
                className={`h-2.5 rounded-full ${color}`}
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
            />
        </div>
        <p className="font-bold text-sm text-heading">{label}</p>
        <p className="text-xs text-text-secondary">{Math.round(value)} / {goal}g</p>
    </div>
  );
}

const FoodPage = ({ client, sharedData, onDataUpdate, showNotification }) => {
  const [isLoggingFood, setIsLoggingFood] = useState(false);
  const [activeTab, setActiveTab] = useState('log'); // 'log' or 'assigned'

  const { nutrition, dietPlan } = sharedData;
  const { nutritionLogsToday } = nutrition;
  const { assignedMeals, macroTargets } = dietPlan || {};

  const totals = nutritionLogsToday.reduce((acc, log) => {
    acc.calories += log.calories;
    acc.protein += log.protein;
    acc.carbs += log.carbs;
    acc.fat += log.fat;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const isCompletelyEmpty = (!nutritionLogsToday || nutritionLogsToday.length === 0) && (!assignedMeals || assignedMeals.length === 0);

  const handleLogAssignedMeal = async (meal) => {
    try {
      const { name, calories, protein, carbs, fat } = meal;
      await ApiClient.addNutritionLog(client.id, { name, calories, protein, carbs, fat });
      showNotification('Meal Logged!', `${meal.name} added to your log.`, 'success');
      onDataUpdate();
    } catch (error) {
      showNotification('Log Failed', 'Could not log assigned meal.', 'error');
    }
  };

  const TabButton = ({ label, value, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(value)}
      className={`relative flex-1 py-3 px-2 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 ${activeTab === value ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {activeTab === value && <motion.div layoutId="foodTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"/>}
    </button>
  );

  return (
    <div className="min-h-screen bg-primary-bg pb-24">
      <div className="p-6 space-y-6">
        <motion.div 
          className="card-premium p-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-display">Nutrition Hub</h1>
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <MacroDisplay label="Protein" value={totals.protein} goal={macroTargets?.protein} color="bg-blue-500" />
            <MacroDisplay label="Carbs" value={totals.carbs} goal={macroTargets?.carbs} color="bg-yellow-500" />
            <MacroDisplay label="Fat" value={totals.fat} goal={macroTargets?.fat} color="bg-green-500" />
          </div>
          <div className="mt-4">
            <p className="text-center text-sm text-text-secondary mb-1">Daily Calories</p>
            <div className="w-full bg-primary-bg rounded-full h-3">
                <motion.div 
                    className="h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(totals.calories / (macroTargets?.calories || 2000)) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
            <p className="text-center font-bold text-lg text-heading mt-1">{Math.round(totals.calories)} / {macroTargets?.calories || 2000} kcal</p>
          </div>
        </motion.div>

        {isCompletelyEmpty ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Your Nutrition Hub"
            message="Log your first meal to see your nutrition breakdown, or check back here for meals assigned by your trainer."
          >
            <motion.button
              onClick={() => setIsLoggingFood(true)}
              className="btn-primary mt-6 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Your First Meal
            </motion.button>
          </EmptyState>
        ) : (
          <>
            <div className="relative flex justify-center items-center bg-primary-bg p-1 rounded-full">
              <AnimatePresence>
                {activeTab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1/2 bg-white dark:bg-gray-700 rounded-full shadow-md"
                    initial={{ x: activeTab === 'log' ? '0%' : '100%' }}
                    animate={{ x: activeTab === 'log' ? '0%' : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <TabButton label="Today's Log" value="log" icon={Edit3} />
              <TabButton label="Assigned Meals" value="assigned" icon={BookOpen} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'log' && (
                  <div className="space-y-3">
                    {nutritionLogsToday.length > 0 ? nutritionLogsToday.map((log, i) => (
                      <motion.div 
                        key={log.id} 
                        className="card-premium p-4 flex justify-between items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      >
                        <p className="font-semibold text-heading flex-1 truncate pr-4">{log.name}</p>
                        <div className="flex gap-3 text-sm text-text-secondary items-center flex-shrink-0">
                          <span className="font-bold text-red-500">{log.calories}</span>
                          <span className="hidden sm:inline"><Drumstick className="w-4 h-4 inline mr-1 text-blue-500"/>{log.protein}g</span>
                        </div>
                      </motion.div>
                    )) : (
                      <EmptyState 
                        icon={UtensilsCrossed}
                        title="Nothing Logged Yet"
                        message="Use the '+' button to add a food item to your daily log."
                      />
                    )}
                  </div>
                )}
                {activeTab === 'assigned' && (
                  <div className="space-y-3">
                    {assignedMeals?.length > 0 ? assignedMeals.map((meal, i) => (
                      <motion.div 
                        key={meal.id} 
                        className="card-premium p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-heading flex-1 pr-2">{meal.name}</p>
                          <button onClick={() => handleLogAssignedMeal(meal)} className="btn-primary-sm flex-shrink-0">Log Meal</button>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mt-2 pt-2 border-t border-border-light">
                          <span><Flame className="w-4 h-4 inline mr-1.5 text-red-500"/>{meal.calories} kcal</span>
                          <span><Drumstick className="w-4 h-4 inline mr-1.5 text-blue-500"/>{meal.protein}g P</span>
                          <span><Wheat className="w-4 h-4 inline mr-1.5 text-yellow-500"/>{meal.carbs}g C</span>
                          <span><Apple className="w-4 h-4 inline mr-1.5 text-green-500"/>{meal.fat}g F</span>
                        </div>
                      </motion.div>
                    )) : (
                      <EmptyState 
                        icon={BookOpen}
                        title="No Assigned Meals"
                        message="Your trainer hasn't assigned any meals for today. Feel free to log your own food."
                      />
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      <motion.button 
        onClick={() => setIsLoggingFood(true)} 
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center shadow-2xl shadow-brand-primary/30"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Plus size={32} />
      </motion.button>

      <AnimatePresence>
        <AddFoodModal 
          isOpen={isLoggingFood} 
          onClose={() => setIsLoggingFood(false)} 
          clientId={client.id}
          onFoodLogged={onDataUpdate}
          showNotification={showNotification}
        />
      </AnimatePresence>
    </div>
  );
};

export default FoodPage;
