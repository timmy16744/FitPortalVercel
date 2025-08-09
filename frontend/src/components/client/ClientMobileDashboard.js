import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  MessageCircle,
  Calendar,
  Flame,
  Activity,
  Camera,
  Plus,
  ChevronRight,
  Award,
  Droplets,
  Zap,
  Heart,
  Settings,
  User,
  Users,
  Play,
  Pause,
  Check,
  X,
  Clock3,
  UploadCloud,
  Image as ImageIcon,
  Apple,
  Moon,
  Thermometer,
  Target,
  Timer
} from 'lucide-react';
import WorkoutTracker from './WorkoutTracker';
import NutritionTracker from './NutritionTracker';
import ProgressTracker from './ProgressTracker';
import ChatInterface from './ChatInterface';
import { useTheme } from '../../contexts/ThemeContext';

// Premium Theme System - Matching Trainer Dashboard Polish
const theme = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cardBg: '#ffffff',
  cardBgGlass: 'rgba(255, 255, 255, 0.9)',
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  successGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  lightBg: '#f8fafc',
  darkBg: '#0f172a',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// BetterFit styled components
const MobileContainer = ({ children }) => (
  <div style={{
    maxWidth: '390px',
    margin: '0 auto',
    background: theme.lightBg,
    minHeight: '100vh',
    position: 'relative',
    boxShadow: theme.shadowXl,
    borderRadius: '0',
    overflow: 'hidden'
  }}>
    {children}
  </div>
);

// Status bar removed as requested

const PageHeader = ({ title, subtitle, gradient = true }) => (
  <div style={{
    background: gradient ? theme.primaryGradient : theme.cardBg,
    padding: '24px 20px',
    color: gradient ? 'white' : theme.textPrimary,
    position: 'relative',
    borderRadius: gradient ? '0' : '0 0 24px 24px',
    ...(gradient ? {} : {
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      borderTop: 'none'
    })
  }}>
    <h1 style={{
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '8px',
      margin: 0,
      letterSpacing: '-0.025em',
      lineHeight: '1.1'
    }}>
      {title}
    </h1>
    <p style={{
      opacity: gradient ? 0.9 : 0.7,
      fontSize: '15px',
      margin: 0,
      fontWeight: '500'
    }}>
      {subtitle}
    </p>
  </div>
);

const Card = ({ children, style = {}, className = '', hover = true, glass = false }) => (
  <div 
    className={className}
    style={{
      background: glass ? theme.cardBgGlass : theme.cardBg,
      borderRadius: '20px',
      padding: '24px',
      margin: '16px',
      boxShadow: theme.shadowMd,
      border: `1px solid ${theme.borderLight}`,
      transition: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Standard
      position: 'relative',
      ...(glass ? {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      } : {}),
      ...style
    }}
    onMouseEnter={hover ? (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = theme.shadowLg;
      e.currentTarget.style.transition = 'all 150ms cubic-bezier(0.05, 0.7, 0.1, 1)'; // Emphasized Decelerate
    } : undefined}
    onMouseLeave={hover ? (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = theme.shadowMd;
      e.currentTarget.style.transition = 'all 200ms cubic-bezier(0.3, 0, 0.8, 0.15)'; // Emphasized Accelerate
    } : undefined}
  >
    {children}
  </div>
);

const StatCard = ({ title, value, unit, trend, icon, color }) => (
  <div style={{
    background: theme.cardBg,
    borderRadius: '20px',
    padding: '20px',
    boxShadow: theme.shadowMd,
    border: `1px solid ${theme.borderLight}`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = theme.shadowLg;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = theme.shadowMd;
  }}>
    {icon && (
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '32px',
        height: '32px',
        borderRadius: '12px',
        background: `${color || theme.primary}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || theme.primary
      }}>
        {icon}
      </div>
    )}
    <h3 style={{
      fontSize: '13px',
      color: theme.textLight,
      marginBottom: '8px',
      margin: '0 0 8px 0',
      fontWeight: '600',
      letterSpacing: '0.025em',
      textTransform: 'uppercase'
    }}>
      {title}
    </h3>
    <div style={{
      fontSize: '28px',
      fontWeight: '800',
      color: theme.textPrimary,
      margin: '0 0 4px 0',
      lineHeight: '1.1'
    }}>
      {value} <span style={{
        fontSize: '16px',
        color: theme.textSecondary,
        fontWeight: '500'
      }}>{unit}</span>
    </div>
    {trend && (
      <div style={{
        fontSize: '12px',
        color: trend.startsWith('+') || trend.startsWith('↑') ? theme.success : theme.error,
        fontWeight: '600'
      }}>
        {trend}
      </div>
    )}
  </div>
);

const MacroCard = ({ icon, title, value, target, color, IconComponent }) => {
  const percentage = target ? Math.min((parseFloat(value) / target) * 100, 100) : 0;
  
  return (
    <div style={{
      background: theme.cardBg,
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: theme.shadowMd,
      border: `1px solid ${theme.borderLight}`,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = theme.shadowLg;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = theme.shadowMd;
    }}>
      {/* Progress ring background */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: `${color}10`,
        zIndex: 0
      }} />
      
      <div style={{
        width: '48px',
        height: '48px',
        margin: '0 auto 12px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}15`,
        position: 'relative',
        zIndex: 1
      }}>
        {IconComponent ? <IconComponent size={24} color={color} strokeWidth={2} /> : 
         <span style={{ fontSize: '24px' }}>{icon}</span>}
      </div>
      
      <h4 style={{
        fontSize: '12px',
        color: theme.textLight,
        marginBottom: '8px',
        margin: '0 0 8px 0',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </h4>
      
      <div style={{
        fontSize: '22px',
        fontWeight: '800',
        color: theme.textPrimary,
        marginBottom: '4px',
        margin: '0 0 4px 0'
      }}>
        {value}
      </div>
      
      {target && (
        <div style={{
          width: '100%',
          height: '4px',
          background: theme.border,
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '8px'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            borderRadius: '2px',
            transition: 'width 0.6s ease'
          }} />
        </div>
      )}
    </div>
  );
};

const GradientButton = ({ children, onClick, style = {}, disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? theme.textLight : theme.primaryGradient,
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : theme.shadowMd,
      transition: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)', // Material Standard
      letterSpacing: '0.025em',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = theme.shadowLg;
        e.currentTarget.style.transition = 'all 150ms cubic-bezier(0.05, 0.7, 0.1, 1)'; // Emphasized Decelerate
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = theme.shadowMd;
        e.currentTarget.style.transition = 'all 200ms cubic-bezier(0.3, 0, 0.8, 0.15)'; // Emphasized Accelerate
      }
    }}
    onTouchStart={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.transition = 'all 100ms cubic-bezier(0.4, 0.0, 0.2, 1)';
      }
    }}
    onTouchEnd={(e) => {
      if (!disabled) {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.transition = 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)';
      }
    }}
  >
    {/* Material Ripple Effect */}
    <span style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1)'
    }} />
    {children}
  </button>
);

