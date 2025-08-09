import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon,
  Utensils,
  TrendingUp,
  Flame,
  Target,
  Droplet,
  Zap,
  BarChart3,
  Calendar,
  ChevronRight,
  Camera,
  QrCode,
  Clock,
  Check
} from 'lucide-react';
import './NutritionTracker.css';

const NutritionTracker = ({ stats, updateStats }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [dailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
  const [waterIntake, setWaterIntake] = useState(0);

  const foodDatabase = [
    { id: 1, name: "Grilled Chicken Breast", brand: "Generic", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g", fiber: 0, sugar: 0, sodium: 74 },
    { id: 2, name: "Brown Rice", brand: "Generic", calories: 112, protein: 2.6, carbs: 24, fat: 0.9, serving: "100g", fiber: 1.8, sugar: 0.4, sodium: 5 },
    { id: 3, name: "Banana", brand: "Generic", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: "1 medium", fiber: 3.1, sugar: 14, sodium: 1 },
    { id: 4, name: "Greek Yogurt", brand: "Chobani", calories: 100, protein: 18, carbs: 6, fat: 0, serving: "170g", fiber: 0, sugar: 4, sodium: 65 },
    { id: 5, name: "Almonds", brand: "Generic", calories: 164, protein: 6, carbs: 6, fat: 14, serving: "28g", fiber: 3.5, sugar: 1.2, sodium: 0 },
    { id: 6, name: "Protein Shake", brand: "Optimum Nutrition", calories: 120, protein: 24, carbs: 3, fat: 1, serving: "1 scoop", fiber: 1, sugar: 1, sodium: 130 },
    { id: 7, name: "Avocado Toast", brand: "Homemade", calories: 250, protein: 8, carbs: 30, fat: 12, serving: "1 slice", fiber: 7, sugar: 2, sodium: 300 },
    { id: 8, name: "Caesar Salad", brand: "Restaurant", calories: 358, protein: 10, carbs: 20, fat: 26, serving: "1 bowl", fiber: 3, sugar: 4, sodium: 900 },
    { id: 9, name: "Protein Bar", brand: "Quest", calories: 200, protein: 21, carbs: 21, fat: 9, serving: "1 bar", fiber: 14, sugar: 1, sodium: 230 }
  ];

  useEffect(() => {
    loadRecentFoods();
    calculateDailyTotals();
  }, [meals]);

  const loadRecentFoods = () => {
    const recent = JSON.parse(localStorage.getItem('recentFoods') || '[]');
    setRecentFoods(recent.slice(0, 5));
  };

  const calculateDailyTotals = () => {
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    Object.values(meals).forEach(mealFoods => {
      mealFoods.forEach(food => {
        totals.calories += food.calories * food.quantity;
        totals.protein += food.protein * food.quantity;
        totals.carbs += food.carbs * food.quantity;
        totals.fat += food.fat * food.quantity;
        totals.fiber += (food.fiber || 0) * food.quantity;
        totals.sugar += (food.sugar || 0) * food.quantity;
        totals.sodium += (food.sodium || 0) * food.quantity;
      });
    });

    setDailyTotals(totals);
    if (updateStats) {
      updateStats(prev => ({
        ...prev,
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein)
      }));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.brand.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addFoodToMeal = (food, meal) => {
    const newFood = { ...food, quantity: 1, id: Date.now() };
    setMeals(prev => ({
      ...prev,
      [meal]: [...prev[meal], newFood]
    }));
    
    const recent = JSON.parse(localStorage.getItem('recentFoods') || '[]');
    const updated = [food, ...recent.filter(f => f.id !== food.id)].slice(0, 10);
    localStorage.setItem('recentFoods', JSON.stringify(updated));
    
    setShowAddFood(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateFoodQuantity = (meal, foodId, quantity) => {
    if (quantity <= 0) {
      removeFoodFromMeal(meal, foodId);
      return;
    }
    setMeals(prev => ({
      ...prev,
      [meal]: prev[meal].map(food => 
        food.id === foodId ? { ...food, quantity } : food
      )
    }));
  };

  const removeFoodFromMeal = (meal, foodId) => {
    setMeals(prev => ({
      ...prev,
      [meal]: prev[meal].filter(food => food.id !== foodId)
    }));
  };

  const getMealIcon = (meal) => {
    switch(meal) {
      case 'breakfast': return <Coffee size={20} />;
      case 'lunch': return <Sun size={20} />;
      case 'dinner': return <Sunset size={20} />;
      case 'snacks': return <Moon size={20} />;
      default: return <Utensils size={20} />;
    }
  };

  const getMealCalories = (meal) => {
    return meals[meal].reduce((sum, food) => sum + (food.calories * food.quantity), 0);
  };

  const addWater = () => {
    setWaterIntake(prev => Math.min(prev + 1, 20));
  };

  const MacroProgress = ({ value, goal, label, color }) => {
    const percentage = Math.min((value / goal) * 100, 100);
    return (
      <div className="macro-progress">
        <div className="macro-header">
          <span className="macro-label">{label}</span>
          <span className="macro-values">{Math.round(value)}g / {goal}g</span>
        </div>
        <div className="macro-bar">
          <div 
            className="macro-fill" 
            style={{ 
              width: `${percentage}%`,
              background: color
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nutrition-tracker">
      <div className="nutrition-header">
        <h1>Nutrition</h1>
        <div className="date-selector">
          <Calendar size={16} />
          <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="calorie-summary">
        <div className="calorie-circle">
          <svg className="progress-ring" width="180" height="180">
            <circle
              className="progress-ring-bg"
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="var(--color-borderLight)"
              strokeWidth="12"
            />
            <circle
              className="progress-ring-fill"
              cx="90"
              cy="90"
              r="80"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - Math.min(dailyTotals.calories / dailyGoals.calories, 1))}`}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="calorie-info">
            <div className="calories-remaining">
              <span className="calories-number">
                {Math.max(dailyGoals.calories - Math.round(dailyTotals.calories), 0)}
              </span>
              <span className="calories-label">Remaining</span>
            </div>
          </div>
        </div>

        <div className="calorie-breakdown">
          <div className="breakdown-item">
            <Flame size={16} className="breakdown-icon" />
            <div className="breakdown-info">
              <span className="breakdown-value">{dailyGoals.calories}</span>
              <span className="breakdown-label">Goal</span>
            </div>
          </div>
          <div className="breakdown-item">
            <Utensils size={16} className="breakdown-icon" />
            <div className="breakdown-info">
              <span className="breakdown-value">{Math.round(dailyTotals.calories)}</span>
              <span className="breakdown-label">Food</span>
            </div>
          </div>
          <div className="breakdown-item">
            <TrendingUp size={16} className="breakdown-icon" />
            <div className="breakdown-info">
              <span className="breakdown-value">0</span>
              <span className="breakdown-label">Exercise</span>
            </div>
          </div>
        </div>
      </div>

      <div className="macros-section">
        <h2>Macronutrients</h2>
        <div className="macros-grid">
          <MacroProgress 
            value={dailyTotals.protein} 
            goal={dailyGoals.protein} 
            label="Protein" 
            color="#10b981"
          />
          <MacroProgress 
            value={dailyTotals.carbs} 
            goal={dailyGoals.carbs} 
            label="Carbs" 
            color="#3b82f6"
          />
          <MacroProgress 
            value={dailyTotals.fat} 
            goal={dailyGoals.fat} 
            label="Fat" 
            color="#f59e0b"
          />
        </div>
      </div>

      <div className="water-section">
        <div className="water-header">
          <h2>Water Intake</h2>
          <span className="water-goal">{waterIntake} / 8 cups</span>
        </div>
        <div className="water-cups">
          {Array.from({ length: 8 }).map((_, index) => (
            <button
              key={index}
              className={`water-cup ${index < waterIntake ? 'filled' : ''}`}
              onClick={addWater}
            >
              <Droplet size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="meals-section">
        <h2>Today's Meals</h2>
        {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
          <div key={meal} className="meal-card">
            <div className="meal-header">
              <div className="meal-title">
                {getMealIcon(meal)}
                <span>{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
              </div>
              <div className="meal-calories">
                {getMealCalories(meal)} cal
              </div>
            </div>
            
            <div className="meal-foods">
              {meals[meal].map(food => (
                <div key={food.id} className="food-item">
                  <div className="food-info">
                    <span className="food-name">{food.name}</span>
                    <span className="food-details">
                      {food.serving} × {food.quantity} = {Math.round(food.calories * food.quantity)} cal
                    </span>
                  </div>
                  <div className="food-actions">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateFoodQuantity(meal, food.id, food.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{food.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateFoodQuantity(meal, food.id, food.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="add-food-btn"
              onClick={() => {
                setSelectedMeal(meal);
                setShowAddFood(true);
              }}
            >
              <Plus size={16} />
              Add Food
            </button>
          </div>
        ))}
      </div>

      {showAddFood && (
        <div className="add-food-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Food to {selectedMeal}</h2>
              <button className="close-btn" onClick={() => setShowAddFood(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="search-section">
              <div className="search-bar">
                <Search size={20} />
                <input 
                  type="text"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="quick-actions">
                <button className="quick-action">
                  <QrCode size={20} />
                  Scan Barcode
                </button>
                <button className="quick-action">
                  <Camera size={20} />
                  Photo
                </button>
              </div>
            </div>

            {searchQuery.length === 0 && recentFoods.length > 0 && (
              <div className="recent-foods">
                <h3>Recent</h3>
                {recentFoods.map(food => (
                  <div 
                    key={food.id} 
                    className="food-result"
                    onClick={() => addFoodToMeal(food, selectedMeal)}
                  >
                    <div className="food-result-info">
                      <span className="food-name">{food.name}</span>
                      <span className="food-brand">{food.brand} • {food.serving}</span>
                    </div>
                    <div className="food-result-macros">
                      <span className="calories">{food.calories} cal</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="search-results">
                <h3>Search Results</h3>
                {searchResults.map(food => (
                  <div 
                    key={food.id} 
                    className="food-result"
                    onClick={() => addFoodToMeal(food, selectedMeal)}
                  >
                    <div className="food-result-info">
                      <span className="food-name">{food.name}</span>
                      <span className="food-brand">{food.brand} • {food.serving}</span>
                      <div className="food-macros-mini">
                        <span>P: {food.protein}g</span>
                        <span>C: {food.carbs}g</span>
                        <span>F: {food.fat}g</span>
                      </div>
                    </div>
                    <div className="food-result-macros">
                      <span className="calories">{food.calories} cal</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionTracker;