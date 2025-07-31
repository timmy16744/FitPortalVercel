import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  BarChart3,
  MessageSquare,
  Settings,
  Home,
  Search,
  Bell,
  User,
  LogOut,
  Zap,
  Calendar,
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import { useTheme } from '../../hooks/useTheme';
import TrainerMainContent from '../TrainerMainContent';
import TrainerDashboardHome from './TrainerDashboardHome';
import '../../styles/enhanced-design-system.css';

const TrainerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Update active section based on current route
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveSection(path);
  }, [location]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/trainer' },
    { id: 'clients', label: 'Clients', icon: Users, path: '/trainer/clients' },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell, path: '/trainer/exercises' },
    { id: 'workouts', label: 'Workouts', icon: Zap, path: '/trainer/workouts' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/trainer/analytics' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/trainer/messages', badge: 5 },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/trainer/calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/trainer/settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    showSuccess('Successfully logged out', 'See you soon!');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-icon"></div>
          <p className="app-name">FitPortal</p>
          <div className="search-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="Search clients, workouts, exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5" />
          </div>
        </div>
        
        <div className="app-header-right">
          <button
            onClick={toggleTheme}
            className="mode-switch hover-scale"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          
          <button
            className="add-btn hover-scale"
            title="Add New Client"
            onClick={() => navigate('/trainer/clients/new')}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            className="notification-btn"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs px-2 py-1 rounded-full font-semibold min-w-[20px] h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          
          <button
            className="profile-btn"
            onClick={() => navigate('/trainer/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>{user?.name || 'Trainer'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {/* Sidebar */}
        <div className="app-sidebar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                  setActiveSection(item.id);
                }}
                className={`app-sidebar-link ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs px-2 py-1 rounded-full font-semibold min-w-[16px] h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="app-sidebar-link mt-auto"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="projects-section-wrapper">
          <TrainerMainContent renderDashboard={() => <TrainerDashboardHome />} />
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
