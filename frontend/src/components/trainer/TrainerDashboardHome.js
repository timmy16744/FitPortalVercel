import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Dumbbell,
  Target,
  Plus,
  ArrowRight,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import '../../styles/enhanced-design-system.css';

const TrainerDashboardHome = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [stats] = useState({
    totalClients: 24,
    activeWorkouts: 12,
    completedSessions: 156,
    monthlyRevenue: 8400
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useNotification();
  
  // Cache date calculation
  const currentDate = useMemo(() => 
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }), []
  );
  const shortDate = useMemo(() => new Date().toLocaleDateString(), []);

  // Memoized navigation handlers
  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);
  
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);
  
  useEffect(() => {
    // Simulate loading dashboard data - reduced timeout
    const timer = setTimeout(() => {
      showSuccess('Dashboard loaded!');
    }, 500);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Memoized stat cards to prevent recreation on every render
  const statCards = useMemo(() => [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users
    },
    {
      title: 'Active Workouts', 
      value: stats.activeWorkouts,
      icon: Dumbbell
    },
    {
      title: 'Sessions This Month',
      value: stats.completedSessions,
      icon: Target
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp
    }
  ], [stats]);

  // Memoized project boxes with stable references
  const projectBoxes = useMemo(() => [
    {
      id: 'add-client',
      title: 'Add New Client',
      subtitle: 'Expand your fitness business',
      bgClass: 'bg-orange-100',
      progressClass: 'bg-orange-500',
      textClass: 'text-orange-600',
      progress: 100,
      progressText: 'Ready',
      icon: Plus,
      actionText: 'Start Now',
      path: '/trainer/clients'
    },
    {
      id: 'exercises',
      title: 'Exercise Management',
      subtitle: 'Create and manage workouts',
      bgClass: 'bg-purple-100',
      progressClass: 'bg-purple-500',
      textClass: 'text-purple-600',
      progress: 75,
      progressText: '75%',
      icon: Dumbbell,
      actionText: `${stats.activeWorkouts} Active`,
      path: '/trainer/exercises'
    },
    {
      id: 'analytics',
      title: 'Performance Tracking',
      subtitle: 'Monitor your business growth',
      bgClass: 'bg-cyan-100',
      progressClass: 'bg-cyan-500',
      textClass: 'text-cyan-600',
      progress: 85,
      progressText: '85%',
      icon: BarChart3,
      actionText: '+23% Growth',
      path: '/trainer/analytics'
    },
    {
      id: 'clients',
      title: 'Client Management',
      subtitle: 'Manage all your clients',
      bgClass: 'bg-amber-100',
      progressClass: 'bg-amber-500',
      textClass: 'text-amber-600',
      progress: 90,
      progressText: '90%',
      icon: Users,
      actionText: `${stats.totalClients} Clients`,
      path: '/trainer/clients'
    },
    {
      id: 'messages',
      title: 'Communication',
      subtitle: 'Stay connected with clients',
      bgClass: 'bg-blue-100',
      progressClass: 'bg-blue-500',
      textClass: 'text-blue-600',
      progress: 95,
      progressText: '95%',
      icon: MessageSquare,
      actionText: '5 New',
      path: '/trainer/messages'
    },
    {
      id: 'calendar',
      title: 'Schedule',
      subtitle: 'Manage appointments',
      bgClass: 'bg-green-100',
      progressClass: 'bg-green-500',
      textClass: 'text-green-600',
      progress: 60,
      progressText: '60%',
      icon: Calendar,
      actionText: '3 Today',
      path: '/trainer/calendar'
    }
  ], [stats.activeWorkouts, stats.totalClients]);

  return (
    <div className="projects-section">
      {/* Header */}
      <div className="projects-section-header">
        <p>Dashboard</p>
        <p className="time">{currentDate}</p>
      </div>
      
      {/* Status Line */}
      <div className="projects-section-line">
        <div className="projects-status">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="item-status">
                <span className="status-number">{stat.value}</span>
                <span className="status-type">{stat.title}</span>
              </div>
            );
          })}
        </div>
        
        <div className="view-actions">
          <button
            onClick={() => handleViewModeChange('list')}
            className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`}
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Boxes */}
      <div className={`project-boxes ${viewMode === 'list' ? 'jsListView' : 'jsGridView'}`}>
        {projectBoxes.map((box) => {
          const Icon = box.icon;
          return (
            <div key={box.id} className="project-box-wrapper">
              <div 
                className={`project-box cursor-pointer ${box.bgClass}`}
                onClick={() => handleNavigation(box.path)}
              >
                <div className="project-box-header">
                  <span>{shortDate}</span>
                  <div className="more-wrapper">
                    <button className="project-btn-more">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="project-box-content-header">
                  <p className="box-content-header">{box.title}</p>
                  <p className="box-content-subheader">{box.subtitle}</p>
                </div>
                <div className="box-progress-wrapper">
                  <p className="box-progress-header">Progress</p>
                  <div className="box-progress-bar">
                    <span 
                      className={`box-progress ${box.progressClass}`}
                      style={{ width: `${box.progress}%` }}
                    ></span>
                  </div>
                  <p className="box-progress-percentage">{box.progressText}</p>
                </div>
                <div className="project-box-footer">
                  <div className="participants">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${box.progressClass}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <button 
                      className="add-participant"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(box.path);
                      }}
                      title={`Go to ${box.title}`}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className={`days-left ${box.textClass}`}>
                    {box.actionText}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerDashboardHome;
