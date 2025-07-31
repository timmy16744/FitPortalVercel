import React, { useState, useEffect, useReducer, useCallback } from 'react';
import ApiClient from '../utils/api';
import { getMuscleGroupColor, normalizeCategory } from '../utils/exerciseUtils';

const getExerciseImage = (exercise) => {
    if (exercise.mediaUrl || exercise.gifUrl) {
      return exercise.mediaUrl || exercise.gifUrl;
    }
    return `https://via.placeholder.com/300x200/6366f1/FFFFFF?text=${encodeURIComponent(exercise.name.slice(0, 20))}`;
  };

  const ExerciseCard = React.memo(({ exercise, index, onSelect }) => {
    const cardColors = ['#fee4cb', '#e9e7fd', '#dbf6fd', '#fef3c7', '#ecfdf5'];
    const cardColor = cardColors[index % cardColors.length];
    
    return (
      <div 
        className="exercise-card hover-scale" 
        style={{ 
          backgroundColor: cardColor,
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-5)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
          height: 'fit-content'
        }}
        onClick={() => onSelect && onSelect(exercise)}
      >
        <div className="exercise-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 'var(--space-4)'
        }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-lg)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {exercise?.bodyPart || exercise?.category || 'General'}
          </span>
          <button 
            className="more-btn hover-scale"
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-1)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
        
        <div className="exercise-content" style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            margin: '0 0 var(--space-1) 0',
            lineHeight: '1.3'
          }}>
            {exercise?.name || 'Unnamed Exercise'}
          </h3>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)',
            margin: '0 0 var(--space-3) 0'
          }}>
            {exercise?.equipment || 'No Equipment'}
          </p>
          
          {exercise?.instructions && (
            <p style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--text-secondary)', 
              opacity: 0.8,
              margin: '0',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4'
            }}>
              {exercise.instructions.slice(0, 100)}...
            </p>
          )}
        </div>
        
        <div className="exercise-footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div className="exercise-tags">
            {exercise?.target && (
              <span className="exercise-tag" style={{ 
                backgroundColor: getMuscleGroupColor(exercise.target),
                color: 'white',
                fontSize: 'var(--text-xs)',
                fontWeight: '500',
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-full)',
                textTransform: 'capitalize'
              }}>
                {exercise.target}
              </span>
            )}
          </div>
          <button 
            className="btn-secondary hover-scale" 
            style={{ 
              fontSize: 'var(--text-xs)',
              fontWeight: '500',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(exercise);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  });

