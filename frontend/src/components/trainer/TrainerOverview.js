import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Clock,
  MessageSquare,
  Award,
  ChevronRight,
  Plus,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './TrainerOverview.css';

const TrainerOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  // Mock data
  const dashboardStats = [
    {
      label: 'Total Clients',
      value: '24',
      change: '+3 this month',
      trend: 'up',
      icon: Users,
      color: 'primary'
    },
    {
      label: 'Active Sessions',
      value: '156',
      change: '+12 this week',
      trend: 'up',
      icon: Calendar,
      color: 'success'
    },
    {
      label: 'Completion Rate',
      value: '94%',
      change: '+2% this month',
      trend: 'up',
      icon: Target,
      color: 'warning'
    },
    {
      label: 'Avg. Progress',
      value: '87%',
      change: '+5% improvement',
      trend: 'up',
      icon: TrendingUp,
      color: 'info'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4200, clients: 18, sessions: 120 },
    { month: 'Feb', revenue: 4800, clients: 20, sessions: 135 },
    { month: 'Mar', revenue: 5200, clients: 22, sessions: 148 },
    { month: 'Apr', revenue: 5800, clients: 24, sessions: 162 },
    { month: 'May', revenue: 6100, clients: 26, sessions: 175 },
    { month: 'Jun', revenue: 6500, clients: 28, sessions: 188 }
  ];

  const clientProgressData = [
    { name: 'Excellent', value: 35, color: '#10b981' },
    { name: 'Good', value: 45, color: '#3b82f6' },
    { name: 'Average', value: 15, color: '#f59e0b' },
    { name: 'Needs Help', value: 5, color: '#ef4444' }
  ];

  const weeklyData = [
    { day: 'Mon', sessions: 8, clients: 6 },
    { day: 'Tue', sessions: 12, clients: 8 },
    { day: 'Wed', sessions: 10, clients: 7 },
    { day: 'Thu', sessions: 15, clients: 10 },
    { day: 'Fri', sessions: 13, clients: 9 },
    { day: 'Sat', sessions: 18, clients: 12 },
    { day: 'Sun', sessions: 6, clients: 4 }
  ];

  const topClients = [
    { id: 1, name: 'Sarah Johnson', sessions: 24, progress: 95, avatar: 'SJ', status: 'excellent' },
    { id: 2, name: 'Mike Chen', sessions: 22, progress: 88, avatar: 'MC', status: 'good' },
    { id: 3, name: 'Lisa Davis', sessions: 20, progress: 92, avatar: 'LD', status: 'excellent' },
    { id: 4, name: 'John Smith', sessions: 18, progress: 78, avatar: 'JS', status: 'good' },
    { id: 5, name: 'Emma Wilson', sessions: 16, progress: 85, avatar: 'EW', status: 'good' }
  ];

  useEffect(() => {
    // Mock recent activity
    setRecentActivity([
      { id: 1, type: 'workout', client: 'Sarah Johnson', action: 'completed workout', time: '5 minutes ago', icon: CheckCircle, color: 'success' },
      { id: 2, type: 'message', client: 'Mike Chen', action: 'sent a message', time: '12 minutes ago', icon: MessageSquare, color: 'primary' },
      { id: 3, type: 'goal', client: 'Lisa Davis', action: 'achieved weight goal', time: '1 hour ago', icon: Award, color: 'warning' },
      { id: 4, type: 'session', client: 'John Smith', action: 'scheduled session', time: '2 hours ago', icon: Calendar, color: 'info' },
      { id: 5, type: 'alert', client: 'Emma Wilson', action: 'missed workout', time: '3 hours ago', icon: AlertCircle, color: 'error' }
    ]);

    // Mock upcoming sessions
    setUpcomingSessions([
      { id: 1, client: 'Sarah Johnson', time: '10:00 AM', type: 'Strength Training', avatar: 'SJ' },
      { id: 2, client: 'Mike Chen', time: '11:30 AM', type: 'Cardio Session', avatar: 'MC' },
      { id: 3, client: 'Lisa Davis', time: '2:00 PM', type: 'Yoga Flow', avatar: 'LD' },
      { id: 4, client: 'John Smith', time: '3:30 PM', type: 'Weight Training', avatar: 'JS' },
      { id: 5, client: 'Emma Wilson', time: '5:00 PM', type: 'HIIT Workout', avatar: 'EW' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'var(--color-success)';
      case 'good': return 'var(--color-info)';
      case 'average': return 'var(--color-warning)';
      default: return 'var(--color-error)';
    }
  };

  return (
    <div className="trainer-overview">
      <div className="overview-header">
        <div className="header-content">
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Mike! Here's what's happening with your clients today.</p>
        </div>
        <div className="header-actions">
          <select 
            className="period-selector"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="btn-primary">
            <Plus size={16} />
            New Session
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-menu">
                <MoreVertical size={16} />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">
                <TrendingUp size={14} />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>Revenue & Growth</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color primary"></span>
                <span>Revenue</span>
              </div>
              <div className="legend-item">
                <span className="legend-color success"></span>
                <span>Sessions</span>
              </div>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderLight)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-primary)" 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  strokeWidth={3}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Progress Pie Chart */}
        <div className="chart-card progress-chart">
          <div className="chart-header">
            <h3>Client Progress Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="progress-legend">
            {clientProgressData.map((item, index) => (
              <div key={index} className="progress-legend-item">
                <span 
                  className="progress-dot" 
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="progress-name">{item.name}</span>
                <span className="progress-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="chart-card weekly-activity">
        <div className="chart-header">
          <h3>Weekly Activity</h3>
          <div className="activity-summary">
            <div className="summary-item">
              <span className="summary-value">82</span>
              <span className="summary-label">Total Sessions</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">56</span>
              <span className="summary-label">Unique Clients</span>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderLight)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)'
                }}
              />
              <Bar dataKey="sessions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Top Clients */}
        <div className="dashboard-card top-clients">
          <div className="card-header">
            <h3>Top Performing Clients</h3>
            <button className="view-all-btn">
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="clients-list">
            {topClients.map(client => (
              <div key={client.id} className="client-item">
                <div className="client-avatar">{client.avatar}</div>
                <div className="client-info">
                  <div className="client-name">{client.name}</div>
                  <div className="client-sessions">{client.sessions} sessions</div>
                </div>
                <div className="client-progress">
                  <div className="progress-ring">
                    <svg width="40" height="40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="var(--color-borderLight)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke={getStatusColor(client.status)}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - client.progress / 100)}`}
                        transform="rotate(-90 20 20)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <span className="progress-text">{client.progress}%</span>
                  </div>
                </div>
                <button className="client-action">
                  <Eye size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="refresh-btn">
              <Activity size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.color}`}>
                  <activity.icon size={16} />
                </div>
                <div className="activity-content">
                  <div className="activity-text">
                    <strong>{activity.client}</strong> {activity.action}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="dashboard-card upcoming-sessions">
          <div className="card-header">
            <h3>Today's Sessions</h3>
            <span className="session-count">{upcomingSessions.length} sessions</span>
          </div>
          <div className="sessions-list">
            {upcomingSessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-time">{session.time}</div>
                <div className="session-details">
                  <div className="session-client">{session.client}</div>
                  <div className="session-type">{session.type}</div>
                </div>
                <div className="session-avatar">{session.avatar}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerOverview;