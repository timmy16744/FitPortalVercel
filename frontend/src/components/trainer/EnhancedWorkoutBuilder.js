import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Trash2, Edit3, GripVertical, X, ArrowLeft, Timer, 
  Target, Calendar, ChevronDown, ChevronUp, Search, Filter, Copy, Eye, Settings
} from 'lucide-react';
import ApiClient from '../../utils/api';

const EnhancedWorkoutBuilder = () => {
  console.log('🏗️ Enhanced Workout Builder component loading...');
  
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
  
  // Color mapping for exercise categories
  const getCategoryColor = (category) => {
    const colors = {
      'chest': { bg: '#fee2e2', border: '#dc2626', primary: '#ef4444' },
      'back': { bg: '#dbeafe', border: '#2563eb', primary: '#3b82f6' },
      'shoulders': { bg: '#e9d5ff', border: '#7c3aed', primary: '#8b5cf6' },
      'legs': { bg: '#d1fae5', border: '#059669', primary: '#10b981' },
      'arms': { bg: '#fed7aa', border: '#ea580c', primary: '#f97316' },
      'core': { bg: '#fce7f3', border: '#be185d', primary: '#ec4899' },
      'cardio': { bg: '#cffafe', border: '#0891b2', primary: '#06b6d4' },
      'glutes': { bg: '#fef3c7', border: '#d97706', primary: '#f59e0b' },
      'hamstrings': { bg: '#ede9fe', border: '#6d28d9', primary: '#7c3aed' },
      'quadriceps': { bg: '#dcfce7', border: '#16a34a', primary: '#22c55e' },
      'calves': { bg: '#f3e8ff', border: '#9333ea', primary: '#a855f7' },
      'triceps': { bg: '#fef2f2', border: '#b91c1c', primary: '#dc2626' },
      'biceps': { bg: '#fff7ed', border: '#c2410c', primary: '#ea580c' },
      'forearms': { bg: '#f0fdf4', border: '#15803d', primary: '#16a34a' },
      'neck': { bg: '#fafaf9', border: '#78716c', primary: '#a8a29e' },
      'full body': { bg: '#f0f9ff', border: '#0369a1', primary: '#0ea5e9' }
    };
    
    const normalizedCategory = (category || '').toLowerCase();
    return colors[normalizedCategory] || { bg: '#f3f4f6', border: '#6b7280', primary: '#9ca3af' };
  };
  
  // Enhanced template structure
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    days: []
  });

  const [draggedExercise, setDraggedExercise] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'preview' | 'assignments'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Enhanced Workout Builder: Fetching templates and exercises...');
      
      const [templatesData, exercisesData] = await Promise.all([
        ApiClient.getWorkoutTemplates(),
        ApiClient.getExercisesEnhanced(1, 200)
      ]);
      
      console.log('📋 Templates received:', templatesData?.length || 0, templatesData);
      console.log('💪 Exercises received:', exercisesData?.exercises?.length || 0);
      
      setTemplates(templatesData || []);
      setExercises(exercisesData.exercises || []);
      setCategories(exercisesData.categories || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Failed to load workout data');
    } finally {
      setIsLoading(false);
    }
  };

  // Template Management
  const createNewTemplate = () => {
    setCurrentTemplate(null);
    setTemplateData({
      name: 'New Workout Template',
      description: 'Enter description...',
      days: [
        {
          id: `day_${Date.now()}`,
          name: 'Day 1',
          type: 'full_body',
          description: 'Full body workout',
          color: '#6366f1',
          rest_day: false,
          exercises: [],
          collapsed: false
        }
      ]
    });
    setIsEditing(true);
    setShowExerciseLibrary(true);
    setActiveTab('builder');
  };

  const editTemplate = (template) => {
    setCurrentTemplate(template);
    try {
      const days = typeof template.days === 'string' ? JSON.parse(template.days) : template.days;
      
      // Enhanced day structure with proper IDs and metadata
      const enhancedDays = (days || []).map((day, index) => ({
        id: day.id || `day_${Date.now()}_${index}`,
        name: day.name || `Day ${index + 1}`,
        type: day.type || 'full_body',
        description: day.description || '',
        color: day.color || '#6366f1',
        rest_day: day.rest_day || false,
        collapsed: day.collapsed || false,
        exercises: (day.exercises || []).map((exercise, exIndex) => ({
          id: exercise.id || `ex_${Date.now()}_${exIndex}`,
          name: exercise.name,
          category: exercise.category || exercise.bodyPart,
          equipment: exercise.equipment || '',
          instructions: exercise.instructions || '',
          customInstructions: exercise.customInstructions || '',
          sets: (exercise.sets || []).map((set, setIndex) => ({
            id: set.id || `set_${Date.now()}_${setIndex}`,
            set_number: setIndex + 1,
            reps: set.reps || 10,
            weight: set.weight || '',
            rest_seconds: set.rest || set.rest_seconds || 60,
            rpe: set.rpe || null,
            notes: set.notes || ''
          }))
        }))
      }));

      setTemplateData({
        name: template.name,
        description: template.description || '',
        days: enhancedDays
      });
    } catch (error) {
      console.error('Error parsing template:', error);
      setTemplateData({
        name: template.name,
        description: '',
        days: []
      });
    }
    setIsEditing(true);
    setShowExerciseLibrary(true);
    setActiveTab('builder');
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

  // Day Management
  const addDay = () => {
    const newDay = {
      id: `day_${Date.now()}`,
      name: `Day ${templateData.days.length + 1}`,
      type: 'full_body',
      description: '',
      color: '#6366f1',
      rest_day: false,
      exercises: [],
      collapsed: false
    };
    
    setTemplateData(prev => ({
      ...prev,
      days: [...prev.days, newDay]
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

  const toggleDayCollapse = (dayIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = { 
        ...newDays[dayIndex], 
        collapsed: !newDays[dayIndex].collapsed 
      };
      return { ...prev, days: newDays };
    });
  };

  const saveDayAndCollapse = (dayIndex) => {
    // Save any pending changes and collapse the day
    setTemplateData(prev => {
      const newDays = [...prev.days];
      newDays[dayIndex] = { 
        ...newDays[dayIndex], 
        collapsed: true 
      };
      return { ...prev, days: newDays };
    });
  };

  const duplicateDay = (dayIndex) => {
    const dayToDuplicate = templateData.days[dayIndex];
    const duplicatedDay = {
      ...dayToDuplicate,
      id: `day_${Date.now()}`,
      name: `${dayToDuplicate.name} (Copy)`,
      exercises: dayToDuplicate.exercises.map(exercise => ({
        ...exercise,
        id: `ex_${Date.now()}_${Math.random()}`,
        customInstructions: exercise.customInstructions || '', // Preserve custom instructions
        sets: exercise.sets.map(set => ({
          ...set,
          id: `set_${Date.now()}_${Math.random()}`
        }))
      }))
    };
    
    setTemplateData(prev => ({
      ...prev,
      days: [...prev.days.slice(0, dayIndex + 1), duplicatedDay, ...prev.days.slice(dayIndex + 1)]
    }));
  };

  // Exercise Management
  const addExerciseToDay = (dayIndex, exercise) => {
    const newExercise = {
      id: `ex_${Date.now()}_${Math.random()}`,
      name: exercise.name,
      category: exercise.bodyPart || exercise.category,
      equipment: exercise.equipment || '',
      instructions: exercise.instructions || '',
      customInstructions: '', // Trainer's custom instructions for this specific exercise
      sets: [
        {
          id: `set_${Date.now()}`,
          set_number: 1,
          reps: 10,
          weight: '',
          rest_seconds: 90,
          rpe: null,
          notes: '',
          set_type: 'working' // 'warmup', 'working', 'drop'
        }
      ]
    };
    
    setTemplateData(prev => {
      const newDays = [...prev.days];
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

  const updateExerciseInstructions = (dayIndex, exerciseIndex, instructions) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      if (newDays[dayIndex]?.exercises?.[exerciseIndex]) {
        newDays[dayIndex].exercises[exerciseIndex].customInstructions = instructions;
      }
      return { ...prev, days: newDays };
    });
  };

  const addSet = (dayIndex, exerciseIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      const exercise = newDays[dayIndex]?.exercises?.[exerciseIndex];
      
      if (exercise) {
        const sets = exercise.sets || [];
        const lastSet = sets[sets.length - 1] || {};
        
        const newSet = {
          id: `set_${Date.now()}_${Math.random()}`,
          set_number: sets.length + 1,
          reps: lastSet.reps || 10,
          weight: lastSet.weight || '',
          rest_seconds: lastSet.rest_seconds || 90,
          rpe: lastSet.rpe || null,
          notes: '',
          set_type: lastSet.set_type || 'working'
        };
        
        exercise.sets = [...sets, newSet];
      }
      
      return { ...prev, days: newDays };
    });
  };

  const updateSet = (dayIndex, exerciseIndex, setIndex, field, value) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      const exercise = newDays[dayIndex]?.exercises?.[exerciseIndex];
      
      if (exercise?.sets?.[setIndex]) {
        exercise.sets[setIndex][field] = value;
      }
      
      return { ...prev, days: newDays };
    });
  };

  const removeSet = (dayIndex, exerciseIndex, setIndex) => {
    setTemplateData(prev => {
      const newDays = [...prev.days];
      const exercise = newDays[dayIndex]?.exercises?.[exerciseIndex];
      
      if (exercise?.sets) {
        exercise.sets = exercise.sets.filter((_, index) => index !== setIndex);
        // Re-number the remaining sets
        exercise.sets.forEach((set, index) => {
          set.set_number = index + 1;
        });
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
      <div style={{
        width: '300px',
        backgroundColor: 'var(--projects-section)',
        borderRadius: '10px',
        padding: '16px',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--main-color)', fontSize: '16px', fontWeight: '600' }}>
            Exercise Library
          </h3>
          <p style={{ margin: 0, color: 'var(--secondary-color)', fontSize: '13px' }}>
            Drag exercises to your workout days
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--secondary-color)'
            }} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchExercises}
              onChange={(e) => setSearchExercises(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 32px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                backgroundColor: 'var(--search-area-bg)',
                color: 'var(--main-color)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              backgroundColor: 'var(--search-area-bg)',
              color: 'var(--main-color)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: 0
        }}>
          {filteredExercises.map(exercise => {
            const categoryColor = getCategoryColor(exercise.bodyPart || exercise.category);
            return (
            <div
              key={exercise.id}
              draggable
              onDragStart={() => setDraggedExercise(exercise)}
              onDragEnd={() => setDraggedExercise(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px',
                backgroundColor: draggedExercise?.id === exercise.id ? categoryColor.bg : 'var(--search-area-bg)',
                borderRadius: '6px',
                cursor: 'grab',
                border: draggedExercise?.id === exercise.id ? `2px solid ${categoryColor.primary}` : '1px solid transparent',
                transition: 'all 0.2s ease',
                animation: 'fadeIn 0.3s ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = categoryColor.bg;
                e.currentTarget.style.border = `1px solid ${categoryColor.border}`;
              }}
              onMouseLeave={(e) => {
                if (draggedExercise?.id !== exercise.id) {
                  e.currentTarget.style.backgroundColor = 'var(--search-area-bg)';
                  e.currentTarget.style.border = '1px solid transparent';
                }
              }}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: categoryColor.primary,
                boxShadow: `0 0 0 3px ${categoryColor.bg}`
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--main-color)',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {exercise.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--secondary-color)',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <span>{exercise.bodyPart || exercise.category}</span>
                  <span>•</span>
                  <span>{exercise.equipment}</span>
                </div>
              </div>
              <Plus size={14} style={{ color: 'var(--secondary-color)' }} />
            </div>
          );
          })}
        </div>

        {filteredExercises.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: 'var(--secondary-color)',
            fontSize: '13px'
          }}>
            No exercises found
          </div>
        )}
      </div>
    );
  };

  // Workout Day Component
  const WorkoutDay = ({ day, dayIndex }) => {
    const isCollapsed = day.collapsed || false;
    
    const handleDrop = (e) => {
      e.preventDefault();
      if (draggedExercise && !day.rest_day && !isCollapsed) {
        addExerciseToDay(dayIndex, draggedExercise);
        setDraggedExercise(null);
      }
      setDragOverTarget(null);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      if (!day.rest_day && !isCollapsed) {
        setDragOverTarget(`day-${dayIndex}`);
      }
    };

    const handleDragLeave = () => {
      setDragOverTarget(null);
    };

    const dayTypes = [
      { value: 'push', label: 'Push', color: '#ef4444' },
      { value: 'pull', label: 'Pull', color: '#3b82f6' },
      { value: 'legs', label: 'Legs', color: '#10b981' },
      { value: 'upper', label: 'Upper', color: '#8b5cf6' },
      { value: 'lower', label: 'Lower', color: '#f59e0b' },
      { value: 'full_body', label: 'Full Body', color: '#6366f1' },
      { value: 'cardio', label: 'Cardio', color: '#ec4899' },
      { value: 'rest', label: 'Rest', color: '#6b7280' }
    ];

    const currentDayType = dayTypes.find(type => type.value === day.type) || dayTypes[5];

    return (
      <div 
        style={{
          backgroundColor: 'var(--projects-section)',
          borderRadius: '10px',
          border: dragOverTarget === `day-${dayIndex}` ? '2px dashed #6366f1' : '1px solid rgba(0, 0, 0, 0.05)',
          marginBottom: '20px',
          overflow: 'hidden',
          transition: 'all 0.2s ease'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Day Header */}
        <div style={{
          background: `linear-gradient(135deg, ${currentDayType.color}15, ${currentDayType.color}25)`,
          border: `1px solid ${currentDayType.color}30`,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'grab'
          }}>
            <GripVertical size={16} style={{ color: 'var(--secondary-color)' }} />
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentDayType.color
            }} />
          </div>
          
          <div style={{ flex: 1, display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={day.name}
              onChange={(e) => updateDay(dayIndex, 'name', e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--main-color)',
                outline: 'none',
                minWidth: '120px'
              }}
            />
            
            <select
              value={day.type}
              onChange={(e) => {
                updateDay(dayIndex, 'type', e.target.value);
                updateDay(dayIndex, 'color', dayTypes.find(t => t.value === e.target.value)?.color || '#6366f1');
                updateDay(dayIndex, 'rest_day', e.target.value === 'rest');
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'var(--search-area-bg)',
                color: 'var(--main-color)',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              {dayTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => toggleDayCollapse(dayIndex)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'var(--secondary-color)',
                transition: 'all 0.2s ease'
              }}
              title={isCollapsed ? "Expand Day" : "Collapse Day"}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
            {!isCollapsed && (
              <button
                onClick={() => saveDayAndCollapse(dayIndex)}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                title="Save and Minimize Day"
              >
                <Save size={12} style={{ marginRight: '4px', display: 'inline' }} />
                Save Day
              </button>
            )}
            <button
              onClick={() => duplicateDay(dayIndex)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'var(--secondary-color)',
                transition: 'all 0.2s ease'
              }}
              title="Duplicate Day"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => removeDay(dayIndex)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#ef4444',
                transition: 'all 0.2s ease'
              }}
              title="Remove Day"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Collapsed Summary */}
        {isCollapsed && (
          <div style={{
            padding: '12px 16px',
            color: 'var(--secondary-color)',
            fontSize: '13px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--search-area-bg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {day.rest_day 
                ? 'Rest Day' 
                : `${day.exercises?.length || 0} exercise${(day.exercises?.length || 0) !== 1 ? 's' : ''}`
              }
            </span>
            {day.description && (
              <span style={{ 
                fontSize: '12px', 
                fontStyle: 'italic',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {day.description}
              </span>
            )}
          </div>
        )}

        {/* Day Content - Only show when not collapsed */}
        <div className={`day-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {/* Day Description */}
            <div style={{ padding: '0 16px 16px' }}>
              <textarea
                value={day.description}
                onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                placeholder="Add workout description..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--search-area-bg)',
                  color: 'var(--main-color)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '60px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Exercises or Rest Day Message */}
            {day.rest_day ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--secondary-color)',
            backgroundColor: 'var(--search-area-bg)',
            margin: '0 16px 16px'
          }}>
            <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Rest Day</h3>
            <p style={{ margin: 0, fontSize: '13px' }}>Recovery and regeneration</p>
          </div>
        ) : (
          <div style={{ padding: '0 16px 16px' }}>
            {/* Exercise List */}
            {(day.exercises || []).map((exercise, exerciseIndex) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
                dayIndex={dayIndex}
                onRemove={() => removeExercise(dayIndex, exerciseIndex)}
                onAddSet={() => addSet(dayIndex, exerciseIndex)}
                onUpdateSet={(setIndex, field, value) => updateSet(dayIndex, exerciseIndex, setIndex, field, value)}
                onRemoveSet={(setIndex) => removeSet(dayIndex, exerciseIndex, setIndex)}
              />
            ))}
            
            {/* Empty State */}
            {(!day.exercises || day.exercises.length === 0) && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: 'var(--search-area-bg)',
                borderRadius: '6px',
                border: dragOverTarget === `day-${dayIndex}` ? '2px dashed #6366f1' : '1px solid rgba(0, 0, 0, 0.05)',
                color: 'var(--secondary-color)'
              }}>
                <Target size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>No exercises yet</h3>
                <p style={{ margin: 0, fontSize: '13px' }}>Drag exercises from the library to build your workout</p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    );
  };

  // Exercise Card Component
  const ExerciseCard = ({ 
    exercise, 
    exerciseIndex, 
    dayIndex, 
    onRemove, 
    onAddSet, 
    onUpdateSet, 
    onRemoveSet 
  }) => {
    const categoryColor = getCategoryColor(exercise.category || exercise.bodyPart);
    const [showInstructions, setShowInstructions] = useState(false);
    const [localInstructions, setLocalInstructions] = useState(exercise.customInstructions || '');
    
    const handleSaveInstructions = () => {
      updateExerciseInstructions(dayIndex, exerciseIndex, localInstructions);
      setShowInstructions(false);
    };
    
    return (
    <div className="exercise-item" style={{
      backgroundColor: 'var(--search-area-bg)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      border: `1px solid ${categoryColor.border}30`,
      borderLeft: `4px solid ${categoryColor.primary}`,
      background: `linear-gradient(90deg, ${categoryColor.bg}20 0%, var(--search-area-bg) 10%)`,
      transition: 'all 0.3s ease'
    }}>
      {/* Exercise Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GripVertical size={14} style={{ color: 'var(--secondary-color)', cursor: 'grab' }} />
          <div>
            <h4 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--main-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: categoryColor.primary,
                flexShrink: 0
              }} />
              {exercise.name}
            </h4>
            <div style={{
              fontSize: '12px',
              color: 'var(--secondary-color)',
              marginTop: '2px',
              marginLeft: '16px'
            }}>
              <span style={{ color: categoryColor.primary, fontWeight: '500' }}>{exercise.category}</span> • {exercise.equipment}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              padding: '4px 8px',
              backgroundColor: showInstructions ? categoryColor.bg : 'transparent',
              border: showInstructions ? `1px solid ${categoryColor.primary}` : 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: showInstructions ? categoryColor.primary : 'var(--secondary-color)',
              fontSize: '11px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={showInstructions ? "Hide Instructions" : "Add Instructions"}
          >
            <Edit3 size={12} />
            {exercise.customInstructions && !showInstructions && (
              <span style={{ color: categoryColor.primary }}>•</span>
            )}
          </button>
          <button
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'var(--secondary-color)'
            }}
            title="Exercise Timer"
          >
            <Timer size={12} />
          </button>
          <button
            onClick={onRemove}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#ef4444'
            }}
            title="Remove Exercise"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Custom Instructions Section */}
      {showInstructions && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: categoryColor.bg + '40',
          borderRadius: '6px',
          border: `1px solid ${categoryColor.border}30`,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: categoryColor.primary,
            marginBottom: '8px'
          }}>
            Custom Instructions for Client
          </div>
          <textarea
            value={localInstructions}
            onChange={(e) => setLocalInstructions(e.target.value)}
            placeholder="Add specific cues, form tips, tempo, or modifications for this exercise..."
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              border: `1px solid ${categoryColor.border}30`,
              borderRadius: '4px',
              backgroundColor: 'var(--search-area-bg)',
              color: 'var(--main-color)',
              fontSize: '12px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border 0.2s ease'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                setLocalInstructions(exercise.customInstructions || '');
                setShowInstructions(false);
              }}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'var(--secondary-color)',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveInstructions}
              style={{
                padding: '4px 12px',
                backgroundColor: categoryColor.primary,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Display Saved Instructions */}
      {exercise.customInstructions && !showInstructions && (
        <div style={{
          marginTop: '8px',
          padding: '8px 10px',
          backgroundColor: categoryColor.bg + '30',
          borderRadius: '4px',
          borderLeft: `3px solid ${categoryColor.primary}`,
          fontSize: '11px',
          color: 'var(--main-color)',
          lineHeight: '1.4'
        }}>
          <strong style={{ color: categoryColor.primary, fontWeight: '600', fontSize: '10px', textTransform: 'uppercase' }}>
            Instructions:
          </strong>
          <div style={{ marginTop: '4px' }}>{exercise.customInstructions}</div>
        </div>
      )}

      {/* Sets Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 40px 60px 70px 50px 70px 60px',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        fontSize: '10px',
        fontWeight: '600',
        color: 'var(--secondary-color)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        <span>TYPE</span>
        <span>SET</span>
        <span>REPS</span>
        <span>WEIGHT</span>
        <span>RPE</span>
        <span>REST</span>
        <span></span>
      </div>

      {/* Sets */}
      {(exercise.sets || []).map((set, setIndex) => {
        const setTypeColors = {
          warmup: { bg: '#fef3c7', text: '#d97706', label: 'Warmup' },
          working: { bg: '#dbeafe', text: '#1e40af', label: 'Working' },
          drop: { bg: '#fce7f3', text: '#be185d', label: 'Drop Set' }
        };
        const setType = setTypeColors[set.set_type || 'working'];
        
        return (
        <div
          key={set.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '80px 40px 60px 70px 50px 70px 60px',
            gap: '8px',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: setIndex === exercise.sets.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.02)',
            backgroundColor: set.set_type === 'warmup' ? setTypeColors.warmup.bg + '20' : 
                           set.set_type === 'drop' ? setTypeColors.drop.bg + '20' : 'transparent'
          }}
        >
          <select
            value={set.set_type || 'working'}
            onChange={(e) => onUpdateSet(setIndex, 'set_type', e.target.value)}
            style={{
              padding: '4px 6px',
              border: `1px solid ${setType.text}40`,
              borderRadius: '4px',
              fontSize: '11px',
              backgroundColor: setType.bg,
              color: setType.text,
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="warmup">Warmup</option>
            <option value="working">Working</option>
            <option value="drop">Drop Set</option>
          </select>
          
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: setType.text,
            textAlign: 'center',
            backgroundColor: setType.bg,
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {set.set_number}
          </span>
          
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onUpdateSet(setIndex, 'reps', parseInt(e.target.value) || 0)}
            style={{
              padding: '4px 6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'center',
              outline: 'none'
            }}
          />
          
          <input
            type="text"
            value={set.weight}
            onChange={(e) => onUpdateSet(setIndex, 'weight', e.target.value)}
            placeholder="kg"
            style={{
              padding: '4px 6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'center',
              outline: 'none'
            }}
          />
          
          <input
            type="number"
            value={set.rpe || ''}
            onChange={(e) => onUpdateSet(setIndex, 'rpe', parseInt(e.target.value) || null)}
            placeholder="RPE"
            min="1"
            max="10"
            style={{
              padding: '4px 6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'center',
              outline: 'none'
            }}
          />
          
          <div style={{ position: 'relative' }}>
            <select
              value={set.rest_seconds}
              onChange={(e) => onUpdateSet(setIndex, 'rest_seconds', parseInt(e.target.value))}
              style={{
                padding: '4px 6px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                fontSize: '11px',
                textAlign: 'center',
                outline: 'none',
                cursor: 'pointer',
                backgroundColor: 'var(--search-area-bg)',
                color: 'var(--main-color)',
                fontWeight: '500'
              }}
            >
              <option value="30">30s</option>
              <option value="45">45s</option>
              <option value="60">1:00</option>
              <option value="90">1:30</option>
              <option value="120">2:00</option>
              <option value="150">2:30</option>
              <option value="180">3:00</option>
              <option value="240">4:00</option>
              <option value="300">5:00</option>
            </select>
            <Timer size={10} style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--secondary-color)',
              pointerEvents: 'none'
            }} />
          </div>

          <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
            <button
              style={{
                padding: '2px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                color: 'var(--secondary-color)'
              }}
              title="Set Timer"
            >
              <Timer size={10} />
            </button>
            <button
              onClick={() => onRemoveSet(setIndex)}
              style={{
                padding: '2px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                color: '#ef4444'
              }}
              title="Remove Set"
            >
              <X size={10} />
            </button>
          </div>
        </div>
        )
      })}

      {/* Add Set Button */}
      <button
        onClick={onAddSet}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          padding: '8px',
          marginTop: '8px',
          backgroundColor: 'transparent',
          border: '1px dashed rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          cursor: 'pointer',
          color: 'var(--secondary-color)',
          fontSize: '12px',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
      >
        <Plus size={12} />
        <span>Add Set</span>
      </button>
    </div>
  );
  };

  if (isLoading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary-color)', fontSize: '16px' }}>
          Loading Enhanced Workout Builder...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button onClick={fetchData} style={{
          padding: '8px 16px',
          backgroundColor: 'var(--button-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Retry
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div style={{ 
        height: '100vh',
        backgroundColor: 'var(--main-bg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideDown {
              from { max-height: 0; opacity: 0; }
              to { max-height: 1000px; opacity: 1; }
            }
            @keyframes slideUp {
              from { max-height: 1000px; opacity: 1; }
              to { max-height: 0; opacity: 0; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .day-content {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              transform-origin: top;
            }
            .day-content.collapsed {
              max-height: 0;
              opacity: 0;
              overflow: hidden;
              padding: 0;
              margin: 0;
            }
            .day-content.expanded {
              max-height: 2000px;
              opacity: 1;
            }
            .exercise-item {
              animation: fadeIn 0.3s ease-out;
            }
            .template-card {
              animation: scaleIn 0.4s ease-out;
            }
          `}
        </style>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'var(--projects-section)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setIsEditing(false)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--secondary-color)'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <input
                type="text"
                value={templateData.name}
                onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--main-color)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  minWidth: '300px'
                }}
              />
              <div style={{
                fontSize: '13px',
                color: 'var(--secondary-color)',
                marginTop: '2px'
              }}>
                {templateData.days.length} days • {templateData.days.filter(d => !d.rest_day).length} workout days
              </div>
            </div>
          </div>
          
          {/* Action Tabs */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--search-area-bg)', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setActiveTab('builder')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: activeTab === 'builder' ? 'var(--button-bg)' : 'transparent',
                  color: activeTab === 'builder' ? 'white' : 'var(--secondary-color)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Builder
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: activeTab === 'preview' ? 'var(--button-bg)' : 'transparent',
                  color: activeTab === 'preview' ? 'white' : 'var(--secondary-color)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                <Eye size={12} style={{ marginRight: '4px' }} />
                Preview
              </button>
            </div>
            
            <button 
              onClick={saveTemplate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'var(--button-bg)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Save size={16} />
              Save Template
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          display: 'flex', 
          gap: '20px',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Exercise Library */}
          {showExerciseLibrary && activeTab === 'builder' && <ExerciseLibrary />}
          
          {/* Workout Days */}
          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            padding: '0 10px 20px 0'
          }}>
            {activeTab === 'builder' ? (
              <>
                {templateData.days.map((day, dayIndex) => (
                  <WorkoutDay 
                    key={day.id || dayIndex} 
                    day={day} 
                    dayIndex={dayIndex}
                  />
                ))}
                
                <button 
                  onClick={addDay}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '20px',
                    backgroundColor: 'var(--projects-section)',
                    border: '2px dashed rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: 'var(--secondary-color)',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.color = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    e.target.style.color = 'var(--secondary-color)';
                  }}
                >
                  <Plus size={20} />
                  <span>Add Day</span>
                </button>
              </>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: 'var(--projects-section)',
                borderRadius: '10px',
                color: 'var(--secondary-color)'
              }}>
                <Eye size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <h3 style={{ margin: '0 0 8px 0' }}>Preview Mode</h3>
                <p style={{ margin: 0 }}>Client preview coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Template List View
  return (
    <div style={{ 
      padding: '32px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ 
            color: 'var(--main-color)', 
            fontSize: '24px', 
            fontWeight: '700', 
            margin: 0,
            marginBottom: '4px'
          }}>
            Enhanced Workout Builder
          </h1>
          <p style={{
            color: 'var(--secondary-color)',
            fontSize: '14px',
            margin: 0
          }}>
            Create professional workout templates with advanced day management
          </p>
        </div>
        
        <button
          onClick={createNewTemplate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--button-bg)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Plus size={18} />
          Create Template
        </button>
      </div>

      {/* Quick Access Bar - Show Recent/Featured Templates */}
      {templates.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--main-color)',
              margin: 0
            }}>
              Your Workout Templates
            </h3>
            <span style={{
              fontSize: '12px',
              color: 'var(--secondary-color)'
            }}>
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Horizontal Template Scroll */}
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}>
            {templates.slice(0, 6).map((template) => {
              const days = (() => {
                try {
                  return typeof template.days === 'string' ? JSON.parse(template.days) : template.days || [];
                } catch (e) {
                  return [];
                }
              })();
              
              return (
                <div
                  key={template.id}
                  style={{
                    minWidth: '280px',
                    backgroundColor: 'var(--projects-section)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                  onClick={() => editTemplate(template)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                >
                  {/* Template Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--main-color)',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      {template.name}
                    </h4>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#6366f115',
                      color: '#6366f1',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {days.length} Days
                    </div>
                  </div>
                  
                  {/* Template Description */}
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--secondary-color)',
                    marginBottom: '16px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {template.description || 'Professional workout template'}
                  </p>
                  
                  {/* Day Preview */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {days.slice(0, 7).map((day, index) => {
                      const dayTypeColor = (() => {
                        const colors = {
                          'push': '#ef4444',
                          'pull': '#3b82f6', 
                          'legs': '#10b981',
                          'upper': '#8b5cf6',
                          'lower': '#f59e0b',
                          'full_body': '#6366f1',
                          'cardio': '#ec4899',
                          'rest': '#6b7280'
                        };
                        return colors[day.type] || '#6366f1';
                      })();
                      
                      return (
                        <div
                          key={index}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: dayTypeColor,
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={day.name || `Day ${index + 1}`}
                        >
                          {index + 1}
                        </div>
                      );
                    })}
                    {days.length > 7 && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: '#e5e7eb',
                        color: 'var(--secondary-color)',
                        fontSize: '9px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        +{days.length - 7}
                      </div>
                    )}
                  </div>
                  
                  {/* Template Stats */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: 'var(--secondary-color)'
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span>{days.filter(d => !d.rest_day).length} workout days</span>
                      <span>•</span>
                      <span>{days.reduce((total, day) => total + (day.exercises?.length || 0), 0)} exercises</span>
                    </div>
                    <Edit3 size={12} style={{ color: '#6366f1' }} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* View All Link */}
          {templates.length > 6 && (
            <div style={{
              textAlign: 'center',
              marginTop: '16px'
            }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: 'var(--secondary-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                View All {templates.length} Templates
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Templates', value: templates.length },
          { label: 'Exercises', value: exercises.length },
          { label: 'Categories', value: categories.length },
          { label: 'Active', value: templates.filter(t => t.is_public).length }
        ].map((stat, index) => (
          <div key={index} style={{
            padding: '20px',
            backgroundColor: 'var(--projects-section)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--main-color)',
              marginBottom: '4px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--secondary-color)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 32px',
          color: 'var(--secondary-color)'
        }}>
          <Calendar size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '16px', color: 'var(--main-color)' }}>
            No templates yet
          </h3>
          <p style={{ marginBottom: '24px' }}>
            Create your first workout template to get started with the enhanced builder
          </p>
          <button
            onClick={createNewTemplate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--button-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Plus size={16} />
            Create Template
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedWorkoutBuilder;