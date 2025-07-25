import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit3, GripVertical, X, Calendar, Target, ChevronDown, ArrowLeft, Timer } from 'lucide-react';
import ApiClient from '../utils/api';
import { getCategoryColor } from '../utils/exerciseUtils';

const WorkoutEditor = () => {
  const [templates, setTemplates] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [searchExercises, setSearchExercises] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Template structure for editing
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    days: []
  });

  // Drag and drop state
  const [draggedExercise, setDraggedExercise] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [templatesData, exercisesData] = await Promise.all([
        ApiClient.getWorkoutTemplates(),
        ApiClient.getExercisesEnhanced(1, 100) // Load more exercises for library
      ]);
      
      setTemplates(templatesData || []);
      setExercises(exercisesData.exercises || []);
      setCategories(exercisesData.categories || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load workout data');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTemplate = () => {
    setCurrentTemplate(null);
    setTemplateData({
      name: 'UULL',
      description: 'Upper/Upper/Lower/Lower split workout',
      days: [
        {
          name: 'Upper 1',
          description: 'This is your horizontal day. Lift heavy at the start and work hard at the end',
          color: '#6366f1',
          exercises: [
            {
              id: Date.now(),
              name: 'smith incline bench press',
              category: 'Chest',
              equipment: 'smith machine',
              sets: [
                { set: 1, reps: 12, weight: 210, rest: 90, completed: false }
              ]
            }
          ]
        }
      ]
    });
    setIsEditing(true);
    setShowExerciseLibrary(true);
  };

  const editTemplate = (template) => {
    setCurrentTemplate(template);
    try {
      const days = typeof template.days === 'string' ? JSON.parse(template.days) : template.days;
      const normalizedDays = (days || []).map(day => ({
        ...day,
        exercises: day.exercises || []
      }));
      setTemplateData({
        name: template.name,
        description: template.description || '',
        days: normalizedDays
      });
    } catch (error) {
      setTemplateData({
        name: template.name,
        description: '',
        days: []
      });
    }
    setIsEditing(true);
    setShowExerciseLibrary(true);
  };

  const saveTemplate = async () => {
    try {
      const templateToSave = {
        name: templateData.name,
        description: templateData.description,
        days: JSON.stringify(templateData.days)
      };

      if (currentTemplate) {
        await ApiClient.updateWorkoutTemplate(currentTemplate.id, templateToSave);
      } else {
        await ApiClient.createWorkoutTemplate(templateToSave);
      }

      await fetchData();
      setIsEditing(false);
      setCurrentTemplate(null);
      setShowExerciseLibrary(false);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template');
    }
  };

  const addDay = () => {
    setTemplateData(prev => ({
      ...prev,
      days: [...prev.days, {
        name: `Day ${prev.days.length + 1}`,
        description: '',
        color: '#6366f1',
        exercises: []
      }]
    }));
  };

  const updateDay = (dayIndex, field, value) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = { ...newDays[dayIndex], [field]: value };
      return { ...prev, days: newDays };
    });
  };

  const removeDay = (dayIndex) => {
    setTemplateData(prev => ({
      ...prev,
      days: prev.days.filter((_, index) => index !== dayIndex)
    }));
  };

  const addExerciseToDay = (dayIndex, exercise) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      const newExercise = {
        id: Date.now() + Math.random(),
        name: exercise.name,
        category: exercise.bodyPart || exercise.category,
        equipment: exercise.equipment || '',
        sets: [{ set: 1, reps: 10, weight: '', rest: 60, completed: false }]
      };
      
      if (newDays[dayIndex]) {
        if (!newDays[dayIndex].exercises) {
          newDays[dayIndex].exercises = [];
        }
        newDays[dayIndex].exercises.push(newExercise);
      }
      return { ...prev, days: newDays };
    });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      if (newDays[dayIndex] && newDays[dayIndex].exercises) {
        newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, index) => index !== exerciseIndex);
      }
      return { ...prev, days: newDays };
    });
  };

  const addSet = (dayIndex, exerciseIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      if (newDays[dayIndex] && newDays[dayIndex].exercises && newDays[dayIndex].exercises[exerciseIndex]) {
        const exercise = newDays[dayIndex].exercises[exerciseIndex];
        if (!exercise.sets) {
          exercise.sets = [];
        }
        const sets = exercise.sets;
        const lastSet = sets[sets.length - 1] || { reps: 10, weight: '', rest: 60 };
        
        exercise.sets.push({
          set: sets.length + 1,
          reps: lastSet.reps,
          weight: lastSet.weight,
          rest: lastSet.rest,
          completed: false
        });
      }
      
      return { ...prev, days: newDays };
    });
  };

  const updateSet = (dayIndex, exerciseIndex, setIndex, field, value) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      if (newDays[dayIndex] && 
          newDays[dayIndex].exercises && 
          newDays[dayIndex].exercises[exerciseIndex] && 
          newDays[dayIndex].exercises[exerciseIndex].sets &&
          newDays[dayIndex].exercises[exerciseIndex].sets[setIndex]) {
        newDays[dayIndex].exercises[exerciseIndex].sets[setIndex][field] = value;
      }
      return { ...prev, days: newDays };
    });
  };

  const removeSet = (dayIndex, exerciseIndex, setIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      if (newDays[dayIndex] && 
          newDays[dayIndex].exercises && 
          newDays[dayIndex].exercises[exerciseIndex] && 
          newDays[dayIndex].exercises[exerciseIndex].sets) {
        newDays[dayIndex].exercises[exerciseIndex].sets = 
          newDays[dayIndex].exercises[exerciseIndex].sets.filter((_, index) => index !== setIndex);
      }
      return { ...prev, days: newDays };
    });
  };

  // Exercise Library Component
  const ExerciseLibrary = () => {
    const filteredExercises = exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchExercises.toLowerCase());
      const matchesCategory = !selectedCategory || exercise.bodyPart === selectedCategory || exercise.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="exercise-library-panel">
        <div className="exercise-library-header">
          <h3>Exercise Library</h3>
          <p>Drag exercises to your workout</p>
        </div>

        <div className="exercise-search-filters">
          <input
            type="text"
            placeholder="incline smith"
            value={searchExercises}
            onChange={(e) => setSearchExercises(e.target.value)}
            className="exercise-search-input"
          />
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="exercise-category-select"
          >
            <option value="">All Body Parts</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="exercise-list">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              className="exercise-item"
              draggable
              onDragStart={() => setDraggedExercise(exercise)}
              onDragEnd={() => setDraggedExercise(null)}
            >
              <div 
                className="exercise-category-dot"
                style={{ backgroundColor: getCategoryColor(exercise.bodyPart || exercise.category).primary }}
              ></div>
              <div className="exercise-info">
                <div className="exercise-name">{exercise.name}</div>
                <div className="exercise-meta">
                  <span className="exercise-category">{exercise.bodyPart || exercise.category}</span>
                  <span className="exercise-equipment">{exercise.equipment}</span>
                </div>
              </div>
              <button className="exercise-add-btn">
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Workout Day Component
  const WorkoutDay = ({ day, dayIndex }) => {
    const handleDrop = (e) => {
      e.preventDefault();
      if (draggedExercise) {
        addExerciseToDay(dayIndex, draggedExercise);
        setDraggedExercise(null);
      }
      setDragOverTarget(null);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOverTarget(`day-${dayIndex}`);
    };

    const handleDragLeave = () => {
      setDragOverTarget(null);
    };

    return (
      <div 
        className={`workout-day ${dragOverTarget === `day-${dayIndex}` ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="workout-day-header" style={{ backgroundColor: day.color }}>
          <div className="workout-day-controls">
            <button className="day-menu-btn">
              <GripVertical size={16} />
            </button>
            <button className="day-delete-btn" onClick={() => console.log('Remove day')}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="workout-day-description">
          <input
            type="text"
            value={day.description}
            onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
            placeholder="Add workout description..."
            className="day-description-input"
          />
        </div>

        <div className="workout-exercises">
          {(day.exercises || []).map((exercise, exerciseIndex) => (
            <div key={exercise.id} className="workout-exercise">
              <div className="exercise-header">
                <div className="exercise-controls">
                  <button className="exercise-drag-handle">
                    <GripVertical size={14} />
                  </button>
                </div>
                
                <div className="exercise-details">
                  <div className="exercise-name-badge">
                    <span className="exercise-name">{exercise.name}</span>
                    <button className="exercise-edit-btn">
                      <Edit3 size={12} />
                    </button>
                  </div>
                  <div className="exercise-meta">
                    <span className="exercise-category">{exercise.category}</span>
                    <span className="exercise-equipment">{exercise.equipment}</span>
                  </div>
                </div>

                <div className="exercise-actions">
                  <button className="exercise-timer-btn">
                    <Timer size={14} />
                  </button>
                  <button 
                    className="exercise-delete-btn"
                    onClick={() => removeExercise(dayIndex, exerciseIndex)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="exercise-sets">
                <div className="sets-header">
                  <span>SET</span>
                  <span>REPS</span>
                  <span>WEIGHT</span>
                  <span>RPE</span>
                  <span>REST</span>
                  <span>ACTIONS</span>
                </div>

                {(exercise.sets || []).map((set, setIndex) => (
                  <div key={setIndex} className="set-row">
                    <span className="set-number">{setIndex + 1}</span>
                    
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(dayIndex, exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                      className="set-input reps-input"
                    />
                    
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(dayIndex, exerciseIndex, setIndex, 'weight', e.target.value)}
                      className="set-input weight-input"
                    />
                    
                    <input
                      type="number"
                      value={set.rpe || 9}
                      onChange={(e) => updateSet(dayIndex, exerciseIndex, setIndex, 'rpe', parseInt(e.target.value) || 9)}
                      className="set-input rpe-input"
                      min="1"
                      max="10"
                    />
                    
                    <input
                      type="number"
                      value={set.rest}
                      onChange={(e) => updateSet(dayIndex, exerciseIndex, setIndex, 'rest', parseInt(e.target.value) || 60)}
                      className="set-input rest-input"
                    />

                    <div className="set-actions">
                      <button className="set-timer-btn">
                        <Timer size={12} />
                      </button>
                      <button 
                        className="set-delete-btn"
                        onClick={() => removeSet(dayIndex, exerciseIndex, setIndex)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  className="add-set-btn"
                  onClick={() => addSet(dayIndex, exerciseIndex)}
                >
                  <Plus size={14} />
                  <span>Add Set</span>
                </button>
              </div>
            </div>
          ))}

          {(!day.exercises || day.exercises.length === 0) && (
            <div className="empty-day-message">
              <Target size={24} className="empty-icon" />
              <p>Drag exercises here to build your workout</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Premium Workout Builder</p>
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
          <p>Premium Workout Builder</p>
          <p className="time">Error</p>
        </div>
        <div className="card text-center py-12">
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button onClick={fetchData} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="premium-workout-builder">
        {/* Header */}
        <div className="builder-header">
          <div className="header-left">
            <button 
              className="back-btn"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="builder-title">
              <h1>Premium Workout Builder</h1>
              <p>Create professional workout templates with advanced features</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="template-name-section">
              <label>Template Name</label>
              <input
                type="text"
                value={templateData.name}
                onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                className="template-name-input"
              />
            </div>
            
            <button 
              className="save-template-btn"
              onClick={saveTemplate}
            >
              <Save size={16} />
              Save Template
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="builder-content">
          {/* Exercise Library Panel */}
          {showExerciseLibrary && <ExerciseLibrary />}
          
          {/* Workout Days */}
          <div className="workout-days-container">
            {templateData.days.map((day, dayIndex) => (
              <WorkoutDay 
                key={dayIndex} 
                day={day} 
                dayIndex={dayIndex}
              />
            ))}
            
            <button className="add-day-btn" onClick={addDay}>
              <Plus size={20} />
              <span>Add Day</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Template List View
  const TemplateCard = ({ template }) => (
    <div className="project-box-wrapper">
      <div className="project-box" style={{ backgroundColor: '#e0e7ff' }}>
        <div className="project-box-header">
          <span>{new Date(template.created_at || template.updated_at).toLocaleDateString()}</span>
          <div className="more-wrapper">
            <button 
              className="project-btn-more"
              onClick={() => editTemplate(template)}
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>
        
        <div className="project-box-content-header">
          <p className="box-content-header">{template.name}</p>
          <p className="box-content-subheader">
            {Array.isArray(template.days) 
              ? `${template.days.length} days` 
              : typeof template.days === 'string' 
                ? `${JSON.parse(template.days || '[]').length} days`
                : '0 days'
            }
          </p>
        </div>

        <div className="box-progress-wrapper">
          <p className="box-progress-header">Progress</p>
          <div className="box-progress-bar">
            <span 
              className="box-progress" 
              style={{ width: '100%', backgroundColor: '#4f46e5' }}
            ></span>
          </div>
          <p className="box-progress-percentage">Complete</p>
        </div>
        
        <div className="project-box-footer">
          <div className="participants">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: '#4f46e5' }}
            >
              <Calendar size={12} />
            </div>
            <button 
              className="add-participant" 
              style={{ color: '#4f46e5' }}
              onClick={() => editTemplate(template)}
            >
              <Edit3 size={12} />
            </button>
          </div>
          <div className="days-left" style={{ color: '#4f46e5' }}>
            Edit
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="projects-section">
      <div className="projects-section-header">
        <p>Premium Workout Builder</p>
        <p className="time">{templates.length} templates</p>
      </div>
      
      <div className="projects-section-line">
        <div className="projects-status">
          <div className="item-status">
            <span className="status-number">{templates.length}</span>
            <span className="status-type">Templates</span>
          </div>
          <div className="item-status">
            <span className="status-number">{exercises.length}</span>
            <span className="status-type">Exercises</span>
          </div>
          <div className="item-status">
            <span className="status-number">Active</span>
            <span className="status-type">Builder</span>
          </div>
        </div>
        
        <div className="view-actions">
          <button 
            onClick={createNewTemplate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      <div className="project-boxes jsGridView">
        {templates.length > 0 ? (
          templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-16 h-16 opacity-30 mx-auto mb-4" style={{ color: 'var(--main-color)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--main-color)' }}>
              No workout templates yet
            </h3>
            <p className="opacity-60 mb-4" style={{ color: 'var(--main-color)' }}>
              Create your first workout template to get started
            </p>
            <button
              onClick={createNewTemplate}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutEditor; 