const ClientMobileDashboard = ({ trainerAccess = false }) => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { theme: appTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(trainerAccess);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workoutPlaying, setWorkoutPlaying] = useState(false);
  const [restTimer, setRestTimer] = useState(null);
  const [todayStats, setTodayStats] = useState({
    calories: 1847,
    caloriesGoal: 2400,
    protein: 142,
    proteinGoal: 150,
    carbs: 189,
    carbsGoal: 240,
    fat: 67,
    fatGoal: 80,
    fiber: 22,
    fiberGoal: 30,
    workoutsCompleted: 1,
    workoutStreak: 12,
    water: 2.1,
    waterGoal: 3.0,
    steps: 8200,
    stepsGoal: 10000,
    activeMinutes: 52,
    activeGoal: 60,
    weight: 99.0,
    waist: 82,
    bodyFat: 14.0,
    benchPress: 140
  });
  
  const [meals, setMeals] = useState([
    { id: 1, name: "Protein shake", calories: 320, time: "07:45" },
    { id: 2, name: "Chicken salad", calories: 450, time: "12:30" },
    { id: 3, name: "Greek yogurt", calories: 180, time: "15:20" },
  ]);
  const [mealInput, setMealInput] = useState("");

  const [quickActions] = useState([
    { id: 'workout', icon: Dumbbell, label: 'Start workout' },
    { id: 'food', icon: Apple, label: 'Log food' },
    { id: 'progress', icon: Camera, label: 'Progress photo' },
    { id: 'chat', icon: MessageCircle, label: 'Message coach' }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // If trainer access, skip authentication and load data immediately
    if (trainerAccess && clientId) {
      setIsAuthenticated(true);
      fetchClientData();
      fetchTodayStats();
      return;
    }

    // For public client access, check if we have a valid session token
    const token = localStorage.getItem('token');
    if (clientId && !token) {
      // Public client URL without token - need PIN authentication
      setIsAuthenticated(false);
      return;
    }

    // Legacy mobile access (redirect to PIN entry if needed)
    if (!clientId && !token) {
      navigate('/client/pin');
      return;
    }

    // If we have a token, we're authenticated
    if (token) {
      setIsAuthenticated(true);
      fetchClientData();
      fetchTodayStats();
    }
  }, [navigate, clientId, trainerAccess]);

  const fetchClientData = async () => {
    try {
      const apiUrl = clientId 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/clients/${clientId}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/client/profile`;
      
      const headers = { 'Content-Type': 'application/json' };
      
      // For trainer access, use trainer token if available, otherwise no auth needed
      if (trainerAccess) {
        const trainerToken = localStorage.getItem('trainerToken');
        if (trainerToken) {
          headers['Authorization'] = `Bearer ${trainerToken}`;
        }
      } else {
        // For client access, use client session token
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(apiUrl, { headers });
      if (response.ok) {
        const data = await response.json();
        setClientData(data);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const apiUrl = clientId 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/clients/${clientId}/today-stats`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/client/today-stats`;
      
      const headers = { 'Content-Type': 'application/json' };
      
      // For trainer access, use trainer token if available
      if (trainerAccess) {
        const trainerToken = localStorage.getItem('trainerToken');
        if (trainerToken) {
          headers['Authorization'] = `Bearer ${trainerToken}`;
        }
      } else {
        // For client access, use client session token
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(apiUrl, { headers });
      if (response.ok) {
        const data = await response.json();
        setTodayStats(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching today stats:', error);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length !== 6) {
      setPinError('Please enter a 6-digit PIN');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/clients/${clientId}/verify-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: pinInput }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the session token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setIsAuthenticated(true);
        setPinError('');
        fetchClientData();
        fetchTodayStats();
      } else {
        setPinError('Invalid PIN. Please try again.');
        setPinInput('');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setPinError('Connection error. Please try again.');
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'workout':
        setActiveTab('workout');
        break;
      case 'food':
        setActiveTab('nutrition');
        break;
      case 'progress':
        setActiveTab('progress');
        break;
      case 'chat':
        setActiveTab('chat');
        break;
      default:
        break;
    }
  };

  const addMeal = () => {
    if (!mealInput.trim()) return;
    setMeals([{
      id: Date.now(),
      name: mealInput,
      calories: Math.floor(Math.random() * 400) + 200,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }, ...meals]);
    setMealInput("");
  };

  // Liquid Glass Bottom Navigation
  const BottomNav = ({ activeTab, setActiveTab }) => {
    const [previousTabIndex, setPreviousTabIndex] = useState(2); // Default to home (index 2)
    
    const navItems = [
      { id: 'nutrition', label: 'Nutrition', icon: Utensils, cOption: '1' },
      { id: 'workout', label: 'Workout', icon: Dumbbell, cOption: '2' },
      { id: 'home', label: 'Home', icon: Home, cOption: '3', isHome: true },
      { id: 'progress', label: 'Progress', icon: TrendingUp, cOption: '4' },
      { id: 'chat', label: 'Chat', icon: MessageCircle, cOption: '5' }
    ];

    const handleTabChange = (newTab, newIndex) => {
      if (newTab === activeTab || isTransitioning) return;
      
      setIsTransitioning(true);
      setPreviousTab(activeTab);
      setPreviousTabIndex(navItems.findIndex(item => item.id === activeTab));
      setActiveTab(newTab);
      
      // Reset after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    };

    // CSS variables for liquid glass
    const glassVars = {
      '--c-glass': '#bbbbbc',
      '--c-light': '#fff',
      '--c-dark': '#000',
      '--c-content': theme.textPrimary,
      '--c-action': theme.primary,
      '--c-bg': theme.lightBg,
      '--glass-reflex-dark': '1',
      '--glass-reflex-light': '1',
      '--saturation': '150%'
    };

    const currentActiveIndex = navItems.findIndex(item => item.id === activeTab);

    return (
      <>
        {/* Add CSS variables to document */}
        <style>{`
          .liquid-nav {
            --c-glass: #bbbbbc;
            --c-light: #fff;
            --c-dark: #000;
            --c-content: ${theme.textPrimary};
            --c-action: ${theme.primary};
            --c-bg: ${theme.lightBg};
            --glass-reflex-dark: 1;
            --glass-reflex-light: 1;
            --saturation: 150%;
          }
          
          .liquid-nav-container {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 350px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 8px 12px;
            border-radius: 35px;
            background-color: color-mix(in srgb, var(--c-glass) 12%, transparent);
            backdrop-filter: blur(12px) saturate(var(--saturation));
            -webkit-backdrop-filter: blur(12px) saturate(var(--saturation));
            box-shadow: 
              inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
              inset 1.8px 3px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent), 
              inset -2px -2px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent), 
              inset -3px -8px 1px -6px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent), 
              inset -0.3px -1px 4px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent), 
              inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), 
              inset 0px 3px 4px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), 
              inset 2px -6.5px 1px -4px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 
              0px 1px 5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 
              0px 6px 16px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
            transition: 
              background-color 400ms cubic-bezier(1, 0.0, 0.4, 1),
              box-shadow 400ms cubic-bezier(1, 0.0, 0.4, 1);
            z-index: 1000;
          }
          
          .liquid-nav-container::after {
            content: '';
            position: absolute;
            left: 4px;
            top: 4px;
            display: block;
            width: 62px;
            height: calc(100% - 8px);
            border-radius: 35px;
            background-color: color-mix(in srgb, var(--c-glass) 36%, transparent);
            z-index: -1;
            box-shadow: 
              inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
              inset 2px 1px 0px -1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent), 
              inset -1.5px -1px 0px -1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent), 
              inset -2px -6px 1px -5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent), 
              inset -1px 2px 3px -1px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent), 
              inset 0px -4px 1px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent), 
              0px 3px 6px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
            transform: translateX(${currentActiveIndex * 66}px);
            transition: 
              background-color 400ms cubic-bezier(1, 0.0, 0.4, 1),
              box-shadow 400ms cubic-bezier(1, 0.0, 0.4, 1),
              transform 400ms cubic-bezier(1, 0.0, 0.4, 1);
            animation: ${isTransitioning ? 'liquidScale 440ms ease' : 'none'};
          }
          
          @keyframes liquidScale {
            0% { scale: 1 1; }
            50% { scale: 1.15 1; }
            100% { scale: 1 1; }
          }
          
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 12px;
            width: 62px;
            height: 100%;
            border-radius: 35px;
            cursor: pointer;
            transition: all 160ms;
            color: var(--c-content);
            position: relative;
            z-index: 1;
          }
          
          .nav-item:hover {
            color: var(--c-action);
            transform: scale(1.1);
          }
          
          .nav-item.active {
            color: var(--c-content);
            cursor: auto;
          }
          
          .nav-item.active:hover {
            transform: scale(1);
          }
          
          .nav-icon {
            display: block;
            width: 100%;
            transition: scale 200ms cubic-bezier(0.5, 0, 0, 1);
          }
          
          .nav-item:hover .nav-icon:not(.active-icon) {
            scale: 1.2;
          }
          
          .nav-item.active .nav-icon {
            scale: 1;
          }
        `}</style>
        
        <div className="liquid-nav">
          <div className="liquid-nav-container">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id, index)}
                >
                  <div className={`nav-icon ${isActive ? 'active-icon' : ''}`}>
                    <IconComponent size={24} strokeWidth={2} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  // Smooth Material Design Page Wrapper - No Flash
  const PageWrapper = ({ children, isActive }) => {
    return (
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: '0',
          paddingBottom: '100px', 
          minHeight: 'calc(100vh - 80px)',
          background: theme.lightBg,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
          transition: 'opacity 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          zIndex: isActive ? 1 : 0
        }}
      >
        {children}
      </div>
    );
  };

  // Home Page Components
  const QuickStats = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      padding: '16px'
    }}>
      <StatCard 
        title="Today's Calories" 
        value={todayStats.calories} 
        unit={`/ ${todayStats.caloriesGoal}`}
        trend="-85 from yesterday"
        icon={<Flame size={18} />}
        color={theme.warning}
      />
      <StatCard 
        title="Workouts" 
        value={todayStats.workoutsCompleted} 
        unit="/ 5 this week"
        trend={`+${todayStats.workoutStreak} day streak`}
        icon={<Dumbbell size={18} />}
        color={theme.primary}
      />
      <StatCard 
        title="Current Weight" 
        value={todayStats.weight} 
        unit="kg"
        trend="↓ 1.2kg this month"
        icon={<Activity size={18} />}
        color={theme.success}
      />
      <StatCard 
        title="Water Intake" 
        value={todayStats.water} 
        unit={`/ ${todayStats.waterGoal}L`}
        trend={`${Math.round((todayStats.water/todayStats.waterGoal)*100)}% complete`}
        icon={<Droplets size={18} />}
        color='#06b6d4'
      />
    </div>
  );

  const ChallengeCard = () => (
    <Card hover={true} glass={true} style={{
      background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}10 100%)`,
      border: `2px solid ${theme.primary}20`,
      margin: '16px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `${theme.primary}10`,
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: theme.primaryGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadowMd
          }}>
            <Award size={24} color="white" />
          </div>
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: theme.textPrimary,
              marginBottom: '4px',
              margin: '0 0 4px 0',
              letterSpacing: '-0.025em'
            }}>
              6 Week Transformation
            </h3>
            <p style={{
              fontSize: '14px',
              color: theme.textSecondary,
              margin: 0,
              fontWeight: '500'
            }}>
              Strength & Conditioning Program
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: theme.primary,
            fontWeight: '600'
          }}>
            <Users size={16} />
            <span>{todayStats.workoutStreak}k+ Active Users</span>
          </div>
          <GradientButton 
            onClick={() => setActiveTab('workout')}
            style={{ 
              padding: '12px 24px', 
              fontSize: '15px',
              fontWeight: '700',
              borderRadius: '16px',
              boxShadow: theme.shadowMd
            }}
          >
            Start Challenge
          </GradientButton>
        </div>
      </div>
    </Card>
  );

  const TodaysSchedule = () => (
    <Card hover={true} style={{ marginTop: '8px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '20px',
          color: theme.textPrimary,
          fontWeight: '800',
          margin: 0,
          letterSpacing: '-0.025em'
        }}>
          Today's Schedule
        </h3>
        <Calendar size={20} color={theme.textSecondary} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: `${theme.primary}08`,
          borderRadius: '16px',
          border: `1px solid ${theme.primary}15`,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${theme.primary}12`;
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${theme.primary}08`;
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: theme.primary,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Dumbbell size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '700',
              fontSize: '16px',
              color: theme.textPrimary,
              margin: '0 0 4px 0'
            }}>
              Upper Body Workout
            </div>
            <div style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock3 size={14} />
              <span>45 minutes • 2:00 PM</span>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px',
          background: `${theme.success}08`,
          borderRadius: '16px',
          border: `1px solid ${theme.success}15`,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${theme.success}12`;
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${theme.success}08`;
          e.currentTarget.style.transform = 'translateX(0)';
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: theme.success,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Apple size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '700',
              fontSize: '16px',
              color: theme.textPrimary,
              margin: '0 0 4px 0'
            }}>
              Meal Prep Time
            </div>
            <div style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock3 size={14} />
              <span>Lunch prep • 12:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Home Page
  const HomePage = () => (
    <PageWrapper isActive={activeTab === 'home'}>
      <QuickStats />
      <ChallengeCard />
      <TodaysSchedule />
    </PageWrapper>
  );

  // Enhanced Food/Nutrition Page
  const NutritionPage = () => {
    const MacroOverview = () => (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        padding: '16px'
      }}>
        <MacroCard 
          IconComponent={Flame}
          title="Calories" 
          value={todayStats.calories}
          target={todayStats.caloriesGoal}
          color={theme.warning}
        />
        <MacroCard 
          IconComponent={Zap}
          title="Protein" 
          value={`${todayStats.protein}g`}
          target={todayStats.proteinGoal}
          color={theme.error}
        />
        <MacroCard 
          IconComponent={Apple}
          title="Carbs" 
          value={`${todayStats.carbs}g`}
          target={todayStats.carbsGoal}
          color={theme.warning}
        />
        <MacroCard 
          IconComponent={Droplets}
          title="Fats" 
          value={`${todayStats.fat}g`}
          target={todayStats.fatGoal}
          color={theme.success}
        />
      </div>
    );

    const MealLog = () => (
      <div style={{ padding: '0 16px' }}>
        <Card hover={true} style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: theme.textPrimary,
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              Today's Meals
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: `${theme.success}10`,
              borderRadius: '12px',
              border: `1px solid ${theme.success}20`
            }}>
              <Check size={16} color={theme.success} />
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: theme.success
              }}>
                {meals.length}/5 meals logged
              </span>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {meals.map((meal, index) => {
              const mealIcons = ['☀️', '🌤️', '🌅', '🌙'];
              const mealColors = [theme.warning, theme.primary, theme.success, theme.secondary];
              return (
                <div key={meal.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: `${mealColors[index % 4]}08`,
                  borderRadius: '16px',
                  border: `1px solid ${mealColors[index % 4]}15`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${mealColors[index % 4]}12`;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${mealColors[index % 4]}08`;
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: mealColors[index % 4],
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {mealIcons[index % 4]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: theme.textPrimary,
                      marginBottom: '4px',
                      margin: '0 0 4px 0'
                    }}>
                      {meal.name}
                    </h4>
                    <div style={{
                      fontSize: '13px',
                      color: theme.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={14} />
                        {meal.calories} cal
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock3 size={14} />
                        {meal.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={20} color={theme.textLight} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );

    return (
      <PageWrapper isActive={activeTab === 'nutrition'}>
        <MacroOverview />
        <MealLog />
        <button 
          onClick={addMeal}
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: theme.primaryGradient,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: theme.shadowLg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            e.currentTarget.style.boxShadow = theme.shadowXl;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = theme.shadowLg;
          }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </PageWrapper>
    );
  };

  // Enhanced Workout/Training Page
  const WorkoutPage = () => {
    const [completedSets, setCompletedSets] = useState({});
    const [currentExercise, setCurrentExercise] = useState(0);
    const [restTimer, setRestTimer] = useState(0);
    const [exerciseNotes, setExerciseNotes] = useState({});
    const [activeNoteModal, setActiveNoteModal] = useState(null);
    const [noteInput, setNoteInput] = useState('');
    
    const workoutExercises = [
      {
        name: 'Bench Press',
        muscleGroup: 'Chest',
        description: 'Compound movement for chest development',
        icon: '💪',
        color: theme.error,
        sets: [
          { weight: '60 kg', reps: '12 reps', restTime: '90s' },
          { weight: '65 kg', reps: '10 reps', restTime: '90s' },
          { weight: '65 kg', reps: '8 reps', restTime: '120s' }
        ]
      },
      {
        name: 'Shoulder Press',
        muscleGroup: 'Shoulders', 
        description: 'Isolation movement for deltoid strength',
        icon: '🏋️',
        color: theme.primary,
        sets: [
          { weight: '12 kg', reps: '12 reps', restTime: '60s' },
          { weight: '12 kg', reps: '10 reps', restTime: '60s' },
          { weight: '12 kg', reps: '10 reps', restTime: '90s' }
        ]
      },
      {
        name: 'Incline Dumbbell Press',
        muscleGroup: 'Upper Chest',
        description: 'Upper chest isolation and strength',
        icon: '🎯',
        color: theme.warning,
        sets: [
          { weight: '20 kg', reps: '12 reps', restTime: '75s' },
          { weight: '22.5 kg', reps: '10 reps', restTime: '75s' },
          { weight: '22.5 kg', reps: '8 reps', restTime: '90s' }
        ]
      }
    ];

    const handleNoteSubmit = (exerciseName) => {
      if (noteInput.trim()) {
        setExerciseNotes(prev => ({
          ...prev,
          [exerciseName]: noteInput.trim()
        }));
      }
      setActiveNoteModal(null);
      setNoteInput('');
    };

    const ExerciseItem = ({ exercise, index, isActive }) => {
      const completedSetsCount = exercise.sets.filter((_, setIndex) => 
        completedSets[`${exercise.name}-${setIndex}`]
      ).length;
      const isCompleted = completedSetsCount === exercise.sets.length;
      const hasNotes = exerciseNotes[exercise.name];
      
      return (
        <div style={{ marginBottom: '12px', padding: '0 8px' }}>
          <Card hover={true} style={{
            background: isActive ? `${exercise.color}08` : theme.cardBg,
            border: `2px solid ${isActive ? exercise.color + '40' : theme.borderLight}`,
            position: 'relative',
            overflow: 'hidden',
            padding: '16px'
          }}>
            {/* Progress indicator */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${(completedSetsCount / exercise.sets.length) * 100}%`,
              height: '3px',
              background: `linear-gradient(90deg, ${exercise.color} 0%, ${exercise.color}80 100%)`,
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.6s ease'
            }} />
            
            {/* Compact Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: `${exercise.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  border: `2px solid ${exercise.color}30`
                }}>
                  {exercise.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: theme.textPrimary,
                      margin: 0,
                      letterSpacing: '-0.025em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {exercise.name}
                    </h3>
                    {hasNotes && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        background: `${theme.warning}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}>
                        📝
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px'
                  }}>
                    <span style={{
                      background: `${exercise.color}15`,
                      color: exercise.color,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {exercise.muscleGroup}
                    </span>
                    <span style={{
                      color: theme.textLight,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '500'
                    }}>
                      <Target size={12} />
                      {completedSetsCount}/{exercise.sets.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Notes Button */}
                <button
                  onClick={() => {
                    setActiveNoteModal(exercise.name);
                    setNoteInput(exerciseNotes[exercise.name] || '');
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    border: `2px solid ${hasNotes ? theme.warning : theme.border}`,
                    background: hasNotes ? `${theme.warning}10` : theme.cardBg,
                    color: hasNotes ? theme.warning : theme.textLight,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}
                >
                  📝
                </button>
                
                {isCompleted && (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: theme.success,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={20} color="white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Compact Sets Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 1fr 50px 40px',
              gap: '8px',
              alignItems: 'center',
              marginBottom: '8px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${theme.border}`,
              fontSize: '12px',
              fontWeight: '600',
              color: theme.textLight
            }}>
              <div>SET</div>
              <div style={{ textAlign: 'center' }}>WEIGHT</div>
              <div style={{ textAlign: 'center' }}>REPS</div>
              <div style={{ textAlign: 'center' }}>REST</div>
              <div style={{ textAlign: 'center' }}>✓</div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {exercise.sets.map((set, setIndex) => {
                const setId = `${exercise.name}-${setIndex}`;
                const isSetCompleted = completedSets[setId];
                
                return (
                  <div key={setIndex} style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr 1fr 50px 40px',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '8px 6px',
                    background: isSetCompleted ? `${theme.success}10` : theme.lightBg,
                    borderRadius: '8px',
                    border: `1px solid ${isSetCompleted ? theme.success + '30' : theme.border}`,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: isSetCompleted ? theme.success : exercise.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '12px'
                    }}>
                      {setIndex + 1}
                    </div>
                    
                    <div style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.border}`,
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: theme.textPrimary
                    }}>
                      {set.weight}
                    </div>
                    
                    <div style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.border}`,
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: theme.textPrimary
                    }}>
                      {set.reps}
                    </div>
                    
                    <div style={{
                      fontSize: '11px',
                      color: theme.textLight,
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {set.restTime}
                    </div>
                    
                    <button
                      onClick={() => setCompletedSets(prev => ({
                        ...prev,
                        [setId]: !prev[setId]
                      }))}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: `2px solid ${isSetCompleted ? theme.success : exercise.color}`,
                        background: isSetCompleted ? theme.success : theme.cardBg,
                        color: isSetCompleted ? 'white' : exercise.color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSetCompleted) {
                          e.currentTarget.style.background = `${exercise.color}10`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSetCompleted) {
                          e.currentTarget.style.background = theme.cardBg;
                        }
                      }}
                    >
                      {isSetCompleted ? <Check size={16} strokeWidth={3} /> : ''}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Show notes if they exist */}
            {hasNotes && (
              <div style={{
                marginTop: '12px',
                padding: '10px 12px',
                background: `${theme.warning}08`,
                border: `1px solid ${theme.warning}20`,
                borderRadius: '8px'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: theme.warning,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  💭 NOTES
                </div>
                <div style={{
                  fontSize: '13px',
                  color: theme.textPrimary,
                  lineHeight: '1.4',
                  fontStyle: 'italic'
                }}>
                  {exerciseNotes[exercise.name]}
                </div>
              </div>
            )}
          </Card>
        </div>
      );
    };

    const totalSets = workoutExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedTotal = Object.values(completedSets).filter(Boolean).length;
    const workoutProgress = (completedTotal / totalSets) * 100;
    
    return (
      <PageWrapper isActive={activeTab === 'workout'}>
        {/* Workout Progress Card */}
        <Card hover={false} style={{
          background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}10 100%)`,
          border: `2px solid ${theme.primary}20`,
          margin: '16px',
          marginTop: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: theme.primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadowMd
            }}>
              <Dumbbell size={28} color="white" strokeWidth={2} />
            </div>
            <div>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '4px',
                margin: '0 0 4px 0',
                letterSpacing: '-0.025em'
              }}>
                Push Day A
              </h2>
              <p style={{
                color: theme.textSecondary,
                fontSize: '14px',
                margin: 0,
                fontWeight: '500'
              }}>
                Chest, Shoulders & Triceps • 45-60 minutes
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            background: theme.border,
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{
              width: `${workoutProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
              borderRadius: '4px',
              transition: 'width 0.6s ease'
            }} />
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              color: theme.textSecondary,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {completedTotal}/{totalSets} sets completed
            </span>
            <span style={{
              color: theme.primary,
              fontSize: '14px',
              fontWeight: '700'
            }}>
              {Math.round(workoutProgress)}% complete
            </span>
          </div>
        </Card>
        
        <div style={{ padding: '0 4px' }}>
          {workoutExercises.map((exercise, index) => (
            <ExerciseItem 
              key={index} 
              exercise={exercise} 
              index={index}
              isActive={currentExercise === index}
            />
          ))}
        </div>
        
        {/* Note Modal */}
        {activeNoteModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: theme.cardBg,
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '350px',
              boxShadow: theme.shadowXl,
              border: `1px solid ${theme.border}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: theme.textPrimary,
                  margin: 0,
                  letterSpacing: '-0.025em'
                }}>
                  💭 Exercise Notes
                </h3>
                <button
                  onClick={() => {
                    setActiveNoteModal(null);
                    setNoteInput('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme.textLight,
                    padding: '4px'
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div style={{
                fontSize: '14px',
                color: theme.textSecondary,
                marginBottom: '16px',
                padding: '12px 16px',
                background: theme.lightBg,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`
              }}>
                <strong>{activeNoteModal}</strong>
              </div>
              
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add notes about form, weight, difficulty, improvements..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '16px',
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  fontSize: '14px',
                  color: theme.textPrimary,
                  background: theme.cardBg,
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
                onFocus={(e) => {
                  e.target.style.border = `2px solid ${theme.primary}`;
                }}
                onBlur={(e) => {
                  e.target.style.border = `2px solid ${theme.border}`;
                }}
                autoFocus
              />
              
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => handleNoteSubmit(activeNoteModal)}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: theme.primaryGradient,
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: theme.shadowMd,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = theme.shadowLg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = theme.shadowMd;
                  }}
                >
                  💾 Save Note
                </button>
                
                <button
                  onClick={() => {
                    setActiveNoteModal(null);
                    setNoteInput('');
                  }}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: theme.lightBg,
                    color: theme.textSecondary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '16px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '0 16px', marginBottom: '20px' }}>
          <GradientButton
            onClick={() => {
              if (completedTotal === totalSets) {
                alert('Congratulations! Workout completed! 🎉\n\nGreat job pushing through all sets!');
              } else {
                alert(`You still have ${totalSets - completedTotal} sets remaining. Keep going!`);
              }
            }}
            style={{
              background: completedTotal === totalSets ? theme.successGradient : theme.primaryGradient,
              width: '100%',
              boxShadow: completedTotal === totalSets ? theme.shadowLg : theme.shadowMd,
              padding: '16px',
              fontSize: '16px',
              fontWeight: '800',
              borderRadius: '16px'
            }}
          >
            {completedTotal === totalSets ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={20} strokeWidth={3} />
                Workout Complete!
              </div>
            ) : (
              `Continue Workout (${completedTotal}/${totalSets})`
            )}
          </GradientButton>
        </div>
      </PageWrapper>
    );
  };

  // Enhanced Progress Page
  const ProgressPage = () => {
    const [selectedMetric, setSelectedMetric] = useState('weight');
    const [photoUploadHover, setPhotoUploadHover] = useState(false);
    
    const progressMetrics = [
      {
        id: 'weight',
        title: 'Current Weight',
        value: todayStats.weight,
        unit: 'kg',
        trend: '↓ 1.2 kg',
        period: 'this month',
        color: theme.primary,
        icon: Activity,
        isPositive: false
      },
      {
        id: 'bodyfat',
        title: 'Body Fat',
        value: todayStats.bodyFat,
        unit: '%',
        trend: '↓ 1.5%',
        period: 'this month',
        color: theme.warning,
        icon: Target,
        isPositive: false
      },
      {
        id: 'muscle',
        title: 'Muscle Mass',
        value: '45.2',
        unit: 'kg',
        trend: '↑ 0.8 kg',
        period: 'this month',
        color: theme.success,
        icon: Zap,
        isPositive: true
      },
      {
        id: 'bmi',
        title: 'BMI',
        value: '21.8',
        unit: '',
        trend: 'Healthy range',
        period: '',
        color: theme.success,
        icon: Heart,
        isPositive: true
      }
    ];
    
    const ProgressStats = () => (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        padding: '16px'
      }}>
        {progressMetrics.map((metric) => {
          const IconComponent = metric.icon;
          const isSelected = selectedMetric === metric.id;
          
          return (
            <div 
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              style={{
                background: isSelected ? `${metric.color}08` : theme.cardBg,
                borderRadius: '20px',
                padding: '20px',
                boxShadow: isSelected ? theme.shadowLg : theme.shadowMd,
                border: `2px solid ${isSelected ? metric.color + '40' : theme.borderLight}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.shadowLg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadowMd;
                }
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `${metric.color}10`,
                zIndex: 0
              }} />
              
              <div style={{
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    color: theme.textLight,
                    margin: 0,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {metric.title}
                  </h4>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '12px',
                    background: `${metric.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={18} color={metric.color} strokeWidth={2} />
                  </div>
                </div>
                
                <div style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: theme.textPrimary,
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                  lineHeight: '1.1'
                }}>
                  {metric.value} <span style={{
                    fontSize: '16px',
                    color: theme.textSecondary,
                    fontWeight: '500'
                  }}>{metric.unit}</span>
                </div>
                
                <div style={{
                  fontSize: '13px',
                  color: metric.isPositive ? theme.success : theme.primary,
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={14} strokeWidth={2} />
                  {metric.trend} {metric.period}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

    const PhotoUpload = () => (
      <Card 
        hover={false}
        style={{
          background: photoUploadHover ? `${theme.primary}12` : `${theme.primary}08`,
          border: `2px dashed ${photoUploadHover ? theme.primary : theme.primary + '60'}`,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={() => setPhotoUploadHover(true)}
        onMouseLeave={() => setPhotoUploadHover(false)}
      >
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${theme.primary}15`,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: photoUploadHover ? theme.primary : `${theme.primary}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: photoUploadHover ? 'scale(1.05)' : 'scale(1)'
          }}>
            <Camera size={32} color={photoUploadHover ? 'white' : theme.primary} strokeWidth={2} />
          </div>
          
          <h3 style={{
            color: theme.textPrimary,
            fontSize: '20px',
            fontWeight: '800',
            marginBottom: '8px',
            margin: '0 0 8px 0',
            letterSpacing: '-0.025em'
          }}>
            Upload Progress Photo
          </h3>
          
          <p style={{
            color: theme.textSecondary,
            fontSize: '15px',
            margin: '0 0 16px 0',
            fontWeight: '500'
          }}>
            Track your visual transformation journey
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '16px'
          }}>
            <div style={{
              padding: '8px 16px',
              background: `${theme.primary}15`,
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              color: theme.primary
            }}>
              📷 Front View
            </div>
            <div style={{
              padding: '8px 16px',
              background: `${theme.success}15`,
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              color: theme.success
            }}>
              🦵 Side View
            </div>
          </div>
        </div>
      </Card>
    );

    const ProgressChart = () => {
      const chartData = [
        { month: 'Jan', weight: 101.2, muscle: 43.8, bodyfat: 16.2 },
        { month: 'Feb', weight: 100.8, muscle: 44.1, bodyfat: 15.8 },
        { month: 'Mar', weight: 100.1, muscle: 44.6, bodyfat: 15.2 },
        { month: 'Apr', weight: 99.7, muscle: 45.0, bodyfat: 14.8 },
        { month: 'May', weight: 99.0, muscle: 45.2, bodyfat: 14.0 }
      ];
      
      const selectedData = progressMetrics.find(m => m.id === selectedMetric);
      
      return (
        <Card hover={true} style={{ marginTop: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: theme.textPrimary,
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              {selectedData?.title} Trend
            </h3>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {['weight', 'muscle', 'bodyfat'].map((metric) => {
                const metricData = progressMetrics.find(m => m.id === metric);
                const isActive = selectedMetric === metric;
                return (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isActive ? metricData?.color : theme.lightBg,
                      color: isActive ? 'white' : theme.textSecondary,
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {metricData?.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div style={{
            height: '180px',
            background: `linear-gradient(to top, ${selectedData?.color}10, transparent)`,
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${selectedData?.color}20`
          }}>
            {/* Simulated chart area */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70%',
              background: `linear-gradient(90deg, ${selectedData?.color}60 0%, ${selectedData?.color} 50%, ${selectedData?.color}80 100%)`,
              clipPath: 'polygon(0 100%, 15% 75%, 30% 80%, 45% 60%, 60% 55%, 75% 40%, 90% 35%, 100% 25%, 100% 100%)',
              opacity: 0.8
            }} />
            
            {/* Data points */}
            {[15, 30, 45, 60, 75, 90].map((pos, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${pos}%`,
                  bottom: `${25 + Math.random() * 45}%`,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedData?.color,
                  border: `2px solid white`,
                  boxShadow: theme.shadowMd
                }}
              />
            ))}
            
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              color: theme.textSecondary,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Jan - May 2024
            </div>
          </div>
          
          <div style={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: theme.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '3px',
                borderRadius: '2px',
                background: selectedData?.color
              }} />
              5-month progress
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: selectedData?.isPositive ? theme.success : theme.primary
            }}>
              {selectedData?.trend} total change
            </div>
          </div>
        </Card>
      );
    };

    return (
      <PageWrapper isActive={activeTab === 'progress'}>
        <ProgressStats />
        <PhotoUpload />
        <ProgressChart />
      </PageWrapper>
    );
  };

  // Enhanced Chat Page
  const ChatPage = () => {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [messages] = useState([
      { 
        id: 1, 
        sender: "coach", 
        text: "Hey! Great job on completing your workout yesterday! 💪 How are you feeling today?", 
        time: "9:15 AM",
        type: 'text',
        reactions: ['🔥', '🙏']
      },
      { 
        id: 2, 
        sender: "me", 
        text: "Hi! Feeling a bit sore but in a good way! Ready for today's session", 
        time: "9:18 AM",
        type: 'text'
      },
      { 
        id: 3, 
        sender: "coach", 
        text: "That's the spirit! I've updated your workout plan for today. It's a lighter upper body session to help with recovery.", 
        time: "9:20 AM",
        type: 'text',
        hasAttachment: true
      },
      { 
        id: 4, 
        sender: "coach", 
        text: "Also, don't forget to log your meals. I noticed you missed dinner yesterday. Proper nutrition is key! 🥗", 
        time: "9:21 AM",
        type: 'text',
        reactions: ['👍']
      },
      { 
        id: 5, 
        sender: "me", 
        text: "You're right! I'll make sure to log everything today. Quick question - should I increase my protein intake?", 
        time: "9:25 AM",
        type: 'text',
        isRead: true
      }
    ]);

    const ChatHeader = () => (
      <div style={{
        background: `linear-gradient(135deg, ${theme.cardBg} 0%, ${theme.lightBg} 100%)`,
        padding: '20px',
        borderBottom: `1px solid ${theme.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${theme.primary}08`,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: theme.primaryGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '800',
            fontSize: '20px',
            boxShadow: theme.shadowMd,
            position: 'relative'
          }}>
            {clientData?.trainer_name?.[0] || 'T'}
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: theme.success,
              border: '2px solid white'
            }} />
          </div>
          
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '800',
              color: theme.textPrimary,
              margin: '0 0 4px 0',
              letterSpacing: '-0.025em'
            }}>
              {clientData?.trainer_name || 'Your Trainer'}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: theme.success,
                animation: 'pulse 2s infinite'
              }} />
              <p style={{
                fontSize: '14px',
                color: theme.success,
                margin: 0,
                fontWeight: '600'
              }}>
                Online now
              </p>
            </div>
            {isTyping && (
              <div style={{
                fontSize: '12px',
                color: theme.textLight,
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '2px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: theme.textLight,
                  animation: 'pulse 1.5s infinite'
                }} />
                typing...
              </div>
            )}
          </div>
        </div>
      </div>
    );

    const MessagesContainer = () => (
      <div style={{
        padding: '20px',
        height: 'calc(100vh - 280px)',
        overflowY: 'auto'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            ...(msg.sender === 'me' ? { flexDirection: 'row-reverse' } : {})
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              lineHeight: '1.4',
              ...(msg.sender === 'me' ? {
                background: theme.primaryGradient,
                color: 'white',
                borderBottomRightRadius: '5px'
              } : {
                background: 'white',
                color: theme.textPrimary,
                borderBottomLeftRadius: '5px'
              })
            }}>
              {msg.text}
              <div style={{
                fontSize: '11px',
                color: msg.sender === 'me' ? 'rgba(255,255,255,0.8)' : theme.textLight,
                marginTop: '5px'
              }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    const ChatInput = () => (
      <div style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '390px',
        background: theme.cardBg,
        padding: '16px',
        borderTop: `1px solid ${theme.borderLight}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Type a message..."
              style={{
                width: '100%',
                padding: '16px 20px',
                border: `2px solid ${inputFocused ? theme.primary : theme.border}`,
                borderRadius: '20px',
                fontSize: '15px',
                outline: 'none',
                background: theme.cardBg,
                color: theme.textPrimary,
                transition: 'all 0.3s ease',
                boxShadow: inputFocused ? theme.shadowMd : 'none'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  setIsTyping(true);
                  setTimeout(() => setIsTyping(false), 2000);
                  setMessage('');
                }
              }}
            />
            
            {message.trim() && (
              <div style={{
                position: 'absolute',
                right: '60px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                gap: '8px'
              }}>
                <button style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: theme.lightBg,
                  color: theme.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  😊
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              if (message.trim()) {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
                setMessage('');
              }
            }}
            disabled={!message.trim()}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: message.trim() ? theme.primaryGradient : theme.textLight,
              border: 'none',
              color: 'white',
              cursor: message.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: message.trim() ? theme.shadowMd : 'none'
            }}
            onMouseEnter={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = theme.shadowLg;
              }
            }}
            onMouseLeave={(e) => {
              if (message.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadowMd;
              }
            }}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '12px'
        }}>
          {[
            { icon: '📷', label: 'Photo' },
            { icon: '🍽️', label: 'Meal' },
            { icon: '📊', label: 'Progress' }
          ].map((item, index) => (
            <button key={index} style={{
              padding: '8px 12px',
              borderRadius: '16px',
              border: 'none',
              background: theme.lightBg,
              color: theme.textSecondary,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${theme.primary}10`;
              e.currentTarget.style.color = theme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.lightBg;
              e.currentTarget.style.color = theme.textSecondary;
            }}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );

    return (
      <PageWrapper isActive={activeTab === 'chat'}>
        <MessagesContainer />
        <ChatInput />
      </PageWrapper>
    );
  };

  const renderContent = () => {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 200px)',
        overflow: 'hidden'
      }}>
        <HomePage />
        <NutritionPage />
        <WorkoutPage />
        <ProgressPage />
        <ChatPage />
      </div>
    );
  };

  // Render PIN entry screen for public client access
  if (!isAuthenticated && clientId && !trainerAccess) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <MobileContainer>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 100px)',
            padding: '40px 20px'
          }}>
            <Card style={{ width: '100%', maxWidth: '320px' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: theme.primaryGradient,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                }}>
                  <Dumbbell size={40} color="white" />
                </div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  Welcome Back
                </h1>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '16px',
                  margin: 0
                }}>
                  Enter your PIN to access your dashboard
                </p>
              </div>
              
              <form onSubmit={handlePinSubmit}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    value={pinInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPinInput(value);
                      if (pinError) setPinError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '20px',
                      fontSize: '24px',
                      textAlign: 'center',
                      border: pinError ? '2px solid #ef4444' : `2px solid ${theme.border}`,
                      borderRadius: '16px',
                      background: pinError ? '#fef2f2' : 'white',
                      letterSpacing: '0.3em',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    placeholder="• • • • • •"
                    autoFocus
                  />
                  {pinInput.length === 6 && (
                    <div style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: theme.success
                    }}>
                      <Check size={24} />
                    </div>
                  )}
                </div>
                
                {pinError && (
                  <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      {pinError}
                    </p>
                  </div>
                )}

                <GradientButton
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '16px',
                    opacity: pinInput.length === 6 ? 1 : 0.5,
                    cursor: pinInput.length === 6 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Access Dashboard
                </GradientButton>
              </form>
            </Card>
          </div>
        </MobileContainer>
      </div>
    );
  }

  // Persistent header component
  const PersistentHeader = () => {
    const getPageTitle = () => {
      switch(activeTab) {
        case 'home':
          return { 
            title: `Welcome back, ${clientData?.name || 'Champion'}! 💪`, 
            subtitle: "Let's crush your goals today" 
          };
        case 'nutrition':
          return { 
            title: "Nutrition Tracker", 
            subtitle: "Track your daily intake" 
          };
        case 'workout':
          return { 
            title: "Training Zone", 
            subtitle: "Your workout companion" 
          };
        case 'progress':
          return { 
            title: "Your Progress", 
            subtitle: "Track your transformation" 
          };
        case 'chat':
          return { 
            title: "Messages", 
            subtitle: "Chat with your trainer" 
          };
        default:
          return { title: "FitPortal", subtitle: "" };
      }
    };
    
    const { title, subtitle } = getPageTitle();
    
    return (
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        background: theme.primaryGradient,
        padding: '20px',
        color: 'white',
        boxShadow: theme.shadowLg,
        borderRadius: '0 0 24px 24px',
        marginBottom: '8px'
      }}>
        <div key={activeTab}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '8px',
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: '1.1'
          }}>
            {title}
          </h1>
          <p style={{
            opacity: 0.9,
            fontSize: '15px',
            margin: 0,
            fontWeight: '500'
          }}>
            {subtitle}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background
    }}>
      <MobileContainer>
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: theme.lightBg,
          minHeight: '100vh'
        }}>
          <PersistentHeader />
          <div style={{
            position: 'relative',
            overflow: 'hidden'
          }}>
            {renderContent()}
          </div>
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </MobileContainer>
    </div>
  );
};

export default ClientMobileDashboard;