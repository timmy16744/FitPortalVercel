import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Grid,
  List,
  Star,
  X,
  MoreVertical,
  TrendingUp,
  Activity,
  Target,
  Award,
  Clock,
  ChevronRight,
  User,
  Loader,
  Dumbbell,
  Save,
  Edit3,
  Copy,
  Trash2,
  Timer,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import apiService from '../../services/api';
import EnhancedWorkoutBuilder from './EnhancedWorkoutBuilder';
import WorkoutManagement from './WorkoutManagement';

// Virtual List Component for Performance
const VirtualizedExerciseList = React.memo(({ exercises, onAdd, onInfo, getBodyPartColor }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef(null);
  const ITEM_HEIGHT = 92; // Approx height of each card
  const BUFFER_SIZE = 5; // Extra items to render outside viewport

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const containerHeight = e.target.clientHeight;
    
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + (BUFFER_SIZE * 2);
    const end = Math.min(exercises.length, start + visibleCount);
    
    setVisibleRange({ start, end });
  }, [exercises.length]);

  const visibleExercises = exercises.slice(visibleRange.start, visibleRange.end);
  const totalHeight = exercises.length * ITEM_HEIGHT;
  const offsetY = visibleRange.start * ITEM_HEIGHT;

  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '100%', 
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleExercises.map((exercise, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                bodyPartColors={getBodyPartColor(exercise.bodyPart)}
                onAdd={onAdd}
                onInfo={onInfo}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Enhanced Exercise Card Component
const ExerciseCard = React.memo(({ exercise, bodyPartColors, onAdd, onInfo }) => {
  const cardHoverHandlers = useMemo(() => ({
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
      e.currentTarget.style.boxShadow = `0 8px 25px ${bodyPartColors.border}25, 0 4px 12px ${bodyPartColors.accent}15`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = `0 2px 8px ${bodyPartColors.border}10`;
    }
  }), [bodyPartColors.border, bodyPartColors.accent]);

  return (
    <div style={{
      backgroundColor: 'var(--app-container)',
      borderRadius: '12px',
      padding: '14px',
      margin: '6px 0',
      border: `1px solid ${bodyPartColors.border}25`,
      borderLeft: `4px solid ${bodyPartColors.accent}`,
      background: `linear-gradient(135deg, ${bodyPartColors.bg} 0%, var(--app-container) 25%, var(--app-container) 100%)`,
      boxShadow: `0 2px 8px ${bodyPartColors.border}10`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      height: '80px', // Fixed height for virtual scrolling
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }} {...cardHoverHandlers}>
      {/* Floating Body Part Bubble - Top Right */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: bodyPartColors.accent,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '9px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: `0 2px 8px ${bodyPartColors.accent}30`,
        zIndex: 1
      }}>
        {exercise.bodyPart}
      </div>

      {/* Exercise Name */}
      <div style={{ marginBottom: '4px', paddingRight: '70px' }}>
        <h4 style={{ 
          color: 'var(--main-color)', 
          margin: '0', 
          fontSize: '14px', 
          fontWeight: '600',
          lineHeight: '1.2',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          maxHeight: '28px'
        }}>
          {exercise.name}
        </h4>
      </div>

      {/* Target Info */}
      <div style={{ marginBottom: '4px', minHeight: '14px' }}>
        <span style={{ 
          color: bodyPartColors.accent, 
          fontSize: '11px', 
          fontWeight: '600',
          textTransform: 'capitalize',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block'
        }}>
          {exercise.target}
        </span>
      </div>
        
      {/* Action Buttons Row */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(exercise);
          }}
          style={{
            flex: 1,
            backgroundColor: bodyPartColors.accent,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            transition: 'all 0.2s',
            minHeight: '28px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${bodyPartColors.accent}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={14} />
          Add to Workout
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInfo(exercise);
          }}
          style={{
            backgroundColor: 'transparent',
            border: `2px solid ${bodyPartColors.border}`,
            borderRadius: '6px',
            color: bodyPartColors.accent,
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            padding: '5px 8px',
            transition: 'all 0.2s',
            minHeight: '28px',
            minWidth: '50px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = bodyPartColors.bg;
            e.currentTarget.style.borderColor = bodyPartColors.accent;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = bodyPartColors.border;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Info size={12} />
          Info
        </button>
      </div>
    </div>
  );
});

const ElegantTrainerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showMessages, setShowMessages] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Backend data state
  const [clients, setClients] = useState([]);
  const [clientStats, setClientStats] = useState({ activeClients: 0, newClients: 0, archivedClients: 0, totalClients: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [workoutStats, setWorkoutStats] = useState({ totalWorkouts: 0, completionRate: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Additional state for interfaces
  const [exercises, setExercises] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [exerciseFilter, setExerciseFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [newClientData, setNewClientData] = useState({ name: '', email: '', phone: '', goals: '' });
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Program management state
  const [showProgramAssignModal, setShowProgramAssignModal] = useState(false);
  const [selectedClientForProgram, setSelectedClientForProgram] = useState(null);
  const [clientActivePrograms, setClientActivePrograms] = useState({});
  const [workoutSessions, setWorkoutSessions] = useState({});

  // Workout logging state
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedClientForWorkout, setSelectedClientForWorkout] = useState(null);
  const [currentWorkoutData, setCurrentWorkoutData] = useState(null);

  // Workout builder state
  const [workoutBuilder, setWorkoutBuilder] = useState({
    name: '',
    description: '',
    targetMuscleGroups: [],
    estimatedDuration: 60,
    exercises: []
  });

  // Debounce search filter for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilter(exerciseFilter);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [exerciseFilter]);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedExerciseForBuilder, setSelectedExerciseForBuilder] = useState(null);
  const [showExerciseInfo, setShowExerciseInfo] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Debounce search filter for better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilter(exerciseFilter);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [exerciseFilter]);

  // Load data from backend
  useEffect(() => {
    loadDashboardData();
  }, []);

  const testAuthentication = async () => {
    try {
      console.log('Testing direct API call to /clients with Basic Auth');
      // Try a simple authenticated request directly
      const response = await apiService.getClients('all');
      console.log('Direct API test successful:', !!response);
      return true;
    } catch (error) {
      console.error('Direct API test failed:', error);
      
      // Also try the login endpoint
      console.log('Testing authentication with /api/login');
      const result = await apiService.login('trainer', 'duck');
      console.log('Login test result:', result);
      return result.success;
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting dashboard data load...');

      // Test auth first, but continue even if it fails
      await testAuthentication().catch(console.warn);

      // Load all data in parallel
      const [
        clientsData,
        clientStatsData,
        activitiesData,
        workoutStatsData,
        revenueStatsData,
        exercisesData,
        templatesData,
        programsData
      ] = await Promise.allSettled([
        apiService.getClients('all'),
        apiService.getClientStats(),
        apiService.getRecentActivity(),
        apiService.getWorkoutStats(),
        apiService.getRevenueData(),
        apiService.getExercises(),
        apiService.getWorkoutTemplates(),
        apiService.getPrograms()
      ]);

      // Process clients data
      if (clientsData.status === 'fulfilled') {
        const clientList = clientsData.value.map((client, index) => ({
          id: client.id,
          name: client.name || `${client.first_name || 'Unknown'} ${client.last_name || 'Client'}`,
          program: client.current_program?.name || 'No Program Assigned',
          progress: Math.floor(Math.random() * 100), // Calculate from workout completion
          lastActive: client.last_active || 'Never',
          avatar: apiService.getClientInitials(client),
          daysLeft: client.program_days_remaining || 30,
          color: `project-box-${(index % 6) + 1}`,
          workoutsCompleted: client.total_workouts || 0,
          nutrition: client.nutrition_status || 'Not Tracked',
          archived: client.archived || false
        }));
        setClients(clientList);
      }

      // Process client stats
      if (clientStatsData.status === 'fulfilled') {
        setClientStats(clientStatsData.value);
      }

      // Process recent activities
      if (activitiesData.status === 'fulfilled') {
        setRecentActivities(activitiesData.value);
      }

      // Process workout stats
      if (workoutStatsData.status === 'fulfilled') {
        setWorkoutStats(workoutStatsData.value);
      }

      // Process revenue data
      if (revenueStatsData.status === 'fulfilled') {
        setRevenueData(revenueStatsData.value.weeklyRevenue || []);
      }

      // Process exercises data
      if (exercisesData.status === 'fulfilled') {
        setExercises(exercisesData.value || []);
      }

      // Process workout templates data
      if (templatesData.status === 'fulfilled') {
        setWorkoutTemplates(templatesData.value || []);
      }

      // Process programs data
      if (programsData.status === 'fulfilled') {
        setPrograms(programsData.value || []);
      }

      // Load active programs for all clients
      if (clientsData.status === 'fulfilled') {
        const programPromises = clientsData.value.map(async (client) => {
          try {
            const activeProgram = await apiService.getClientActiveProgram(client.id);
            return { clientId: client.id, program: activeProgram };
          } catch (error) {
            return { clientId: client.id, program: null };
          }
        });

        const activeProgramsResults = await Promise.allSettled(programPromises);
        const activeProgramsMap = {};
        activeProgramsResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.program) {
            activeProgramsMap[result.value.clientId] = result.value.program;
          }
        });
        setClientActivePrograms(activeProgramsMap);
      }

    } catch (err) {
      setError(err.message);
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate chart data based on real client data
  const generateClientGrowthData = () => {
    if (!clients.length) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const now = new Date();
    
    return months.map((month, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const clientsInMonth = clients.filter(client => {
        const clientDate = new Date(client.created_at || '2024-01-01');
        return clientDate <= monthDate;
      }).length;
      
      return { name: month, clients: clientsInMonth };
    });
  };

  const generateWorkoutCompletionData = () => {
    // Mock weekly completion data - would need backend aggregation for real data
    return [
      { name: 'Mon', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Tue', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Wed', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Thu', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Fri', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Sat', completed: Math.floor(Math.random() * 20) + 80 },
      { name: 'Sun', completed: Math.floor(Math.random() * 20) + 80 }
    ];
  };

  // Get chart data
  const clientGrowthData = generateClientGrowthData();
  const workoutCompletionData = generateWorkoutCompletionData();

  // Sample messages
  const messages = [
    {
      id: 1,
      client: 'Sarah Johnson',
      message: 'I completed my morning workout!',
      time: '10:30 AM',
      avatar: 'SJ',
      starred: false
    },
    {
      id: 2,
      client: 'Mike Chen',
      message: 'Can we adjust my meal plan?',
      time: '9:15 AM',
      avatar: 'MC',
      starred: true
    },
    {
      id: 3,
      client: 'Emma Wilson',
      message: 'Hit a new PR on deadlifts!',
      time: 'Yesterday',
      avatar: 'EW',
      starred: false
    },
    {
      id: 4,
      client: 'Lisa Garcia',
      message: 'Ready for tomorrow\'s session',
      time: 'Yesterday',
      avatar: 'LG',
      starred: false
    }
  ];

  const sidebarLinks = [
    { icon: Home, id: 'dashboard' },
    { icon: Users, id: 'clients' },
    { icon: Activity, id: 'exercise-list' },
    { icon: Dumbbell, id: 'workout-builder' },
    { icon: Calendar, id: 'calendar' },
    { icon: MessageSquare, id: 'messages' },
    { icon: BarChart3, id: 'analytics' },
    { icon: Settings, id: 'settings' }
  ];

  const stats = [
    { number: clientStats.activeClients.toString(), type: 'Active', color: '#4ade80' },
    { number: clientStats.newClients.toString(), type: 'New', color: '#60a5fa' },
    { number: Math.max(0, clientStats.activeClients - Math.floor(clientStats.activeClients * 0.9)).toString(), type: 'At Risk', color: '#f59e0b' },
    { number: clientStats.archivedClients.toString(), type: 'Paused', color: '#ef4444' }
  ];

  const analyticsStats = [
    { label: 'Total Clients', value: clientStats.totalClients.toString(), icon: Users },
    { label: 'Workouts Completed', value: workoutStats.totalWorkouts.toString(), icon: Target },
    { label: 'Active Programs', value: clients.filter(c => c.program !== 'No Program Assigned').length.toString(), icon: Activity },
    { label: 'Success Rate', value: `${Math.floor(workoutStats.completionRate || 85)}%`, icon: Award }
  ];

  const renderClientCard = (client) => {
    return (
      <div key={client.id} className="project-box-wrapper">
        <div className={`project-box ${client.color}`}>
          <div className="project-box-header">
            <span>{client.lastActive}</span>
            <div className="more-wrapper">
              <button className="project-btn-more">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          <div className="project-box-content-header">
            <p className="box-content-header">{client.name}</p>
            <p className="box-content-subheader">{client.program}</p>
          </div>
          <div className="box-progress-wrapper">
            <p className="box-progress-header">Progress</p>
            <div className="box-progress-bar">
              <span 
                className="box-progress" 
                style={{
                  width: `${client.progress}%`,
                  backgroundColor: '#1f1c2e'
                }}
              ></span>
            </div>
            <p className="box-progress-percentage">{client.progress}%</p>
          </div>
          <div className="project-box-footer">
            <div className="participants">
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#1f1c2e',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {client.avatar}
              </div>
              <button className="add-participant" style={{ color: '#1f1c2e' }}>
                <Plus size={12} />
              </button>
            </div>
            <div className="days-left" style={{ color: '#1f1c2e' }}>
              {client.daysLeft} days left
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessageBox = (msg) => {
    return (
      <div key={msg.id} className="message-box">
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#1f1c2e',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {msg.avatar}
        </div>
        <div className="message-content">
          <div className="message-header">
            <h4 className="name">{msg.client}</h4>
            <div className="star-checkbox">
              <input type="checkbox" id={`star-${msg.id}`} defaultChecked={msg.starred} />
              <label htmlFor={`star-${msg.id}`}>
                <Star size={20} />
              </label>
            </div>
          </div>
          <p className="message-line">
            {msg.message}
          </p>
          <p className="message-line time">
            {msg.time}
          </p>
        </div>
      </div>
    );
  };

  // Get current date/time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render Analytics Dashboard
  const renderAnalyticsDashboard = () => (
    <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Analytics Dashboard
        </h2>
        <p style={{ color: 'var(--secondary-color)', fontSize: '16px' }}>
          {getCurrentDate()}, {getCurrentTime()}
        </p>
      </div>

      {/* Analytics Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {analyticsStats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--projects-section)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              backgroundColor: 'var(--link-color-active-bg)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--link-color-active)'
            }}>
              <stat.icon size={24} />
            </div>
            <h3 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
              {stat.value}
            </h3>
            <p style={{ color: 'var(--secondary-color)', fontSize: '14px', margin: 0 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Client Growth Chart */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--main-color)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Client Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={clientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--message-box-border)" />
              <XAxis dataKey="name" stroke="var(--secondary-color)" />
              <YAxis stroke="var(--secondary-color)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--projects-section)', 
                  border: '1px solid var(--message-box-border)',
                  borderRadius: '8px',
                  color: 'var(--main-color)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="clients" 
                stroke="var(--link-color-active-bg)" 
                strokeWidth={3}
                fill="var(--link-color-hover)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Completion Chart */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--main-color)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Weekly Workout Completion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--message-box-border)" />
              <XAxis dataKey="name" stroke="var(--secondary-color)" />
              <YAxis stroke="var(--secondary-color)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--projects-section)', 
                  border: '1px solid var(--message-box-border)',
                  borderRadius: '8px',
                  color: 'var(--main-color)'
                }} 
              />
              <Bar dataKey="completed" fill="var(--link-color-active-bg)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div style={{
        backgroundColor: 'var(--projects-section)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h3 style={{ color: 'var(--main-color)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Revenue Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--message-box-border)" />
            <XAxis dataKey="name" stroke="var(--secondary-color)" />
            <YAxis stroke="var(--secondary-color)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--projects-section)', 
                border: '1px solid var(--message-box-border)',
                borderRadius: '8px',
                color: 'var(--main-color)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--link-color-active-bg)" 
              strokeWidth={3}
              dot={{ fill: 'var(--link-color-active-bg)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'var(--projects-section)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ color: 'var(--main-color)', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Recent Client Activity
        </h3>
        <div>
          {recentActivities.map((activity) => (
            <div key={activity.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              padding: '16px 0',
              borderTop: activity.id === 1 ? 'none' : '1px solid var(--message-box-border)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--link-color-active-bg)',
                color: 'var(--link-color-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                marginRight: '16px',
                flexShrink: 0
              }}>
                {activity.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: 'var(--main-color)',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontWeight: '600' }}>{activity.client}</span> {activity.action}
                </div>
                <div style={{
                  color: 'var(--secondary-color)',
                  fontSize: '14px'
                }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Client Management Interface
  const renderClientManagement = () => (
    <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Client Management
        </h2>
        <button
          onClick={() => setShowNewClientForm(true)}
          style={{
            backgroundColor: 'var(--link-color-active-bg)',
            color: 'var(--link-color-active)',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}
        >
          <Plus size={16} />
          Add New Client
        </button>
      </div>

      {/* Client List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(0, 0, 0, 0.05)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>All Clients ({clients.length})</h3>
        
        {clients.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {clients.map((client) => (
              <div key={client.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
                marginBottom: '2px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.border = '1px solid rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginRight: '20px',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                }}>
                  {client.avatar}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#1f2937', margin: '0 0 6px 0', fontSize: '18px', fontWeight: '600' }}>
                    {client.name}
                  </h4>
                  <p style={{ color: '#6b7280', margin: '0 0 6px 0', fontSize: '14px' }}>
                    Program: {clientActivePrograms[client.id]?.template?.name || 'No Program Assigned'}
                  </p>
                  {clientActivePrograms[client.id] && (
                    <p style={{ color: '#6366f1', margin: '0 0 6px 0', fontSize: '13px', fontWeight: '500' }}>
                      Day {clientActivePrograms[client.id].current_day_index + 1} of {clientActivePrograms[client.id].template?.days?.length || 0}
                    </p>
                  )}
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
                    Last Active: {client.lastActive}
                  </p>
                </div>

                <div style={{ marginRight: '20px', textAlign: 'center' }}>
                  {clientActivePrograms[client.id] ? (
                    <div>
                      <div style={{ 
                        color: '#10b981', 
                        fontWeight: '600', 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981'
                        }}></div>
                        Active
                      </div>
                      <button
                        onClick={() => {
                          // Open client dashboard in new window
                          window.open(`/client/${client.id}/dashboard`, '_blank', 'width=1200,height=800');
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#4f46e5';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#6366f1';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Dashboard
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ 
                        color: '#f59e0b', 
                        fontWeight: '600', 
                        fontSize: '14px', 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#f59e0b'
                        }}></div>
                        No Program
                      </div>
                      <button
                        onClick={() => {
                          setSelectedClientForProgram(client);
                          setShowProgramAssignModal(true);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          border: '1px solid #6366f1',
                          color: '#6366f1',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#6366f1';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6366f1';
                        }}
                      >
                        Assign Program
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedClientDetails(client)}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#64748b',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e2e8f0';
                      e.target.style.color = '#475569';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.color = '#64748b';
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary-color)' }}>
            <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No clients found</p>
          </div>
        )}
      </div>

      {/* New Client Form Modal */}
      {showNewClientForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--projects-section)',
            padding: '32px',
            borderRadius: '16px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--main-color)', margin: 0 }}>Add New Client</h3>
              <button
                onClick={() => setShowNewClientForm(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} style={{ color: 'var(--main-color)' }} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <input
                type="text"
                placeholder="Client Name"
                value={newClientData.name}
                onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newClientData.email}
                onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newClientData.phone}
                onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
              <textarea
                placeholder="Goals & Notes"
                value={newClientData.goals}
                onChange={(e) => setNewClientData({ ...newClientData, goals: e.target.value })}
                rows={3}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => setShowNewClientForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--message-box-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--main-color)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Creating new client:', newClientData);
                    setShowNewClientForm(false);
                    setNewClientData({ name: '', email: '', phone: '', goals: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--link-color-active-bg)',
                    color: 'var(--link-color-active)',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Create Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Assignment Modal */}
      {showProgramAssignModal && selectedClientForProgram && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--projects-section)',
            padding: '32px',
            borderRadius: '16px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--main-color)', margin: 0 }}>
                Assign Program to {selectedClientForProgram.name}
              </h3>
              <button
                onClick={() => {
                  setShowProgramAssignModal(false);
                  setSelectedClientForProgram(null);
                }}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} style={{ color: 'var(--main-color)' }} />
              </button>
            </div>

            {/* Current Program Status */}
            {clientActivePrograms[selectedClientForProgram.id] && (
              <div style={{
                backgroundColor: 'var(--app-container)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid var(--message-box-border)'
              }}>
                <h4 style={{ color: 'var(--main-color)', margin: '0 0 8px 0', fontSize: '14px' }}>
                  Current Active Program
                </h4>
                <p style={{ color: 'var(--secondary-color)', margin: '0 0 8px 0' }}>
                  {clientActivePrograms[selectedClientForProgram.id].template.name}
                </p>
                <p style={{ color: 'var(--secondary-color)', fontSize: '12px', margin: 0 }}>
                  Day {clientActivePrograms[selectedClientForProgram.id].current_day_index + 1} of {clientActivePrograms[selectedClientForProgram.id].template.days.length}
                </p>
                <button
                  onClick={async () => {
                    try {
                      await apiService.unassignProgramFromClient(selectedClientForProgram.id);
                      // Remove from local state
                      setClientActivePrograms(prev => {
                        const updated = { ...prev };
                        delete updated[selectedClientForProgram.id];
                        return updated;
                      });
                      setShowProgramAssignModal(false);
                      setSelectedClientForProgram(null);
                    } catch (error) {
                      console.error('Error unassigning program:', error);
                    }
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove Current Program
                </button>
              </div>
            )}

            {/* Available Programs */}
            <div>
              <h4 style={{ color: 'var(--main-color)', marginBottom: '16px' }}>
                Available Programs ({workoutTemplates.length + programs.length})
              </h4>
              
              {/* Workout Templates */}
              {workoutTemplates.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ color: 'var(--secondary-color)', fontSize: '14px', marginBottom: '12px' }}>
                    Workout Templates
                  </h5>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {workoutTemplates.map((template) => (
                      <div key={template.id} style={{
                        padding: '16px',
                        backgroundColor: 'var(--app-container)',
                        borderRadius: '8px',
                        border: '1px solid var(--message-box-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h4 style={{ color: 'var(--main-color)', margin: '0 0 4px 0', fontSize: '16px' }}>
                            {template.name}
                          </h4>
                          <p style={{ color: 'var(--secondary-color)', margin: '0 0 4px 0', fontSize: '13px' }}>
                            {template.days ? `${JSON.parse(template.days).length} workout days` : 'Template'}
                          </p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '12px', margin: 0 }}>
                            Created: {new Date(template.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const assignmentData = {
                                template_id: template.id,
                                start_date: new Date().toISOString().split('T')[0]
                              };
                              const result = await apiService.assignProgramToClient(selectedClientForProgram.id, assignmentData);
                              
                              // Update local state
                              setClientActivePrograms(prev => ({
                                ...prev,
                                [selectedClientForProgram.id]: {
                                  ...result,
                                  template: template
                                }
                              }));
                              
                              setShowProgramAssignModal(false);
                              setSelectedClientForProgram(null);
                            } catch (error) {
                              console.error('Error assigning program:', error);
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--link-color-active-bg)',
                            color: 'var(--link-color-active)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Assign Program
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-week Programs */}
              {programs.length > 0 && (
                <div>
                  <h5 style={{ color: 'var(--secondary-color)', fontSize: '14px', marginBottom: '12px' }}>
                    Multi-Week Programs
                  </h5>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {programs.map((program) => (
                      <div key={program.id} style={{
                        padding: '16px',
                        backgroundColor: 'var(--app-container)',
                        borderRadius: '8px',
                        border: '1px solid var(--message-box-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h4 style={{ color: 'var(--main-color)', margin: '0 0 4px 0', fontSize: '16px' }}>
                            {program.name}
                          </h4>
                          <p style={{ color: 'var(--secondary-color)', margin: '0 0 4px 0', fontSize: '13px' }}>
                            {program.description || 'Multi-week training program'}
                          </p>
                          <p style={{ color: 'var(--secondary-color)', fontSize: '12px', margin: 0 }}>
                            {program.weeks ? `${program.weeks.length} weeks` : 'Program'}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const assignmentData = {
                                program_id: program.id,
                                start_date: new Date().toISOString().split('T')[0]
                              };
                              const result = await apiService.assignProgramToClient(selectedClientForProgram.id, assignmentData);
                              
                              // Update local state
                              setClientActivePrograms(prev => ({
                                ...prev,
                                [selectedClientForProgram.id]: {
                                  ...result,
                                  program: program
                                }
                              }));
                              
                              setShowProgramAssignModal(false);
                              setSelectedClientForProgram(null);
                            } catch (error) {
                              console.error('Error assigning program:', error);
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--link-color-active-bg)',
                            color: 'var(--link-color-active)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Assign Program
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workoutTemplates.length === 0 && programs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary-color)' }}>
                  <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p>No programs available. Create workout templates or programs first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workout Logging Modal */}
      {showWorkoutModal && selectedClientForWorkout && (
        <WorkoutLoggingModal
          client={selectedClientForWorkout}
          activeProgram={clientActivePrograms[selectedClientForWorkout.id]}
          onClose={() => {
            setShowWorkoutModal(false);
            setSelectedClientForWorkout(null);
            setCurrentWorkoutData(null);
          }}
          onWorkoutComplete={(completedWorkout) => {
            console.log('Workout completed:', completedWorkout);
            // Refresh client data or update program progress
            loadDashboardData();
            setShowWorkoutModal(false);
            setSelectedClientForWorkout(null);
            setCurrentWorkoutData(null);
          }}
          apiService={apiService}
        />
      )}

      {/* Client Details Modal */}
      {selectedClientDetails && (
        <ClientDetailsModal
          client={selectedClientDetails}
          activeProgram={clientActivePrograms[selectedClientDetails.id]}
          onClose={() => setSelectedClientDetails(null)}
          apiService={apiService}
        />
      )}
    </div>
  );

  // Workout Library Interface
  const renderWorkoutLibrary = () => {
    const uniqueBodyParts = [...new Set(exercises.map(ex => ex.bodyPart))];
    const filteredExercises = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(exerciseFilter.toLowerCase());
      const matchesBodyPart = selectedBodyPart === 'all' || exercise.bodyPart === selectedBodyPart;
      return matchesSearch && matchesBodyPart;
    });

    return (
      <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Exercise Library
          </h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: 'var(--secondary-color)' }}>
              {exercises.length} exercises available
            </span>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search exercises..."
            value={exerciseFilter}
            onChange={(e) => setExerciseFilter(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--message-box-border)',
              backgroundColor: 'var(--app-container)',
              color: 'var(--main-color)'
            }}
          />
          <select
            value={selectedBodyPart}
            onChange={(e) => setSelectedBodyPart(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--message-box-border)',
              backgroundColor: 'var(--app-container)',
              color: 'var(--main-color)',
              minWidth: '150px'
            }}
          >
            <option value="all">All Body Parts</option>
            {uniqueBodyParts.map(bodyPart => (
              <option key={bodyPart} value={bodyPart}>
                {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Exercise Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} style={{
              backgroundColor: 'var(--projects-section)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--message-box-border)'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: 'var(--main-color)', margin: '0 0 8px 0', fontSize: '16px' }}>
                  {exercise.name}
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    backgroundColor: 'var(--link-color-hover)',
                    color: 'var(--link-color-active)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {exercise.bodyPart}
                  </span>
                  <span style={{
                    backgroundColor: 'var(--app-container)',
                    color: 'var(--secondary-color)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {exercise.equipment}
                  </span>
                </div>
                <p style={{ color: 'var(--secondary-color)', fontSize: '14px', margin: '8px 0' }}>
                  Target: {exercise.muscles?.join(', ') || 'N/A'}
                </p>
              </div>
              
              {exercise.instructions && exercise.instructions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'var(--main-color)', fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                    Instructions:
                  </p>
                  <ol style={{ color: 'var(--secondary-color)', fontSize: '13px', paddingLeft: '20px', margin: 0 }}>
                    {exercise.instructions.slice(0, 3).map((instruction, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{instruction}</li>
                    ))}
                    {exercise.instructions.length > 3 && (
                      <li style={{ color: 'var(--link-color-active)' }}>
                        +{exercise.instructions.length - 3} more steps...
                      </li>
                    )}
                  </ol>
                </div>
              )}

              <button style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'var(--link-color-active-bg)',
                color: 'var(--link-color-active)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Add to Workout
              </button>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--secondary-color)' }}>
            <Target size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No exercises found matching your criteria</p>
          </div>
        )}

        {/* Workout Templates Section */}
        {workoutTemplates.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h3 style={{ color: 'var(--main-color)', marginBottom: '24px', fontSize: '20px' }}>
              Workout Templates ({workoutTemplates.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {workoutTemplates.map((template) => (
                <div key={template.id} style={{
                  backgroundColor: 'var(--projects-section)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--message-box-border)'
                }}>
                  <h4 style={{ color: 'var(--main-color)', margin: '0 0 8px 0' }}>
                    {template.name}
                  </h4>
                  <p style={{ color: 'var(--secondary-color)', fontSize: '14px', marginBottom: '16px' }}>
                    {template.description || 'Custom workout template'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                      Created {new Date(template.created_at).toLocaleDateString()}
                    </span>
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--link-color-active-bg)',
                      color: 'var(--link-color-active)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Body part color mapping for UX - Memoized for performance
  const bodyPartColors = useMemo(() => ({
    'chest': { bg: '#fef3e2', border: '#f59e0b', accent: '#d97706' },
    'back': { bg: '#f0f9ff', border: '#0ea5e9', accent: '#0284c7' },
    'shoulders': { bg: '#f3e8ff', border: '#a855f7', accent: '#9333ea' },
    'legs': { bg: '#f0fdf4', border: '#10b981', accent: '#059669' },
    'upper legs': { bg: '#f0fdf4', border: '#10b981', accent: '#059669' },
    'lower legs': { bg: '#ecfdf5', border: '#22c55e', accent: '#16a34a' },
    'arms': { bg: '#fef2f2', border: '#ef4444', accent: '#dc2626' },
    'upper arms': { bg: '#fef2f2', border: '#ef4444', accent: '#dc2626' },
    'lower arms': { bg: '#fff1f2', border: '#f43f5e', accent: '#e11d48' },
    'waist': { bg: '#fffbeb', border: '#f59e0b', accent: '#d97706' },
    'cardio': { bg: '#f1f5f9', border: '#64748b', accent: '#475569' },
    'neck': { bg: '#fdf4ff', border: '#c084fc', accent: '#a855f7' }
  }), []);

  const defaultColors = useMemo(() => ({ bg: '#f8fafc', border: '#94a3b8', accent: '#64748b' }), []);
  
  const getBodyPartColor = useCallback((bodyPart) => {
    return bodyPartColors[bodyPart?.toLowerCase()] || defaultColors;
  }, [bodyPartColors, defaultColors]);

  // Optimized add exercise function
  const addExerciseToWorkout = useCallback((exercise) => {
    const now = Date.now();
    const exerciseWithConfig = {
      ...exercise,
      exerciseId: exercise.id,
      id: now + Math.random(), // More unique ID
      sets: [
        {
          id: now + 1,
          setNumber: 1,
          reps: '12',
          weight: '',
          restTime: 60,
          rpeMode: true,
          rpeValue: 7,
          warmupSet: false,
          dropSet: false
        }
      ],
      trainerNotes: '',
      order: workoutBuilder.exercises.length + 1
    };

    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseWithConfig]
    }));
  }, [workoutBuilder.exercises.length]);

  // Workout Builder callback functions
  const removeExerciseFromWorkout = useCallback((exerciseIndex) => {
    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, index) => index !== exerciseIndex)
    }));
  }, []);

  const addSetToExercise = useCallback((exerciseIndex) => {
    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => {
        if (index === exerciseIndex) {
          const newSet = {
            id: Date.now() + Math.random(),
            setNumber: ex.sets.length + 1,
            reps: '12',
            weight: '',
            restTime: 60,
            rpeMode: true,
            rpeValue: 7,
            warmupSet: false,
            dropSet: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        }
        return ex;
      })
    }));
  }, []);

  const removeSetFromExercise = useCallback((exerciseIndex, setIndex) => {
    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => {
        if (index === exerciseIndex) {
          const newSets = ex.sets.filter((_, sIndex) => sIndex !== setIndex);
          return { 
            ...ex, 
            sets: newSets.map((set, idx) => ({ ...set, setNumber: idx + 1 }))
          };
        }
        return ex;
      })
    }));
  }, []);

  const updateSetConfig = useCallback((exerciseIndex, setIndex, configUpdates) => {
    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => {
        if (index === exerciseIndex) {
          const newSets = ex.sets.map((set, sIndex) => 
            sIndex === setIndex ? { ...set, ...configUpdates } : set
          );
          return { ...ex, sets: newSets };
        }
        return ex;
      })
    }));
  }, []);

  const updateExerciseNotes = useCallback((exerciseIndex, notes) => {
    setWorkoutBuilder(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, index) => 
        index === exerciseIndex ? { ...ex, trainerNotes: notes } : ex
      )
    }));
  }, []);

  // Memoized expensive operations for workout builder
  const uniqueBodyParts = useMemo(() => 
    [...new Set(exercises.map(ex => ex.bodyPart))], 
    [exercises]
  );
  
  const filteredExercises = useMemo(() => 
    exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(debouncedFilter.toLowerCase());
      const matchesBodyPart = selectedBodyPart === 'all' || exercise.bodyPart === selectedBodyPart;
      return matchesSearch && matchesBodyPart;
    }), 
    [exercises, debouncedFilter, selectedBodyPart]
  );

  // Exercise Management Interface
  const renderExerciseManagement = () => {
    return <WorkoutManagement />;
  };

  // Workout Builder Interface
  const renderWorkoutBuilder = () => {
    const saveWorkout = async () => {
      if (!workoutBuilder.name.trim()) {
        alert('Please enter a workout name');
        return;
      }

      try {
        const workoutData = {
          name: workoutBuilder.name,
          description: workoutBuilder.description,
          target_muscle_groups: workoutBuilder.targetMuscleGroups.join(','),
          estimated_duration: workoutBuilder.estimatedDuration,
          exercises: workoutBuilder.exercises.map((ex, index) => ({
            exercise_id: ex.exerciseId,
            order_index: index + 1,
            sets: ex.sets.map(set => ({
              set_number: set.setNumber,
              reps: set.reps,
              weight: set.weight || null,
              rest_time: set.restTime,
              rpe_target: set.rpeMode ? set.rpeValue : null,
              rir_target: !set.rpeMode ? set.rpeValue : null,
              is_warmup: set.warmupSet,
              is_dropset: set.dropSet
            })),
            trainer_notes: ex.trainerNotes
          }))
        };

        await apiService.createWorkoutTemplate(workoutData);
        alert('Workout saved successfully!');
        
        // Reset builder
        setWorkoutBuilder({
          name: '',
          description: '',
          targetMuscleGroups: [],
          estimatedDuration: 60,
          exercises: []
        });
      } catch (error) {
        console.error('Error saving workout:', error);
        alert('Failed to save workout. Please try again.');
      }
    };

    return (
      <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Workout Builder
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={saveWorkout}
              disabled={!workoutBuilder.name.trim() || workoutBuilder.exercises.length === 0}
              style={{
                backgroundColor: 'var(--link-color-active-bg)',
                color: 'var(--link-color-active)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: workoutBuilder.name.trim() && workoutBuilder.exercises.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                opacity: workoutBuilder.name.trim() && workoutBuilder.exercises.length > 0 ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={16} />
              Save Workout
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '45% 55%', gap: '24px', height: 'calc(100% - 100px)', maxWidth: '100%', overflow: 'hidden' }}>
          {/* Left Panel: Workout Details & Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            {/* Workout Details */}
            <div style={{
              backgroundColor: 'var(--projects-section)',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid var(--message-box-border)',
              height: '200px',
              flexShrink: 0
            }}>
              <h3 style={{ color: 'var(--main-color)', marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
                Workout Details
              </h3>
              
              <div style={{ display: 'grid', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Workout Name (e.g., 'Push Day', 'Leg Destroyer')"
                  value={workoutBuilder.name}
                  onChange={(e) => setWorkoutBuilder(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--message-box-border)',
                    backgroundColor: 'var(--app-container)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                  <textarea
                    placeholder="Description (optional)"
                    value={workoutBuilder.description}
                    onChange={(e) => setWorkoutBuilder(prev => ({ ...prev, description: e.target.value }))}
                    rows={1}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid var(--message-box-border)',
                      backgroundColor: 'var(--app-container)',
                      color: 'var(--main-color)',
                      fontSize: '13px',
                      resize: 'vertical'
                    }}
                  />
                  <div>
                    <input
                      type="number"
                      min="15"
                      max="180"
                      placeholder="Duration (min)"
                      value={workoutBuilder.estimatedDuration}
                      onChange={(e) => setWorkoutBuilder(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid var(--message-box-border)',
                        backgroundColor: 'var(--app-container)',
                        color: 'var(--main-color)',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div style={{
              backgroundColor: 'var(--projects-section)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--message-box-border)',
              flex: 1,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--main-color)', margin: 0, fontSize: '18px' }}>
                  Exercise List ({workoutBuilder.exercises.length})
                </h3>
                {workoutBuilder.exercises.length > 0 && (
                  <span style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>
                    ~{workoutBuilder.estimatedDuration} mins
                  </span>
                )}
              </div>

              <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                {workoutBuilder.exercises.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary-color)' }}>
                    <Dumbbell size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>No exercises added yet</p>
                    <p style={{ fontSize: '14px' }}>Add exercises from the library on the right →</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {workoutBuilder.exercises.map((exercise, exerciseIndex) => (
                      <div key={exerciseIndex} style={{
                        backgroundColor: 'var(--app-container)',
                        borderRadius: '10px',
                        padding: '12px',
                        border: '1px solid var(--message-box-border)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ color: 'var(--main-color)', margin: '0 0 2px 0', fontSize: '15px', fontWeight: '600', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {exerciseIndex + 1}. {exercise.name}
                            </h4>
                            <p style={{ color: 'var(--secondary-color)', fontSize: '11px', margin: '0', textTransform: 'capitalize', lineHeight: '1.1' }}>
                              {exercise.bodyPart} • {exercise.target}
                            </p>
                          </div>
                          <button
                            onClick={() => removeExerciseFromWorkout(exerciseIndex)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: 'var(--secondary-color)',
                              cursor: 'pointer',
                              padding: '4px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary-color)'}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Sets Configuration Table */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '30px 30px 50px 70px 70px 70px 85px 70px 40px',
                            gap: '6px',
                            marginBottom: '6px',
                            fontSize: '11px',
                            color: 'var(--secondary-color)',
                            fontWeight: '600'
                          }}>
                            <div style={{ textAlign: 'center' }}>W</div>
                            <div style={{ textAlign: 'center' }}>D</div>
                            <div>Set</div>
                            <div>Reps</div>
                            <div>Weight</div>
                            <div>Rest (s)</div>
                            <div>Intensity</div>
                            <div>Value</div>
                            <div></div>
                          </div>

                          {exercise.sets.map((set, setIndex) => (
                            <div key={set.id} style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '30px 30px 50px 70px 70px 70px 85px 70px 40px',
                              gap: '6px',
                              marginBottom: '6px',
                              alignItems: 'center'
                            }}>
                              {/* Warmup Checkbox */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <input
                                  type="checkbox"
                                  checked={set.warmupSet}
                                  onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { warmupSet: e.target.checked })}
                                  title="Warmup Set"
                                  style={{ 
                                    cursor: 'pointer', 
                                    margin: 0, 
                                    transform: 'scale(1.1)',
                                    accentColor: '#f59e0b'
                                  }}
                                />
                              </div>

                              {/* Drop Set Checkbox */}
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <input
                                  type="checkbox"
                                  checked={set.dropSet}
                                  onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { dropSet: e.target.checked })}
                                  title="Drop Set"
                                  style={{ 
                                    cursor: 'pointer', 
                                    margin: 0, 
                                    transform: 'scale(1.1)',
                                    accentColor: '#ef4444'
                                  }}
                                />
                              </div>

                              {/* Set Number */}
                              <div style={{ 
                                padding: '6px', 
                                backgroundColor: 'var(--projects-section)', 
                                borderRadius: '4px',
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '13px',
                                color: 'var(--main-color)'
                              }}>
                                {set.setNumber}
                              </div>
                              
                              <input
                                type="text"
                                placeholder="12"
                                value={set.reps}
                                onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { reps: e.target.value })}
                                style={{
                                  padding: '6px',
                                  border: '1px solid var(--message-box-border)',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--projects-section)',
                                  color: 'var(--main-color)',
                                  fontSize: '13px'
                                }}
                              />
                              
                              <input
                                type="text"
                                placeholder="lbs/kg"
                                value={set.weight}
                                onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { weight: e.target.value })}
                                style={{
                                  padding: '6px',
                                  border: '1px solid var(--message-box-border)',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--projects-section)',
                                  color: 'var(--main-color)',
                                  fontSize: '13px'
                                }}
                              />
                              
                              <input
                                type="number"
                                min="30"
                                max="300"
                                step="15"
                                value={set.restTime}
                                onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { restTime: parseInt(e.target.value) })}
                                style={{
                                  padding: '6px',
                                  border: '1px solid var(--message-box-border)',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--projects-section)',
                                  color: 'var(--main-color)',
                                  fontSize: '13px'
                                }}
                              />
                              
                              <select
                                value={set.rpeMode ? 'rpe' : 'rir'}
                                onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { rpeMode: e.target.value === 'rpe' })}
                                style={{
                                  padding: '6px',
                                  border: '1px solid var(--message-box-border)',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--projects-section)',
                                  color: 'var(--main-color)',
                                  fontSize: '13px'
                                }}
                              >
                                <option value="rpe">RPE</option>
                                <option value="rir">RIR</option>
                              </select>
                              
                              <input
                                type="number"
                                min={set.rpeMode ? "6" : "0"}
                                max={set.rpeMode ? "10" : "4"}
                                step="0.5"
                                value={set.rpeValue}
                                onChange={(e) => updateSetConfig(exerciseIndex, setIndex, { rpeValue: parseFloat(e.target.value) })}
                                style={{
                                  padding: '6px',
                                  border: '1px solid var(--message-box-border)',
                                  borderRadius: '4px',
                                  backgroundColor: 'var(--projects-section)',
                                  color: 'var(--main-color)',
                                  fontSize: '13px'
                                }}
                              />
                              
                              {exercise.sets.length > 1 && (
                                <button
                                  onClick={() => removeSetFromExercise(exerciseIndex, setIndex)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'var(--secondary-color)',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Set Button */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                          <button
                            onClick={() => addSetToExercise(exerciseIndex)}
                            style={{
                              width: '70%',
                              padding: '6px',
                              backgroundColor: 'var(--main-color)',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          >
                            <Plus size={14} />
                            Add Set
                          </button>
                        </div>

                        {/* Trainer Notes */}
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--secondary-color)', fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                            Trainer Notes
                          </label>
                          <textarea
                            placeholder="Form cues, modifications, tempo, special instructions..."
                            value={exercise.trainerNotes}
                            onChange={(e) => updateExerciseNotes(exerciseIndex, e.target.value)}
                            rows={2}
                            style={{
                              width: '100%',
                              padding: '6px',
                              border: '1px solid var(--message-box-border)',
                              borderRadius: '4px',
                              backgroundColor: 'var(--projects-section)',
                              color: 'var(--main-color)',
                              fontSize: '12px',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Exercise Library */}
          <div style={{
            backgroundColor: 'var(--projects-section)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--message-box-border)',
            overflow: 'hidden'
          }}>
            <h3 style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '18px' }}>
              Exercise Library
            </h3>

            {/* Search and Filter */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--secondary-color)'
                }} />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseFilter}
                  onChange={(e) => setExerciseFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    borderRadius: '8px',
                    border: '1px solid var(--message-box-border)',
                    backgroundColor: 'var(--app-container)',
                    color: 'var(--main-color)'
                  }}
                />
              </div>

              <select
                value={selectedBodyPart}
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              >
                <option value="all">All Body Parts</option>
                {uniqueBodyParts.map(bodyPart => (
                  <option key={bodyPart} value={bodyPart} style={{ textTransform: 'capitalize' }}>
                    {bodyPart}
                  </option>
                ))}
              </select>
            </div>

            {/* Exercise List */}
            <div style={{ height: '600px', position: 'relative' }}>
              <VirtualizedExerciseList
                exercises={filteredExercises}
                onAdd={addExerciseToWorkout}
                onInfo={(exercise) => {
                  setSelectedExerciseInfo(exercise);
                  setShowExerciseInfo(true);
                }}
                getBodyPartColor={getBodyPartColor}
              />
            </div>

            {filteredExercises.length === 0 && (
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', 
                color: 'var(--secondary-color)' 
              }}>
                <Search size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No exercises found</p>
                <p style={{ fontSize: '14px' }}>Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Exercise Info Modal */}
        {showExerciseInfo && selectedExerciseInfo && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'var(--projects-section)',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: `3px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).border}`,
              borderLeft: `6px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).accent}`,
              background: `linear-gradient(135deg, ${getBodyPartColor(selectedExerciseInfo.bodyPart).bg} 0%, var(--projects-section) 20%)`
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ 
                    color: 'var(--main-color)', 
                    margin: '0 0 8px 0', 
                    fontSize: '20px', 
                    fontWeight: '700',
                    lineHeight: '1.2'
                  }}>
                    {selectedExerciseInfo.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: getBodyPartColor(selectedExerciseInfo.bodyPart).border,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {selectedExerciseInfo.bodyPart}
                    </span>
                    <span style={{
                      backgroundColor: getBodyPartColor(selectedExerciseInfo.bodyPart).accent,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {selectedExerciseInfo.target}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowExerciseInfo(false);
                    setSelectedExerciseInfo(null);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--secondary-color)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--secondary-color)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Exercise Details */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {/* Equipment */}
                {selectedExerciseInfo.equipment && (
                  <div>
                    <h4 style={{ color: 'var(--main-color)', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                      Equipment
                    </h4>
                    <p style={{ 
                      color: 'var(--secondary-color)', 
                      fontSize: '13px', 
                      margin: 0,
                      textTransform: 'capitalize',
                      backgroundColor: 'var(--app-container)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).border}`
                    }}>
                      {selectedExerciseInfo.equipment}
                    </p>
                  </div>
                )}

                {/* Instructions */}
                {selectedExerciseInfo.instructions && (
                  <div>
                    <h4 style={{ color: 'var(--main-color)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Instructions
                    </h4>
                    <div style={{ 
                      backgroundColor: 'var(--app-container)',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).border}`,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {(selectedExerciseInfo.instructions || 'No instructions available').toString().split('\\n').map((instruction, index) => (
                        <p key={index} style={{ 
                          color: 'var(--main-color)', 
                          fontSize: '13px', 
                          lineHeight: '1.5',
                          margin: index === 0 ? '0 0 8px 0' : '0 0 8px 0'
                        }}>
                          {instruction.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    backgroundColor: getBodyPartColor(selectedExerciseInfo.bodyPart).bg,
                    border: `2px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).border}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '4px' }}>
                      BODY PART
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--main-color)', textTransform: 'capitalize' }}>
                      {selectedExerciseInfo.bodyPart}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: getBodyPartColor(selectedExerciseInfo.bodyPart).bg,
                    border: `2px solid ${getBodyPartColor(selectedExerciseInfo.bodyPart).border}`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--secondary-color)', marginBottom: '4px' }}>
                      TARGET MUSCLE
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--main-color)', textTransform: 'capitalize' }}>
                      {selectedExerciseInfo.target}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Calendar & Scheduling Interface
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Generate calendar days for current month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
            Calendar & Scheduling
          </h2>
          <button style={{
            backgroundColor: 'var(--link-color-active-bg)',
            color: 'var(--link-color-active)',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <Plus size={16} />
            Schedule Session
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          {/* Calendar */}
          <div style={{
            backgroundColor: 'var(--projects-section)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--main-color)', margin: 0, fontSize: '18px' }}>
                {currentMonth}
              </h3>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '1px',
              backgroundColor: 'var(--message-box-border)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  backgroundColor: 'var(--app-container)',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--secondary-color)'
                }}>
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <div key={index} style={{
                  backgroundColor: 'var(--projects-section)',
                  padding: '12px 8px',
                  minHeight: '60px',
                  position: 'relative',
                  cursor: day ? 'pointer' : 'default',
                  border: day === today.getDate() ? '2px solid var(--link-color-active-bg)' : 'none'
                }}>
                  {day && (
                    <>
                      <div style={{
                        color: day === today.getDate() ? 'var(--link-color-active)' : 'var(--main-color)',
                        fontWeight: day === today.getDate() ? '600' : 'normal',
                        fontSize: '14px'
                      }}>
                        {day}
                      </div>
                      {/* Sample sessions */}
                      {(day === today.getDate() || day === today.getDate() + 1) && (
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          right: '4px',
                          fontSize: '10px',
                          color: 'var(--link-color-active)',
                          backgroundColor: 'var(--link-color-hover)',
                          borderRadius: '2px',
                          padding: '2px 4px',
                          textAlign: 'center'
                        }}>
                          {day === today.getDate() ? '3 sessions' : '2 sessions'}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div style={{
            backgroundColor: 'var(--projects-section)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h3 style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '18px' }}>
              Today's Schedule
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { time: '9:00 AM', client: 'Sarah Johnson', type: 'Personal Training' },
                { time: '11:00 AM', client: 'Mike Chen', type: 'Nutrition Consultation' },
                { time: '2:00 PM', client: 'Emma Wilson', type: 'Personal Training' }
              ].map((session, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: 'var(--app-container)',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <div style={{ color: 'var(--main-color)', fontWeight: '600', fontSize: '14px' }}>
                        {session.client}
                      </div>
                      <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                        {session.type}
                      </div>
                    </div>
                    <div style={{
                      color: 'var(--link-color-active)',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: 'var(--link-color-hover)',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {session.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: 'var(--link-color-active-bg)',
                      color: 'var(--link-color-active)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      Start Session
                    </button>
                    <button style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      color: 'var(--secondary-color)',
                      border: '1px solid var(--message-box-border)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Messages Interface
  const renderMessagesInterface = () => (
    <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Client Messages
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: 'var(--secondary-color)' }}>
            4 unread messages
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
        {/* Message List */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '20px',
          overflow: 'auto'
        }}>
          <h3 style={{ color: 'var(--main-color)', marginBottom: '16px', fontSize: '16px' }}>
            Conversations
          </h3>
          
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { client: 'Sarah Johnson', lastMessage: 'Thanks for the workout plan!', time: '2 min ago', unread: true },
              { client: 'Mike Chen', lastMessage: 'Can we reschedule tomorrows session?', time: '1 hour ago', unread: true },
              { client: 'Emma Wilson', lastMessage: 'Hit a new PR today! 🎉', time: '3 hours ago', unread: false },
              { client: 'Lisa Garcia', lastMessage: 'Ready for tomorrows workout', time: 'Yesterday', unread: false }
            ].map((conversation, index) => (
              <div key={index} style={{
                padding: '12px',
                backgroundColor: conversation.unread ? 'var(--link-color-hover)' : 'var(--app-container)',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid var(--message-box-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--link-color-active-bg)',
                    color: 'var(--link-color-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    {apiService.getClientInitials({ name: conversation.client })}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: 'var(--main-color)',
                      fontSize: '14px',
                      fontWeight: conversation.unread ? '600' : '500',
                      marginBottom: '2px'
                    }}>
                      {conversation.client}
                    </div>
                    <div style={{
                      color: 'var(--secondary-color)',
                      fontSize: '12px'
                    }}>
                      {conversation.time}
                    </div>
                  </div>
                </div>
                <div style={{
                  color: 'var(--main-color)',
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {conversation.lastMessage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            borderBottom: '1px solid var(--message-box-border)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'var(--main-color)', margin: 0, fontSize: '16px' }}>
              Sarah Johnson
            </h3>
            <p style={{ color: 'var(--secondary-color)', margin: '4px 0 0 0', fontSize: '12px' }}>
              Active now
            </p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { sender: 'client', message: 'Hi! I wanted to check about tomorrows workout', time: '10:30 AM' },
                { sender: 'trainer', message: 'Hi Sarah! Yes, we have your upper body session scheduled for 9 AM. Are you still available?', time: '10:32 AM' },
                { sender: 'client', message: 'Perfect! I\'ll be there. Thanks for the workout plan you sent yesterday', time: '10:35 AM' },
                { sender: 'trainer', message: 'Youre welcome! Keep up the great work. See you tomorrow 💪', time: '10:36 AM' }
              ].map((msg, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'trainer' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    backgroundColor: msg.sender === 'trainer' ? 'var(--link-color-active-bg)' : 'var(--app-container)',
                    color: msg.sender === 'trainer' ? 'var(--link-color-active)' : 'var(--main-color)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    <div>{msg.message}</div>
                    <div style={{
                      fontSize: '11px',
                      opacity: 0.7,
                      marginTop: '4px'
                    }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <textarea
              placeholder="Type your message..."
              rows={2}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--message-box-border)',
                backgroundColor: 'var(--app-container)',
                color: 'var(--main-color)',
                resize: 'none',
                fontSize: '14px'
              }}
            />
            <button style={{
              padding: '12px 20px',
              backgroundColor: 'var(--link-color-active-bg)',
              color: 'var(--link-color-active)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Interface
  const renderSettings = () => (
    <div style={{ padding: '32px', height: '100%', overflow: 'auto' }}>
      <h2 style={{ color: 'var(--main-color)', fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>
        Trainer Settings
      </h2>

      <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
        {/* Profile Settings */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '18px' }}>
            Profile Information
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--message-box-border)',
                    backgroundColor: 'var(--app-container)',
                    color: 'var(--main-color)'
                  }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Doe"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--message-box-border)',
                    backgroundColor: 'var(--app-container)',
                    color: 'var(--main-color)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Email
              </label>
              <input
                type="email"
                defaultValue="john.doe@fitportal.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
            </div>

            <div>
              <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Certification
              </label>
              <input
                type="text"
                defaultValue="Certified Personal Trainer (CPT)"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '18px' }}>
            Notification Preferences
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { label: 'New client messages', description: 'Get notified when clients send messages' },
              { label: 'Session reminders', description: 'Reminders 30 minutes before scheduled sessions' },
              { label: 'Client progress updates', description: 'Notifications when clients complete workouts' },
              { label: 'Payment notifications', description: 'Alerts for subscription payments and issues' }
            ].map((setting, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'var(--app-container)',
                borderRadius: '8px',
                border: '1px solid var(--message-box-border)'
              }}>
                <div>
                  <div style={{ color: 'var(--main-color)', fontSize: '14px', fontWeight: '500' }}>
                    {setting.label}
                  </div>
                  <div style={{ color: 'var(--secondary-color)', fontSize: '12px', marginTop: '4px' }}>
                    {setting.description}
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'var(--link-color-active-bg)',
                    borderRadius: '24px',
                    transition: '.4s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: '3px',
                      top: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '.4s'
                    }}></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Business Settings */}
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '18px' }}>
            Business Settings
          </h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Session Rate (per hour)
              </label>
              <input
                type="number"
                defaultValue="75"
                style={{
                  width: '200px',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--message-box-border)',
                  backgroundColor: 'var(--app-container)',
                  color: 'var(--main-color)'
                }}
              />
            </div>

            <div>
              <label style={{ color: 'var(--main-color)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Working Hours
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <input
                    type="time"
                    defaultValue="08:00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--message-box-border)',
                      backgroundColor: 'var(--app-container)',
                      color: 'var(--main-color)'
                    }}
                  />
                  <label style={{ color: 'var(--secondary-color)', fontSize: '12px', marginTop: '4px' }}>Start Time</label>
                </div>
                <div>
                  <input
                    type="time"
                    defaultValue="18:00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--message-box-border)',
                      backgroundColor: 'var(--app-container)',
                      color: 'var(--main-color)'
                    }}
                  />
                  <label style={{ color: 'var(--secondary-color)', fontSize: '12px', marginTop: '4px' }}>End Time</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button style={{
            padding: '12px 32px',
            backgroundColor: 'var(--link-color-active-bg)',
            color: 'var(--link-color-active)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  // Workout Logging Modal Component
  const WorkoutLoggingModal = ({ client, activeProgram, onClose, onWorkoutComplete, apiService }) => {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [exerciseLogs, setExerciseLogs] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentDay, setCurrentDay] = useState(null);
    const [previousWorkouts, setPreviousWorkouts] = useState({});

    useEffect(() => {
      loadWorkoutData();
    }, []);

    const loadWorkoutData = async () => {
      try {
        setIsLoading(true);
        
        if (!activeProgram || !activeProgram.template || !activeProgram.template.days) {
          console.error('No active program or template days found');
          return;
        }

        const templateDays = typeof activeProgram.template.days === 'string' 
          ? JSON.parse(activeProgram.template.days)
          : activeProgram.template.days;

        const todayWorkout = templateDays[activeProgram.current_day_index];
        setCurrentDay(todayWorkout);

        // Load previous workout data for each exercise
        if (todayWorkout && todayWorkout.groups) {
          const previousData = {};
          for (const group of todayWorkout.groups) {
            for (const exercise of group.exercises) {
              try {
                const previousWorkout = await apiService.getExercisePrevious(client.id, exercise.id);
                previousData[exercise.instanceId] = previousWorkout;
              } catch (error) {
                console.warn(`No previous data for exercise ${exercise.name}:`, error);
                previousData[exercise.instanceId] = null;
              }
            }
          }
          setPreviousWorkouts(previousData);
        }
      } catch (error) {
        console.error('Error loading workout data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const updateExerciseLog = (exerciseInstanceId, setIndex, field, value) => {
      setExerciseLogs(prev => ({
        ...prev,
        [exerciseInstanceId]: {
          ...prev[exerciseInstanceId],
          sets: {
            ...prev[exerciseInstanceId]?.sets,
            [setIndex]: {
              ...prev[exerciseInstanceId]?.sets?.[setIndex],
              [field]: value
            }
          }
        }
      }));
    };

    const completeWorkout = async () => {
      try {
        setIsLoading(true);
        
        const workoutData = {
          assignment_id: activeProgram.id,
          day_index_completed: activeProgram.current_day_index,
          actual_date: new Date().toISOString().split('T')[0],
          performance_data: exerciseLogs
        };

        await apiService.logWorkout(client.id, workoutData);
        onWorkoutComplete(workoutData);
      } catch (error) {
        console.error('Error completing workout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--projects-section)',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <Loader size={48} className="animate-spin" style={{ color: 'var(--main-color)' }} />
            <p style={{ color: 'var(--secondary-color)', marginTop: '16px' }}>Loading workout...</p>
          </div>
        </div>
      );
    }

    if (!currentDay || !currentDay.groups) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--projects-section)',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--main-color)' }}>No Workout Available</h3>
            <p style={{ color: 'var(--secondary-color)' }}>This client doesn't have a workout scheduled for today.</p>
            <button onClick={onClose} style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: 'var(--link-color-active-bg)',
              color: 'var(--link-color-active)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Close
            </button>
          </div>
        </div>
      );
    }

    const allExercises = currentDay.groups.flatMap(group => group.exercises);
    const currentExercise = allExercises[currentExerciseIndex];

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'var(--projects-section)',
          padding: '32px',
          borderRadius: '16px',
          width: '800px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: 'var(--main-color)', margin: '0 0 4px 0' }}>
                {client.name}'s Workout
              </h3>
              <p style={{ color: 'var(--secondary-color)', margin: 0, fontSize: '14px' }}>
                {currentDay.name} • Exercise {currentExerciseIndex + 1} of {allExercises.length}
              </p>
            </div>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={24} style={{ color: 'var(--main-color)' }} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--app-container)',
            borderRadius: '4px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: `${((currentExerciseIndex + 1) / allExercises.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--link-color-active-bg)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Current Exercise */}
          {currentExercise && (
            <div>
              <div style={{
                backgroundColor: 'var(--app-container)',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <h4 style={{ color: 'var(--main-color)', margin: '0 0 8px 0', fontSize: '20px' }}>
                  {currentExercise.name}
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: 'var(--link-color-hover)',
                    color: 'var(--link-color-active)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {currentExercise.bodyPart}
                  </span>
                  <span style={{
                    backgroundColor: 'var(--message-box-border)',
                    color: 'var(--secondary-color)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {currentExercise.equipment}
                  </span>
                </div>
                
                {/* Previous Workout Data */}
                {previousWorkouts[currentExercise.instanceId] && (
                  <div style={{
                    backgroundColor: 'var(--projects-section)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ color: 'var(--secondary-color)', fontSize: '12px', margin: '0 0 8px 0' }}>
                      Previous Workout:
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                      {previousWorkouts[currentExercise.instanceId].sets?.map((set, index) => (
                        <span key={index} style={{ color: 'var(--main-color)' }}>
                          {set.weight}kg × {set.reps}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sets Logging */}
                <div>
                  <h5 style={{ color: 'var(--main-color)', marginBottom: '16px' }}>
                    Sets ({currentExercise.sets?.length || 0})
                  </h5>
                  {currentExercise.sets?.map((plannedSet, setIndex) => (
                    <div key={setIndex} style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 1fr 1fr 80px',
                      gap: '12px',
                      alignItems: 'center',
                      marginBottom: '12px',
                      padding: '12px',
                      backgroundColor: 'var(--projects-section)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ color: 'var(--secondary-color)', fontSize: '14px', fontWeight: '600' }}>
                        #{setIndex + 1}
                      </div>
                      
                      <div>
                        <label style={{ color: 'var(--secondary-color)', fontSize: '12px', display: 'block' }}>
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          placeholder={plannedSet.weight || '0'}
                          value={exerciseLogs[currentExercise.instanceId]?.sets?.[setIndex]?.weight || ''}
                          onChange={(e) => updateExerciseLog(currentExercise.instanceId, setIndex, 'weight', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--message-box-border)',
                            backgroundColor: 'var(--app-container)',
                            color: 'var(--main-color)',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'var(--secondary-color)', fontSize: '12px', display: 'block' }}>
                          Reps
                        </label>
                        <input
                          type="number"
                          placeholder={plannedSet.reps || '0'}
                          value={exerciseLogs[currentExercise.instanceId]?.sets?.[setIndex]?.reps || ''}
                          onChange={(e) => updateExerciseLog(currentExercise.instanceId, setIndex, 'reps', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--message-box-border)',
                            backgroundColor: 'var(--app-container)',
                            color: 'var(--main-color)',
                            fontSize: '14px'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ color: 'var(--secondary-color)', fontSize: '12px', display: 'block' }}>
                          RPE (1-10)
                        </label>
                        <select
                          value={exerciseLogs[currentExercise.instanceId]?.sets?.[setIndex]?.rpe || plannedSet.rpe || ''}
                          onChange={(e) => updateExerciseLog(currentExercise.instanceId, setIndex, 'rpe', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--message-box-border)',
                            backgroundColor: 'var(--app-container)',
                            color: 'var(--main-color)',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">RPE</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ textAlign: 'center', color: 'var(--secondary-color)', fontSize: '12px' }}>
                        Target:<br/>
                        {plannedSet.weight}kg × {plannedSet.reps}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exercise Notes */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ color: 'var(--secondary-color)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    Notes (optional)
                  </label>
                  <textarea
                    placeholder="How did this exercise feel? Any issues or improvements?"
                    value={exerciseLogs[currentExercise.instanceId]?.notes || ''}
                    onChange={(e) => setExerciseLogs(prev => ({
                      ...prev,
                      [currentExercise.instanceId]: {
                        ...prev[currentExercise.instanceId],
                        notes: e.target.value
                      }
                    }))}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid var(--message-box-border)',
                      backgroundColor: 'var(--app-container)',
                      color: 'var(--main-color)',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <button
                  onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                  disabled={currentExerciseIndex === 0}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: currentExerciseIndex === 0 ? 'var(--app-container)' : 'transparent',
                    border: '1px solid var(--message-box-border)',
                    color: currentExerciseIndex === 0 ? 'var(--secondary-color)' : 'var(--main-color)',
                    borderRadius: '8px',
                    cursor: currentExerciseIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Previous
                </button>

                {currentExerciseIndex < allExercises.length - 1 ? (
                  <button
                    onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'var(--link-color-active-bg)',
                      color: 'var(--link-color-active)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Next Exercise →
                  </button>
                ) : (
                  <button
                    onClick={completeWorkout}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Complete Workout ✓
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Client Details Modal with Performance Tracking
  const ClientDetailsModal = ({ client, activeProgram, onClose, apiService }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [personalRecords, setPersonalRecords] = useState([]);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [bodyStats, setBodyStats] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      loadClientData();
    }, [client.id]);

    const loadClientData = async () => {
      try {
        setIsLoading(true);
        
        const [prsData, historyData, bodyData, achievementsData] = await Promise.allSettled([
          apiService.getPersonalRecords(client.id),
          apiService.getClientWorkoutHistory(client.id),
          apiService.getBodyStats(client.id),
          apiService.getClientAchievements(client.id)
        ]);

        if (prsData.status === 'fulfilled') {
          setPersonalRecords(prsData.value || []);
        }
        if (historyData.status === 'fulfilled') {
          setWorkoutHistory(historyData.value || []);
        }
        if (bodyData.status === 'fulfilled') {
          setBodyStats(bodyData.value || []);
        }
        if (achievementsData.status === 'fulfilled') {
          setAchievements(achievementsData.value || []);
        }
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const renderOverviewTab = () => (
      <div style={{ padding: '24px' }}>
        {/* Active Program Status */}
        {activeProgram ? (
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid var(--message-box-border)'
          }}>
            <h4 style={{ color: 'var(--main-color)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Current Program
            </h4>
            <h3 style={{ color: 'var(--link-color-active)', margin: '0 0 8px 0' }}>
              {activeProgram.template?.name || 'Active Program'}
            </h3>
            <p style={{ color: 'var(--secondary-color)', margin: '0 0 12px 0' }}>
              Day {activeProgram.current_day_index + 1} of {activeProgram.template?.days?.length || 0}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--secondary-color)' }}>Started: </span>
                <span style={{ color: 'var(--main-color)' }}>
                  {new Date(activeProgram.start_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--secondary-color)' }}>Progress: </span>
                <span style={{ color: 'var(--main-color)' }}>
                  {Math.round(((activeProgram.current_day_index + 1) / (activeProgram.template?.days?.length || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid var(--message-box-border)',
            textAlign: 'center'
          }}>
            <h4 style={{ color: 'var(--secondary-color)', margin: '0 0 8px 0' }}>No Active Program</h4>
            <p style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>
              Assign a workout program to get started
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--link-color-active)', fontSize: '24px', fontWeight: '700' }}>
              {workoutHistory.length}
            </div>
            <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>Total Workouts</div>
          </div>
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--link-color-active)', fontSize: '24px', fontWeight: '700' }}>
              {personalRecords.length}
            </div>
            <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>Personal Records</div>
          </div>
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--link-color-active)', fontSize: '24px', fontWeight: '700' }}>
              {achievements.length}
            </div>
            <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>Achievements</div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div style={{
            backgroundColor: 'var(--app-container)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h4 style={{ color: 'var(--main-color)', margin: '0 0 16px 0' }}>Recent Achievements</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'var(--projects-section)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '20px' }}>{achievement.icon || '🏆'}</div>
                  <div>
                    <div style={{ color: 'var(--main-color)', fontWeight: '600' }}>{achievement.title}</div>
                    <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                      {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    const renderPerformanceTab = () => (
      <div style={{ padding: '24px' }}>
        {/* Personal Records */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ color: 'var(--main-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Personal Records
          </h4>
          {personalRecords.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {personalRecords.map((pr) => (
                <div key={`${pr.exercise_name}-${pr.record_type}`} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'var(--app-container)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ color: 'var(--main-color)', fontWeight: '600' }}>{pr.exercise_name}</div>
                    <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                      {pr.record_type === 'max_weight' ? 'Max Weight' : 'Best Volume'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--link-color-active)', fontSize: '18px', fontWeight: '700' }}>
                      {pr.record_type === 'max_weight' 
                        ? `${pr.max_weight}kg`
                        : `${pr.best_volume}kg`
                      }
                    </div>
                    <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                      {new Date(pr.achieved_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'var(--secondary-color)',
              backgroundColor: 'var(--app-container)',
              borderRadius: '8px'
            }}>
              <Target size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No personal records yet. Complete workouts to track progress!</p>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div>
          <h4 style={{ color: 'var(--main-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Recent Workouts
          </h4>
          {workoutHistory.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {workoutHistory.slice(0, 5).map((workout) => (
                <div key={workout.id} style={{
                  padding: '16px',
                  backgroundColor: 'var(--app-container)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ color: 'var(--main-color)', fontWeight: '600' }}>
                        Day {workout.day_index_completed + 1}
                      </div>
                      <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                        {new Date(workout.actual_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--link-color-hover)',
                      color: 'var(--link-color-active)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Completed
                    </div>
                  </div>
                  {workout.performance_data && Object.keys(workout.performance_data).length > 0 && (
                    <div style={{ color: 'var(--secondary-color)', fontSize: '14px' }}>
                      {Object.keys(workout.performance_data).length} exercises logged
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'var(--secondary-color)',
              backgroundColor: 'var(--app-container)',
              borderRadius: '8px'
            }}>
              <Activity size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No workout history yet. Start logging workouts to see progress!</p>
            </div>
          )}
        </div>
      </div>
    );

    const renderProgressTab = () => (
      <div style={{ padding: '24px' }}>
        {/* Body Stats */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ color: 'var(--main-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📏 Body Measurements
          </h4>
          {bodyStats.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {bodyStats.slice(0, 5).map((stat) => (
                <div key={stat.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: 'var(--app-container)',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ color: 'var(--secondary-color)', fontSize: '12px' }}>
                      {new Date(stat.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                    {stat.weight && (
                      <div>
                        <span style={{ color: 'var(--secondary-color)' }}>Weight: </span>
                        <span style={{ color: 'var(--main-color)', fontWeight: '600' }}>{stat.weight}kg</span>
                      </div>
                    )}
                    {stat.bodyfat && (
                      <div>
                        <span style={{ color: 'var(--secondary-color)' }}>Body Fat: </span>
                        <span style={{ color: 'var(--main-color)', fontWeight: '600' }}>{stat.bodyfat}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px',
              color: 'var(--secondary-color)',
              backgroundColor: 'var(--app-container)',
              borderRadius: '8px'
            }}>
              <Users size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No body measurements recorded yet.</p>
            </div>
          )}
        </div>

        {/* Progress Photos would go here */}
        <div>
          <h4 style={{ color: 'var(--main-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📸 Progress Photos
          </h4>
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: 'var(--secondary-color)',
            backgroundColor: 'var(--app-container)',
            borderRadius: '8px'
          }}>
            <p>Progress photo gallery coming soon...</p>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '16px',
          width: '800px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 32px',
            borderBottom: '1px solid var(--message-box-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--link-color-active-bg)',
                color: 'var(--link-color-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {client.avatar}
              </div>
              <div>
                <h3 style={{ color: 'var(--main-color)', margin: '0 0 4px 0' }}>{client.name}</h3>
                <p style={{ color: 'var(--secondary-color)', margin: 0, fontSize: '14px' }}>
                  Member since {new Date(client.created_at || '2024-01-01').toLocaleDateString()}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={24} style={{ color: 'var(--main-color)' }} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--message-box-border)',
            backgroundColor: 'var(--app-container)'
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'performance', label: 'Performance', icon: '🎯' },
              { id: 'progress', label: 'Progress', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: activeTab === tab.id ? 'var(--projects-section)' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--link-color-active-bg)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--link-color-active)' : 'var(--secondary-color)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <Loader size={32} className="animate-spin" style={{ color: 'var(--main-color)' }} />
                <p style={{ color: 'var(--secondary-color)' }}>Loading client data...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'performance' && renderPerformanceTab()}
                {activeTab === 'progress' && renderProgressTab()}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`elegant-dashboard ${darkMode ? 'dark' : ''}`}>
      <div className="app-container">
        {/* Header */}
        <div className="app-header">
          <div className="app-header-left">
            <span className="app-icon"></span>
            <p className="app-name">FitPortal Pro</p>
            <div className="search-wrapper">
              <input 
                className="search-input" 
                type="text" 
                placeholder="Search clients, exercises..." 
              />
              <Search size={20} color="var(--main-color)" />
            </div>
          </div>
          <div className="app-header-right">
            <button className="mode-switch" title="Switch Theme" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="add-btn" title="Add New">
              <Plus size={20} />
            </button>
            <button className="notification-btn" title="Notifications">
              <Bell size={20} />
            </button>
            {activeSection === 'dashboard' && (
              <button className="messages-btn" onClick={() => setShowMessages(!showMessages)}>
                <MessageSquare size={20} />
              </button>
            )}
            <button className="profile-btn">
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1f1c2e',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                JD
              </div>
              <span>John Doe</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="app-content">
          {/* Sidebar */}
          <div className={`app-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`} style={{
            width: sidebarExpanded ? '250px' : '72px',
            transition: 'width 0.3s ease',
            padding: sidebarExpanded ? '40px 24px' : '40px 16px',
            position: 'relative'
          }}>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--link-color-hover)',
                color: 'var(--main-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              title={sidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {sidebarExpanded ? '‹' : '›'}
            </button>

            {/* Brand/Logo */}
            {sidebarExpanded && (
              <div style={{
                marginBottom: '32px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--message-box-border)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--link-color-active-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Activity size={24} style={{ color: 'var(--link-color-active)' }} />
                  </div>
                  <div>
                    <h3 style={{ 
                      color: 'var(--main-color)', 
                      margin: 0, 
                      fontSize: '18px',
                      fontWeight: '700'
                    }}>
                      FitPortal Pro
                    </h3>
                    <p style={{ 
                      color: 'var(--secondary-color)', 
                      margin: 0, 
                      fontSize: '12px'
                    }}>
                      Trainer Dashboard
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  className={`app-sidebar-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(link.id)}
                  title={sidebarExpanded ? '' : (link.id === 'exercise-list' ? 'Exercise List' : link.id.charAt(0).toUpperCase() + link.id.slice(1))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarExpanded ? '12px' : '0',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeSection === link.id ? 'var(--link-color-active-bg)' : 'transparent',
                    color: activeSection === link.id ? 'var(--link-color-active)' : 'var(--link-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== link.id) {
                      e.target.style.backgroundColor = 'var(--link-color-hover)';
                      e.target.style.color = 'var(--link-color-active)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== link.id) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = 'var(--link-color)';
                    }
                  }}
                >
                  <link.icon size={20} />
                  {sidebarExpanded && (
                    <span>
                      {link.id === 'exercise-list' ? 'Exercise List' : 
                       link.id.charAt(0).toUpperCase() + link.id.slice(1)}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* User Info at Bottom */}
            {sidebarExpanded && (
              <div style={{
                marginTop: 'auto',
                paddingTop: '24px',
                borderTop: '1px solid var(--message-box-border)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--projects-section)'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--link-color-active-bg)',
                    color: 'var(--link-color-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    JD
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      color: 'var(--main-color)', 
                      margin: 0, 
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      John Doe
                    </p>
                    <p style={{ 
                      color: 'var(--secondary-color)', 
                      margin: 0, 
                      fontSize: '12px'
                    }}>
                      Certified Trainer
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Section */}
          <div className="projects-section">
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <Loader size={48} className="animate-spin" style={{ color: 'var(--main-color)' }} />
                <p style={{ color: 'var(--secondary-color)' }}>Loading dashboard data...</p>
              </div>
            )}

            {error && (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                backgroundColor: 'var(--projects-section)',
                borderRadius: '16px',
                margin: '32px'
              }}>
                <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>Connection Error</h3>
                <p style={{ color: 'var(--secondary-color)', marginBottom: '24px' }}>
                  Failed to connect to backend: {error}
                </p>
                <button 
                  onClick={loadDashboardData}
                  className="dark-btn-primary"
                  style={{
                    backgroundColor: 'var(--link-color-active-bg)',
                    color: 'var(--link-color-active)',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Retry Connection
                </button>
                <p style={{ color: 'var(--secondary-color)', fontSize: '14px', marginTop: '16px' }}>
                  Make sure your backend server is running on localhost:5000
                </p>
              </div>
            )}

            {!loading && !error && activeSection === 'dashboard' && (
              <>
                <div className="projects-section-header">
                  <p>Clients ({clients.length})</p>
                  <p className="time">{getCurrentDate()}, {getCurrentTime()}</p>
                </div>
                
                <div className="projects-section-line">
                  <div className="projects-status">
                    {stats.map((stat, index) => (
                      <div key={index} className="item-status">
                        <span className="status-number">{stat.number}</span>
                        <span className="status-type">{stat.type}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="view-actions">
                    <button 
                      className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`}
                      title="List View"
                      onClick={() => setViewMode('list')}
                    >
                      <List size={20} />
                    </button>
                    <button 
                      className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`}
                      title="Grid View"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={20} />
                    </button>
                    <button 
                      onClick={loadDashboardData}
                      title="Refresh Data"
                      style={{
                        marginLeft: '8px',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--main-color)',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      🔄
                    </button>
                  </div>
                </div>

                {/* Client Cards */}
                {clients.length > 0 ? (
                  <div className={`project-boxes ${viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
                    {clients.filter(c => !c.archived).map(client => renderClientCard(client))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '64px 32px',
                    color: 'var(--secondary-color)'
                  }}>
                    <Users size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
                    <h3 style={{ marginBottom: '16px', color: 'var(--main-color)' }}>No Clients Found</h3>
                    <p>Add your first client to get started with the FitPortal trainer dashboard.</p>
                  </div>
                )}
              </>
            )}

            {activeSection === 'analytics' && renderAnalyticsDashboard()}

            {activeSection === 'clients' && renderClientManagement()}

            {activeSection === 'exercise-list' && renderExerciseManagement()}

            {activeSection === 'workout-builder' && <EnhancedWorkoutBuilder />}

            {activeSection === 'calendar' && renderCalendar()}

            {activeSection === 'messages' && renderMessagesInterface()}

            {activeSection === 'settings' && renderSettings()}
          </div>

          {/* Messages Section - Only visible on dashboard */}
          {activeSection === 'dashboard' && (
            <div className={`messages-section ${showMessages ? 'show' : ''}`}>
              <button className="messages-close" onClick={() => setShowMessages(false)}>
                <X size={24} />
              </button>
              <div className="projects-section-header">
                <p>Client Messages</p>
              </div>
              {messages.map(msg => renderMessageBox(msg))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantTrainerDashboard;