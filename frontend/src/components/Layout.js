import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Dumbbell, 
  BarChart3, 
  MessageCircle, 
  UserPlus, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
      description: 'Manage Your Athletes'
    },
    {
      name: 'Exercises',
      href: '/exercises',
      icon: Dumbbell,
      description: 'Exercise Library'
    },
    {
      name: 'Workouts',
      href: '/workouts',
      icon: Calendar,
      description: 'Templates & Programs'
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: BarChart3,
      description: 'Track Performance'
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageCircle,
      description: 'Client Communication'
    },
  ];

  const quickActions = [
    {
      name: 'Add Client',
      href: '/clients/new',
      icon: UserPlus,
      color: 'gradient-blue'
    },
    {
      name: 'Create Workout',
      href: '/workouts/new',
      icon: Target,
      color: 'gradient-green'
    },
    {
      name: 'Sync Exercises',
      href: '#',
      icon: Zap,
      color: 'gradient-orange',
      action: 'sync'
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-warm-black text-warm-white noise">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-warm-gray border-r border-warm-gray-light transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-warm-gray-light">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">TRAINER PORTAL</h1>
                <p className="text-xs text-warm-white opacity-60 uppercase tracking-wide">Professional Edition</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-warm-gray-light rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${active 
                        ? 'bg-warm-white text-warm-black shadow-lg' 
                        : 'text-warm-white hover:bg-warm-gray-light'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`
                      mr-3 h-5 w-5 transition-colors
                      ${active ? 'text-warm-black' : 'text-warm-white opacity-70 group-hover:opacity-100'}
                    `} />
                    <div className="flex-1">
                      <div className={`font-semibold ${active ? 'text-warm-black' : 'text-warm-white'}`}>
                        {item.name}
                      </div>
                      <div className={`text-xs ${active ? 'text-warm-black opacity-60' : 'text-warm-white opacity-50'}`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-6">
              <h3 className="px-4 text-xs font-semibold text-warm-white opacity-60 uppercase tracking-wide mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      to={action.href}
                      className={`
                        group flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
                        hover:bg-warm-gray-light text-warm-white
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {action.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-warm-gray-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warm-white rounded-full flex items-center justify-center">
                <span className="text-warm-black font-bold text-sm">PT</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-warm-white">Personal Trainer</div>
                <div className="text-xs text-warm-white opacity-60">Professional Account</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-warm-white hover:bg-warm-gray-light rounded-lg transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-warm-white hover:bg-red-600 hover:text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-warm-gray border-b border-warm-gray-light">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-warm-gray-light rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-blue rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">TRAINER PORTAL</h1>
          </div>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 