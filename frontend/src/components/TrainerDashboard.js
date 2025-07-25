import React, { useState, useEffect } from 'react';
import ApiClient from '../utils/api';

const TrainerDashboard = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const clientsData = await ApiClient.getClients('active');
      
      // Transform backend data to match UI format
      const transformedClients = clientsData.map((client, index) => {
        const colors = [
          { bg: '#fee4cb', progress: '#ff942e' },
          { bg: '#e9e7fd', progress: '#4f3ff0' },
          { bg: '#c8f7dc', progress: '#34c471' },
          { bg: '#ffd3e2', progress: '#df3670' },
          { bg: '#d5deff', progress: '#4067f9' }
        ];
        const colorSet = colors[index % colors.length];
        
        return {
          id: client.id,
          name: client.name,
          program: getClientProgram(client),
          progress: getClientProgress(client),
          startDate: formatDate(new Date()),
          status: client.archived ? 'archived' : 'active',
          nextSession: getNextSession(),
          avatar: getAvatarUrl(client.name, index),
          trainer: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
          backgroundColor: colorSet.bg,
          progressColor: colorSet.progress
        };
      });
      
      setClients(transformedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients');
      // Fallback to mock data if backend is unavailable
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    const mockClients = [
      {
        id: 1,
        name: 'Sarah Johnson',
        program: 'Weight Loss',
        progress: 75,
        startDate: 'Dec 1, 2024',
        status: 'active',
        nextSession: '2 Days',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80',
        trainer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
        backgroundColor: '#fee4cb',
        progressColor: '#ff942e'
      },
      {
        id: 2,
        name: 'Mike Chen',
        program: 'Muscle Building',
        progress: 60,
        startDate: 'Nov 15, 2024',
        status: 'active',
        nextSession: '1 Day',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80',
        trainer: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
        backgroundColor: '#e9e7fd',
        progressColor: '#4f3ff0'
      },
      {
        id: 3,
        name: 'Emma Davis',
        program: 'Athletic Performance',
        progress: 85,
        startDate: 'Oct 20, 2024',
        status: 'active',
        nextSession: '3 Days',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80',
        trainer: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
        backgroundColor: '#c8f7dc',
        progressColor: '#34c471'
      },
      {
        id: 4,
        name: 'Alex Rodriguez',
        program: 'Rehabilitation',
        progress: 40,
        startDate: 'Dec 5, 2024',
        status: 'active',
        nextSession: '1 Day',
        avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80',
        trainer: 'https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
        backgroundColor: '#ffd3e2',
        progressColor: '#df3670'
      },
      {
        id: 5,
        name: 'Jordan Taylor',
        program: 'Endurance Training',
        progress: 70,
        startDate: 'Nov 8, 2024',
        status: 'active',
        nextSession: '4 Days',
        avatar: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80',
        trainer: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=20&h=20&q=80',
        backgroundColor: '#d5deff',
        progressColor: '#4067f9'
      }
    ];
    setClients(mockClients);
  };

  // Helper functions
  const getClientProgram = (client) => {
    if (client.goals) {
      if (client.goals.toLowerCase().includes('weight loss')) return 'Weight Loss';
      if (client.goals.toLowerCase().includes('muscle') || client.goals.toLowerCase().includes('strength')) return 'Muscle Building';
      if (client.goals.toLowerCase().includes('athletic') || client.goals.toLowerCase().includes('performance')) return 'Athletic Performance';
      if (client.goals.toLowerCase().includes('rehab')) return 'Rehabilitation';
      if (client.goals.toLowerCase().includes('endurance') || client.goals.toLowerCase().includes('cardio')) return 'Endurance Training';
    }
    return 'General Fitness';
  };

  const getClientProgress = (client) => {
    // Calculate progress based on client data (simplified)
    const factors = [];
    if (client.workout_frequency) factors.push(Math.min(client.workout_frequency * 10, 40));
    if (client.age) factors.push(client.age < 30 ? 30 : client.age < 50 ? 25 : 20);
    factors.push(Math.random() * 40 + 20); // Random baseline
    
    const average = factors.reduce((a, b) => a + b, 0) / factors.length;
    return Math.min(Math.max(Math.round(average), 10), 95);
  };

  const getNextSession = () => {
    const options = ['1 Day', '2 Days', '3 Days', '4 Days', '1 Week'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getAvatarUrl = (name, index) => {
    // Use a more reliable avatar service to avoid CORS issues
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8'];
    const color = colors[index % colors.length];
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=40&rounded=true&bold=true`;
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  if (isLoading) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Clients</p>
          <p className="time">Loading...</p>
        </div>
        <div className="card text-center py-12">
          <div className="skeleton" style={{ width: '200px', height: '20px', borderRadius: '10px', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Clients</p>
          <p className="time">Error</p>
        </div>
        <div className="card text-center py-12">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchClients}
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-section">
      <div className="projects-section-header">
        <p>Clients</p>
        <p className="time">December, 12</p>
      </div>
      
      <div className="projects-section-line">
        <div className="projects-status">
          <div className="item-status">
            <span className="status-number">{clients.length}</span>
            <span className="status-type">Active Clients</span>
          </div>
          <div className="item-status">
            <span className="status-number">{Math.floor(clients.length * 0.3)}</span>
            <span className="status-type">New This Week</span>
          </div>
          <div className="item-status">
            <span className="status-number">{clients.length * 3}</span>
            <span className="status-type">Total Sessions</span>
          </div>
        </div>
        
        <div className="view-actions">
          <button 
            className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`} 
            title="List View"
            onClick={() => handleViewChange('list')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button 
            className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`} 
            title="Grid View"
            onClick={() => handleViewChange('grid')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`project-boxes ${viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
        {clients.map((client) => (
          <div key={client.id} className="project-box-wrapper">
            <div className="project-box" style={{ backgroundColor: client.backgroundColor }}>
              <div className="project-box-header">
                <span>{client.startDate}</span>
                <div className="more-wrapper">
                  <button className="project-btn-more">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
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
                      backgroundColor: client.progressColor 
                    }}
                  ></span>
                </div>
                <p className="box-progress-percentage">{client.progress}%</p>
              </div>
              
              <div className="project-box-footer">
                <div className="participants">
                  <img src={client.avatar} alt="client" />
                  <img src={client.trainer} alt="trainer" />
                  <button className="add-participant" style={{ color: client.progressColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
                <div className="days-left" style={{ color: client.progressColor }}>
                  {client.nextSession} Left
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerDashboard; 