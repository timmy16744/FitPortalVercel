import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { useNotification } from '../utils/NotificationContext';
import TrainerMainContent from './TrainerMainContent';

const TrainerDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();

  useEffect(() => {
    // Update active section based on current route
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveSection(path);
  }, [location]);

  const sidebarItems = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/trainer', color: 'from-blue-500 to-blue-600' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/trainer/analytics', color: 'from-purple-500 to-purple-600' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/trainer/calendar', color: 'from-green-500 to-green-600' },
      ]
    },
    {
      section: 'management',
      title: 'Management',
      items: [
        { id: 'clients', label: 'Clients', icon: Users, path: '/trainer/clients', color: 'from-indigo-500 to-indigo-600' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/trainer/messages', color: 'from-pink-500 to-pink-600', badge: 5 },
      ]
    },
    {
      section: 'library',
      title: 'Library',
      items: [
        { id: 'exercises', label: 'Exercises', icon: Dumbbell, path: '/trainer/exercises', color: 'from-orange-500 to-orange-600' },
        { id: 'workouts', label: 'Workouts', icon: Zap, path: '/trainer/workouts', color: 'from-yellow-500 to-yellow-600' },
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    showSuccess('Successfully logged out', 'See you soon!');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-accent-bg to-primary-bg flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-20 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="h-full glass-card rounded-none rounded-r-3xl border-l-0 border-y-0 p-6 flex flex-col">
          {/* Brand Section */}
          <motion.div
            className="flex items-center gap-4 mb-8 pb-6 border-b border-border-light"
            layout
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-display bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                  FitPortal
                </h2>
                <p className="text-sm text-text-muted">Trainer Portal</p>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation Sections */}
          <nav className="flex-1 space-y-6">
            {sidebarItems.map((section, sectionIndex) => (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 + 0.3 }}
              >
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * section.items.length + itemIndex) * 0.05 + 0.4 }}
                      >
                        <motion.button
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                              : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          title={sidebarCollapsed ? item.label : ''}
                        >
                          {/* Shimmer effect for active item */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                          
                          <div className={`relative z-10 ${
                            isActive ? 'text-white' : 'text-text-secondary group-hover:text-brand-primary'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          {!sidebarCollapsed && (
                            <>
                              <span className="font-medium relative z-10">{item.label}</span>
                              {item.badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto bg-brand-accent text-white text-xs px-2 py-1 rounded-full font-semibold relative z-10"
                                >
                                  {item.badge}
                                </motion.span>
                              )}
                            </>
                          )}
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </nav>

          {/* User Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-6 border-t border-border-light"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-secondary-bg to-accent-bg">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {user?.name || 'Dr. Sarah Wilson'}
                  </p>
                  <p className="text-sm text-text-muted truncate">
                    {user?.role || 'Fitness Trainer'}
                  </p>
                </div>
              )}
              <motion.button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-none border-x-0 border-t-0 p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-hover-bg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </motion.button>
            
            <form onSubmit={handleSearch} className="relative">
              <div className="input-group max-w-md">
                <Search className="input-icon w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients, workouts, exercises..."
                  className="input pl-12 bg-secondary-bg/50"
                />
                </svg>
                <span className="sidebar-link-text">Client Management</span>
              </Link>
            </div>
            
            <div className="nav-section">
              <div className="nav-section-title">Library</div>
              <Link to="/trainer/exercises" className={`app-sidebar-link ${location.pathname === '/trainer/exercises' ? 'active' : ''}`}>
                <svg className="sidebar-link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6.5 6.5 11 11"/>
                  <path d="m21 21-1-1"/>
                  <path d="m3 3 1 1"/>
                  <path d="m18 22 4-4"/>
                  <path d="m2 6 4-4"/>
                  <path d="m3 10 7-7"/>
                  <path d="m14 21 7-7"/>
                </svg>
                <span className="sidebar-link-text">Exercise Library</span>
              </Link>
              <Link to="/trainer/workouts" className={`app-sidebar-link ${location.pathname === '/trainer/workouts' ? 'active' : ''}`}>
                <svg className="sidebar-link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="3" height="18" x="3" y="4" rx="2"/>
                  <rect width="3" height="18" x="12" y="4" rx="2"/>
                  <path d="M8 22V4"/>
                  <path d="M16 22V4"/>
                </svg>
                <span className="sidebar-link-text">Workout Builder</span>
              </Link>
            </div>
          </div>
          
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">T</div>
              <div className="sidebar-user-info">
                <h4>Trainer</h4>
                <p>Professional</p>
              </div>
            </div>
          </div>
        </nav>

        {/* The main content is now handled by TrainerMainContent, which contains the nested routes */}
        <TrainerMainContent renderDashboard={renderDashboard} />

        <div className={`messages-section ${showMessages ? 'show' : ''}`}>
           {/* ... (messages section remains the same) ... */}
        </div>
      </div>
    </div>
  );
}

export default TrainerDashboard;