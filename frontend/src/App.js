import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import ExerciseLibrary from './components/ExerciseLibrary';
import WorkoutEditor from './components/WorkoutEditor';
import ClientManagement from './components/ClientManagement';
import ClientDashboard from './components/ClientDashboard';

// Fitness/trainer sample data for dashboard cards
const fitnessProjects = [
  {
    id: 1,
    name: "Client Onboarding",
    description: "New members setup",
    progress: 85,
    date: "Today",
    color: "#fee4cb",
    progressColor: "#ff942e",
    participants: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
    ],
    daysLeft: "3 New Today"
  },
  {
    id: 2,
    name: "Workout Plans",
    description: "Program design",
    progress: 60,
    date: "This Week",
    color: "#e9e7fd",
    progressColor: "#4f3ff0",
    participants: [
      "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80",
      "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80"
    ],
    daysLeft: "12 Active"
  },
  {
    id: 3,
    name: "Progress Tracking",
    description: "Client assessments",
    progress: 75,
    date: "This Month",
    color: "#dbf6fd",
    progressColor: "#096c86",
    participants: [
      "https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
      "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1215&q=80"
    ],
    daysLeft: "8 Pending"
  },
  {
    id: 4,
    name: "Nutrition Plans",
    description: "Meal planning",
    progress: 40,
    date: "Next Week",
    color: "#ffd3e2",
    progressColor: "#df3670",
    participants: [
      "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
    ],
    daysLeft: "5 Due Soon"
  },
  {
    id: 5,
    name: "Group Classes",
    description: "Schedule management",
    progress: 90,
    date: "Today",
    color: "#c8f7dc",
    progressColor: "#34c471",
    participants: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
    ],
    daysLeft: "15 Scheduled"
  },
  {
    id: 6,
    name: "Client Reports",
    description: "Analytics review",
    progress: 55,
    date: "This Week",
    color: "#d5deff",
    progressColor: "#4067f9",
    participants: [
      "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
      "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2555&q=80"
    ],
    daysLeft: "Weekly Review"
  }
];

// Sample client messages for the messages section
const clientMessages = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
    message: "Thanks for the new workout plan! I'm already feeling stronger after just one week. 💪",
    time: "2 hours ago",
    starred: false
  },
  {
    id: 2,
    name: "Mike Chen",
    image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
    message: "Can we schedule a nutrition consultation? I want to optimize my meal plan.",
    time: "5 hours ago",
    starred: true
  },
  {
    id: 3,
    name: "Emma Davis",
    image: "https://images.unsplash.com/photo-1543965170-4c01a586684e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDZ8fG1hbnxlbnwwfDB8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    message: "The HIIT session was amazing! 🔥 Looking forward to tomorrow's strength training.",
    time: "1 day ago",
    starred: false
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    image: "https://images.unsplash.com/photo-1533993192821-2cce3a8267d1?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTl8fHdvbWFuJTIwbW9kZXJufGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60",
    message: "I've hit my weight loss goal! Thank you for all the support and guidance.",
    time: "2 days ago",
    starred: true
  }
];

function App() {
  const [showMessages, setShowMessages] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  // Get current date for header
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderDashboard = () => (
    <div className="projects-section">
      <div className="projects-section-header">
        <p>Trainer Dashboard</p>
        <p className="time">{getCurrentDate()}</p>
      </div>
      <div className="projects-section-line">
        <div className="projects-status">
          <div className="item-status">
            <span className="status-number">24</span>
            <span className="status-type">Active Clients</span>
          </div>
          <div className="item-status">
            <span className="status-number">8</span>
            <span className="status-type">New This Week</span>
          </div>
          <div className="item-status">
            <span className="status-number">156</span>
            <span className="status-type">Total Workouts</span>
          </div>
        </div>
        <div className="view-actions">
          <button 
            className={`view-btn list-view ${viewMode === 'list' ? 'active' : ''}`}
            title="List View"
            onClick={() => setViewMode('list')}
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
            className={`view-btn grid-view ${viewMode === 'grid' ? 'active' : ''}`}
            title="Grid View"
            onClick={() => setViewMode('grid')}
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
      <div className={`project-boxes ${viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
        {fitnessProjects.map((project) => (
          <div key={project.id} className="project-box-wrapper">
            <div className="project-box" style={{ backgroundColor: project.color }}>
              <div className="project-box-header">
                <span>{project.date}</span>
                <div className="more-wrapper">
                  <button className="project-btn-more">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="project-box-content-header">
                <p className="box-content-header">{project.name}</p>
                <p className="box-content-subheader">{project.description}</p>
              </div>
              <div className="box-progress-wrapper">
                <p className="box-progress-header">Progress</p>
                <div className="box-progress-bar">
                  <span 
                    className="box-progress" 
                    style={{ 
                      width: `${project.progress}%`, 
                      backgroundColor: project.progressColor 
                    }}
                  ></span>
                </div>
                <p className="box-progress-percentage">{project.progress}%</p>
              </div>
              <div className="project-box-footer">
                <div className="participants">
                  {project.participants.map((participant, index) => (
                    <img key={index} src={participant} alt="participant" />
                  ))}
                  <button className="add-participant" style={{ color: project.progressColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
                <div className="days-left" style={{ color: project.progressColor }}>
                  {project.daysLeft}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">FitPortal</p>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Search clients..." />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div className="app-header-right">
          <button 
            className="mode-switch" 
            title="Switch Theme"
            onClick={() => setDarkMode(!darkMode)}
          >
            <svg className="moon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </button>
          <button className="add-btn" title="Add New Workout">
            <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="profile-btn">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
            <span>Coach Alex</span>
          </button>
        </div>
        <button 
          className="messages-btn"
          onClick={() => setShowMessages(!showMessages)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      </div>
      <div className="app-content">
        <div className="app-sidebar">
          <button onClick={() => navigate('/')}>Dashboard</button>
          <button onClick={() => navigate('/clients')}>Clients</button>
          <button onClick={() => navigate('/exercises')}>Exercise Library</button>
          <button onClick={() => navigate('/workouts')}>Workout Builder</button>
        </div>
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="/clients" element={<ClientManagement onSelectClient={(id) => navigate(`/client/${id}`)} />} />
          <Route path="/client/:clientId" element={<ClientDashboard onBack={() => navigate('/clients')} />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/workouts" element={<WorkoutEditor onClose={() => navigate('/')} />} />
        </Routes>
        <div className={`messages-section ${showMessages ? 'show' : ''}`}>
          <button 
            className="messages-close"
            onClick={() => setShowMessages(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
          <div className="projects-section-header">
            <p>Client Messages</p>
          </div>
          <div className="messages">
            {clientMessages.map((message) => (
              <div key={message.id} className="message-box">
                <img src={message.image} alt="client" />
                <div className="message-content">
                  <div className="message-header">
                    <div className="name">{message.name}</div>
                    <div className="star-checkbox">
                      <input type="checkbox" id={`star-${message.id}`} defaultChecked={message.starred} />
                      <label htmlFor={`star-${message.id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <p className="message-line">
                    {message.message}
                  </p>
                  <p className="message-line time">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
