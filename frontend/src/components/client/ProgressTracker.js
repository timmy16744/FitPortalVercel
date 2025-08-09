import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Scale, 
  Ruler, 
  Target,
  BarChart3,
  LineChart,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Share,
  Award,
  Flame,
  Activity,
  Zap
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, Legend } from 'recharts';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showPhotoComparison, setShowPhotoComparison] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fileInputRef = useRef(null);

  const [weightData] = useState([
    { date: '2024-01-01', value: 180, change: 0 },
    { date: '2024-01-08', value: 179, change: -1 },
    { date: '2024-01-15', value: 177.5, change: -2.5 },
    { date: '2024-01-22', value: 176, change: -4 },
    { date: '2024-01-29', value: 175.5, change: -4.5 },
    { date: '2024-02-05', value: 174, change: -6 },
    { date: '2024-02-12', value: 173.5, change: -6.5 },
    { date: '2024-02-19', value: 172, change: -8 }
  ]);

  const [workoutData] = useState([
    { month: 'Jan', workouts: 12, calories: 4800, duration: 540 },
    { month: 'Feb', workouts: 16, calories: 6400, duration: 720 },
    { month: 'Mar', workouts: 18, calories: 7200, duration: 810 },
    { month: 'Apr', workouts: 20, calories: 8000, duration: 900 }
  ]);

  const [strengthData] = useState([
    { exercise: 'Bench Press', jan: 135, feb: 145, mar: 155, apr: 165 },
    { exercise: 'Squat', jan: 185, feb: 205, mar: 225, apr: 245 },
    { exercise: 'Deadlift', jan: 225, feb: 245, mar: 265, apr: 285 },
    { exercise: 'OHP', jan: 95, feb: 105, mar: 115, apr: 125 }
  ]);

  const samplePhotos = [
    { id: 1, date: '2024-01-01', url: '/api/placeholder/300/400', type: 'front', weight: 180 },
    { id: 2, date: '2024-01-01', url: '/api/placeholder/300/400', type: 'side', weight: 180 },
    { id: 3, date: '2024-02-01', url: '/api/placeholder/300/400', type: 'front', weight: 175 },
    { id: 4, date: '2024-02-01', url: '/api/placeholder/300/400', type: 'side', weight: 175 },
    { id: 5, date: '2024-03-01', url: '/api/placeholder/300/400', type: 'front', weight: 172 },
    { id: 6, date: '2024-03-01', url: '/api/placeholder/300/400', type: 'side', weight: 172 }
  ];

  useEffect(() => {
    setProgressPhotos(samplePhotos);
    loadMeasurements();
  }, []);

  const loadMeasurements = () => {
    const sampleMeasurements = [
      { date: '2024-01-01', weight: 180, bodyFat: 18, chest: 42, waist: 34, hips: 38, bicep: 15, thigh: 24 },
      { date: '2024-02-01', weight: 175, bodyFat: 16, chest: 43, waist: 32, hips: 37, bicep: 15.5, thigh: 24.5 },
      { date: '2024-03-01', weight: 172, bodyFat: 14, chest: 44, waist: 31, hips: 36, bicep: 16, thigh: 25 }
    ];
    setMeasurements(sampleMeasurements);
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          date: new Date().toISOString().split('T')[0],
          url: e.target.result,
          type: 'front',
          weight: measurements.length > 0 ? measurements[measurements.length - 1].weight : null
        };
        setProgressPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const openPhotoComparison = (photo) => {
    const sameType = progressPhotos.filter(p => p.type === photo.type);
    setSelectedPhotos(sameType);
    setCurrentPhotoIndex(sameType.findIndex(p => p.id === photo.id));
    setShowPhotoComparison(true);
  };

  const getMeasurementChange = (metric) => {
    if (measurements.length < 2) return { value: 0, trend: 'neutral' };
    const latest = measurements[measurements.length - 1][metric];
    const previous = measurements[measurements.length - 2][metric];
    const change = latest - previous;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    return { value: Math.abs(change), trend };
  };

  const renderOverview = () => (
    <div className="progress-overview">
      <div className="stats-grid">
        <div className="stat-card weight-card">
          <div className="stat-header">
            <Scale className="stat-icon" />
            <span className="stat-label">Weight</span>
          </div>
          <div className="stat-value">
            {measurements.length > 0 ? measurements[measurements.length - 1].weight : 0} lbs
          </div>
          <div className={`stat-change ${getMeasurementChange('weight').trend}`}>
            {getMeasurementChange('weight').trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {getMeasurementChange('weight').value} lbs this month
          </div>
        </div>

        <div className="stat-card body-fat-card">
          <div className="stat-header">
            <Target className="stat-icon" />
            <span className="stat-label">Body Fat</span>
          </div>
          <div className="stat-value">
            {measurements.length > 0 ? measurements[measurements.length - 1].bodyFat : 0}%
          </div>
          <div className={`stat-change ${getMeasurementChange('bodyFat').trend}`}>
            {getMeasurementChange('bodyFat').trend === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {getMeasurementChange('bodyFat').value}% this month
          </div>
        </div>

        <div className="stat-card workouts-card">
          <div className="stat-header">
            <Activity className="stat-icon" />
            <span className="stat-label">Workouts</span>
          </div>
          <div className="stat-value">20</div>
          <div className="stat-change up">
            <TrendingUp size={14} />
            +4 vs last month
          </div>
        </div>

        <div className="stat-card calories-card">
          <div className="stat-header">
            <Flame className="stat-icon" />
            <span className="stat-label">Calories Burned</span>
          </div>
          <div className="stat-value">8,000</div>
          <div className="stat-change up">
            <TrendingUp size={14} />
            +800 vs last month
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Weight Progress</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLineChart data={weightData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value) => [`${value} lbs`, 'Weight']}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="achievements-section">
        <h3>Recent Achievements</h3>
        <div className="achievements-list">
          <div className="achievement-item">
            <Award className="achievement-icon" />
            <div className="achievement-content">
              <h4>Weight Loss Warrior</h4>
              <p>Lost 8 lbs in 2 months!</p>
            </div>
          </div>
          <div className="achievement-item">
            <Zap className="achievement-icon" />
            <div className="achievement-content">
              <h4>Consistency King</h4>
              <p>20 workouts completed this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeasurements = () => (
    <div className="measurements-section">
      <div className="section-header">
        <h2>Body Measurements</h2>
        <button 
          className="add-measurement-btn"
          onClick={() => setShowAddMeasurement(true)}
        >
          <Plus size={16} />
          Add Measurement
        </button>
      </div>

      <div className="measurement-cards">
        {['weight', 'bodyFat', 'chest', 'waist', 'hips', 'bicep', 'thigh'].map(metric => (
          <div 
            key={metric}
            className={`measurement-card ${selectedMetric === metric ? 'active' : ''}`}
            onClick={() => setSelectedMetric(metric)}
          >
            <div className="measurement-label">
              {metric === 'bodyFat' ? 'Body Fat' : metric.charAt(0).toUpperCase() + metric.slice(1)}
            </div>
            <div className="measurement-value">
              {measurements.length > 0 ? measurements[measurements.length - 1][metric] : 0}
              {metric === 'weight' ? ' lbs' : metric === 'bodyFat' ? '%' : '"'}
            </div>
            <div className={`measurement-change ${getMeasurementChange(metric).trend}`}>
              {getMeasurementChange(metric).trend !== 'neutral' && (
                getMeasurementChange(metric).trend === 'down' ? <TrendingDown size={12} /> : <TrendingUp size={12} />
              )}
              {getMeasurementChange(metric).value > 0 ? `${getMeasurementChange(metric).value}` : 'No change'}
            </div>
          </div>
        ))}
      </div>

      <div className="measurement-chart">
        <h3>{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Progress</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={measurements}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                axisLine={false}
                tickLine={false}
              />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderLight)" />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 5 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="photos-section">
      <div className="section-header">
        <h2>Progress Photos</h2>
        <button 
          className="add-photo-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={16} />
          Add Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />
      </div>

      <div className="photo-filters">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Front</button>
        <button className="filter-btn">Side</button>
        <button className="filter-btn">Back</button>
      </div>

      <div className="photos-grid">
        {progressPhotos.map(photo => (
          <div key={photo.id} className="photo-card" onClick={() => openPhotoComparison(photo)}>
            <img src={photo.url} alt={`Progress ${photo.date}`} />
            <div className="photo-overlay">
              <div className="photo-date">{new Date(photo.date).toLocaleDateString()}</div>
              <div className="photo-weight">{photo.weight ? `${photo.weight} lbs` : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="workouts-analytics">
      <h2>Workout Analytics</h2>
      
      <div className="analytics-charts">
        <div className="chart-section">
          <h3>Monthly Workout Summary</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workoutData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderLight)" />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)'
                  }}
                />
                <Legend />
                <Bar dataKey="workouts" fill="var(--color-primary)" name="Workouts" />
                <Bar dataKey="duration" fill="var(--color-secondary)" name="Duration (mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-section">
          <h3>Strength Progress</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={strengthData} layout="horizontal">
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="exercise" type="category" axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borderLight)" />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)'
                  }}
                />
                <Legend />
                <Bar dataKey="jan" fill="#8884d8" name="Jan" />
                <Bar dataKey="apr" fill="var(--color-primary)" name="Apr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="progress-tracker">
      <div className="tracker-header">
        <h1>Progress Tracking</h1>
        <div className="date-range">
          <Calendar size={16} />
          <span>Last 3 months</span>
        </div>
      </div>

      <div className="progress-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Measurements
        </button>
        <button 
          className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button 
          className={`tab ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'measurements' && renderMeasurements()}
        {activeTab === 'photos' && renderPhotos()}
        {activeTab === 'workouts' && renderWorkouts()}
      </div>

      {showPhotoComparison && (
        <div className="photo-comparison-modal">
          <div className="modal-header">
            <h3>Photo Comparison</h3>
            <button onClick={() => setShowPhotoComparison(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="comparison-content">
            <div className="photo-navigation">
              <button 
                onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                disabled={currentPhotoIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <span>{currentPhotoIndex + 1} of {selectedPhotos.length}</span>
              <button 
                onClick={() => setCurrentPhotoIndex(Math.min(selectedPhotos.length - 1, currentPhotoIndex + 1))}
                disabled={currentPhotoIndex === selectedPhotos.length - 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            {selectedPhotos[currentPhotoIndex] && (
              <div className="comparison-photo">
                <img src={selectedPhotos[currentPhotoIndex].url} alt="Progress comparison" />
                <div className="photo-info">
                  <p>Date: {new Date(selectedPhotos[currentPhotoIndex].date).toLocaleDateString()}</p>
                  <p>Weight: {selectedPhotos[currentPhotoIndex].weight} lbs</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;