const FilterBar = ({ 
  categories, 
  muscles, 
  equipment, 
  onFilterChange,
  onClearFilters,
  initialFilters 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.selectedCategory);
  const [selectedMuscle, setSelectedMuscle] = useState(initialFilters.selectedMuscle);
  const [selectedEquipment, setSelectedEquipment] = useState(initialFilters.selectedEquipment);

  const memoizedOnFilterChange = useCallback(onFilterChange, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      memoizedOnFilterChange({
        searchTerm,
        selectedCategory,
        selectedMuscle,
        selectedEquipment,
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategory, selectedMuscle, selectedEquipment, memoizedOnFilterChange]);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMuscle('');
    setSelectedEquipment('');
    onClearFilters();
  };

  const QuickFilterChips = () => {
    const popularFilters = [
      { label: 'Chest', value: 'chest', type: 'category' },
      { label: 'Back', value: 'back', type: 'category' },
      { label: 'Legs', value: 'waist', type: 'category' },
      { label: 'Arms', value: 'upper arms', type: 'category' },
      { label: 'No Equipment', value: 'body weight', type: 'equipment' },
      { label: 'Dumbbells', value: 'dumbbell', type: 'equipment' }
    ];

    return (
      <div className="quick-filters">
        <div className="quick-filters-header">
          <h4>Quick Filters</h4>
        </div>
        <div className="filter-chips">
          {popularFilters.map((filter, index) => (
            <button
              key={index}
              className={`filter-chip ${
                (filter.type === 'category' && selectedCategory === filter.value) ||
                (filter.type === 'equipment' && selectedEquipment === filter.value)
                  ? 'active' : ''
              }`}
              onClick={() => {
                if (filter.type === 'category') {
                  setSelectedCategory(selectedCategory === filter.value ? '' : filter.value);
                } else {
                  setSelectedEquipment(selectedEquipment === filter.value ? '' : filter.value);
                }
              }}
              style={{
                backgroundColor: (filter.type === 'category' && selectedCategory === filter.value) ||
                               (filter.type === 'equipment' && selectedEquipment === filter.value)
                  ? getMuscleGroupColor(filter.value) + '20'
                  : '#f8fafc',
                borderColor: (filter.type === 'category' && selectedCategory === filter.value) ||
                            (filter.type === 'equipment' && selectedEquipment === filter.value)
                  ? getMuscleGroupColor(filter.value)
                  : '#e2e8f0',
                color: (filter.type === 'category' && selectedCategory === filter.value) ||
                      (filter.type === 'equipment' && selectedEquipment === filter.value)
                  ? getMuscleGroupColor(filter.value)
                  : '#64748b'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="exercise-filters">
      <div className="search-section">
        <div className="search-wrapper enhanced-search">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by exercise name, muscle, or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input enhanced"
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm('')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <QuickFilterChips />

      <div className="advanced-filters">
        <div className="filter-group">
          <label>Muscle Group</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Muscle Groups</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Specific Muscle</label>
          <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="filter-select"
          >
            <option value="">All Muscles</option>
            {muscles.map(muscle => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Equipment</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Equipment</option>
            {equipment.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedCategory || selectedMuscle || selectedEquipment) && (
          <button onClick={handleClearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

const initialState = {
  allExercises: [],
  filteredExercises: [],
  categories: [],
  muscles: [],
  equipment: [],
  isLoading: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalExercises: 0,
  viewMode: 'grid',
  selectedExercise: null,
  filters: {
    searchTerm: '',
    selectedCategory: '',
    selectedMuscle: '',
    selectedEquipment: '',
  },
};

function exerciseLibraryReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        allExercises: action.payload.exercises,
        filteredExercises: action.payload.exercises,
        categories: action.payload.categories,
        muscles: action.payload.muscles,
        equipment: action.payload.equipment,
        totalPages: 1,
        totalExercises: action.payload.exercises ? action.payload.exercises.length : 0,
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, currentPage: 1 };
    case 'APPLY_FILTERS': {
      let filtered = state.allExercises;

      if (state.filters.searchTerm) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase())
        );
      }
      
      if (state.filters.selectedCategory) {
        filtered = filtered.filter(exercise => exercise.bodyPart === state.filters.selectedCategory);
      }

      if (state.filters.selectedMuscle) {
        filtered = filtered.filter(exercise =>
          exercise.muscles?.includes(state.filters.selectedMuscle)
        );
      }

      if (state.filters.selectedEquipment) {
        filtered = filtered.filter(exercise =>
          exercise.equipment === state.filters.selectedEquipment
        );
      }

      return { ...state, filteredExercises: filtered };
    }
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SELECTED_EXERCISE':
      return { ...state, selectedExercise: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      throw new Error();
  }
}

const ExerciseLibrary = () => {
  const [state, dispatch] = useReducer(exerciseLibraryReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH_INIT' });
    console.log('Starting to fetch exercises...');
    ApiClient.getExercisesEnhanced(1, 1000, '', '')
      .then(data => {
        console.log('API Response:', data);
        console.log('Exercises count:', data?.exercises?.length);
        console.log('First few exercises:', data?.exercises?.slice(0, 3));
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      })
      .catch(err => {
        console.error('API Error:', err);
        // Add test data fallback
        const testData = {
          exercises: [
            { id: 1, name: 'Push-ups', bodyPart: 'chest', equipment: 'bodyweight' },
            { id: 2, name: 'Squats', bodyPart: 'legs', equipment: 'bodyweight' },
            { id: 3, name: 'Pull-ups', bodyPart: 'back', equipment: 'pull-up bar' }
          ],
          categories: ['chest', 'legs', 'back'],
          muscles: ['pectorals', 'quadriceps', 'latissimus dorsi'],
          equipment: ['bodyweight', 'pull-up bar']
        };
        console.log('Using test data:', testData);
        dispatch({ type: 'FETCH_SUCCESS', payload: testData });
      });
  }, []);

  useEffect(() => {
    dispatch({ type: 'APPLY_FILTERS' });
  }, [state.filters, state.allExercises]);

  const handleFilterChange = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };
  
  const handleClearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: initialState.filters });
  };

  const handlePageChange = (newPage) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ExerciseModal = ({ exercise, onClose }) => {
    if (!exercise) return null;

    return (
      <div className="exercise-modal-overlay" onClick={onClose}>
        <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{exercise.name}</h2>
            <button className="modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="modal-content">
            <div className="modal-image">
              <img src={getExerciseImage(exercise)} alt={exercise.name} />
            </div>
            <div className="modal-details">
              <div className="detail-section">
                <h4>Target Muscles</h4>
                <div className="muscle-pills">
                  {exercise.muscles?.map((muscle, index) => (
                    <span key={index} className="muscle-pill">{muscle}</span>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h4>Equipment</h4>
                <p>{exercise.equipment || 'No equipment needed'}</p>
              </div>
              {exercise.instructions && (
                <div className="detail-section">
                  <h4>Instructions</h4>
                  <ol>
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Close</button>
            <button className="btn-primary">Add to Workout</button>
          </div>
        </div>
      </div>
    );
  };

  if (state.isLoading) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Exercise Library</p>
          <p className="time">Loading exercises...</p>
        </div>
        <div className="exercise-library-loading">
          <div className="loading-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="loading-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-subtitle"></div>
                  <div className="skeleton-pills">
                    <div className="skeleton-pill"></div>
                    <div className="skeleton-pill"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="projects-section">
        <div className="projects-section-header">
          <p>Exercise Library</p>
          <p className="time">Error loading</p>
        </div>
        <div className="error-state">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h3>Failed to load exercises</h3>
          <p>{state.error}</p>
          <button onClick={() => dispatch({ type: 'FETCH_INIT' })} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div className="content-header">
        <div>
          <h1 className="content-title">
            Exercise <span style={{ color: 'var(--brand-accent)' }}>Library</span>
          </h1>
          <p className="content-subtitle">Browse and manage exercises</p>
        </div>
        <div className="content-actions">
          <button 
            className="btn-primary hover-scale"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-5)',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              borderRadius: 'var(--radius-xl)',
              border: 'none',
              background: 'linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-primary) 100%)',
              color: 'var(--text-inverse)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Exercise
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--space-5)',
        marginBottom: 'var(--space-8)'
      }}>
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #fee4cb 0%, #f59e0b 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: '700', 
              marginBottom: 'var(--space-1)',
              color: 'var(--text-primary)'
            }}>
              {state.totalExercises}
            </div>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500',
              color: 'var(--text-primary)',
              opacity: 0.8
            }}>
              Total Exercises
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #e9e7fd 0%, #8b5cf6 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: '700', 
              marginBottom: 'var(--space-1)',
              color: 'var(--text-primary)'
            }}>
              {state.categories.length}
            </div>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500',
              color: 'var(--text-primary)',
              opacity: 0.8
            }}>
              Categories
            </div>
          </div>
        </div>
        
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #dbf6fd 0%, #06b6d4 100%)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-6)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              fontSize: 'var(--text-3xl)', 
              fontWeight: '700', 
              marginBottom: 'var(--space-1)',
              color: 'var(--text-primary)'
            }}>
              {state.muscles.length}
            </div>
            <div style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500',
              color: 'var(--text-primary)',
              opacity: 0.8
            }}>
              Muscle Groups
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-6)',
        gap: 'var(--space-4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="view-toggle" style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button 
              className={`view-btn hover-scale ${state.viewMode === 'list' ? 'active' : ''}`}
              title="List View"
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
              style={{
                padding: 'var(--space-2)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: state.viewMode === 'list' ? 'var(--brand-accent)' : 'var(--surface-primary)',
                color: state.viewMode === 'list' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button 
              className={`view-btn hover-scale ${state.viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
              onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
              style={{
                padding: 'var(--space-2)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: state.viewMode === 'grid' ? 'var(--brand-accent)' : 'var(--surface-primary)',
                color: state.viewMode === 'grid' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <FilterBar 
          categories={state.categories}
          muscles={state.muscles}
          equipment={state.equipment}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={state.filters}
        />
      </div>

      {/* Exercise Grid */}
      <div className={`exercises-grid ${state.viewMode === 'grid' ? 'grid-view' : 'list-view'}`} style={{
        display: 'grid',
        gridTemplateColumns: state.viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
        gap: 'var(--space-5)',
        marginBottom: 'var(--space-8)'
      }}>
        {state.filteredExercises.length > 0 ? (
          state.filteredExercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id || `exercise-${index}`}
              exercise={exercise} 
              index={index}
              onSelect={(exercise) => dispatch({ type: 'SET_SELECTED_EXERCISE', payload: exercise })} 
            />
          ))
        ) : (
          <div className="empty-state" style={{ 
            gridColumn: '1 / -1',
            textAlign: 'center', 
            padding: 'var(--space-16) var(--space-5)',
            backgroundColor: 'var(--surface-primary)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-primary)'
          }}>
            <div className="empty-icon" style={{ marginBottom: 'var(--space-4)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
                <path d="M6.2 5h12l-2.5 7H8.7z"/>
                <path d="M21 5H6"/>
                <path d="M7 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
                <path d="M6 5v2a6 6 0 0 0 12 0V5"/>
              </svg>
            </div>
            <h3 style={{ 
              fontSize: 'var(--text-xl)', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              margin: '0 0 var(--space-2) 0'
            }}>No exercises found</h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--text-sm)'
            }}>Try adjusting your search terms or filters to find more exercises.</p>
            <button 
              onClick={handleClearFilters} 
              className="btn-primary hover-scale"
              style={{
                padding: 'var(--space-3) var(--space-5)',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                borderRadius: 'var(--radius-xl)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-primary) 100%)',
                color: 'var(--text-inverse)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {state.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage === 1}
            className="pagination-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>
          
          <div className="pagination-numbers">
            {[...Array(Math.min(7, state.totalPages))].map((_, index) => {
              const pageNum = Math.max(1, state.currentPage - 3) + index;
              if (pageNum > state.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-number ${pageNum === state.currentPage ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage === state.totalPages}
            className="pagination-btn"
          >
            Next
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <ExerciseModal exercise={state.selectedExercise} onClose={() => dispatch({ type: 'SET_SELECTED_EXERCISE', payload: null })} />
    </div>
  );
};

export default ExerciseLibrary; 