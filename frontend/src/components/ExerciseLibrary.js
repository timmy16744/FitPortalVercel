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
    console.log('ExerciseCard rendering:', exercise?.name);
    return (
      <div 
        className="project-box-wrapper"
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          border: '2px solid red', // DEBUG: Make cards visible
          margin: '10px',
          minHeight: '200px',
          backgroundColor: 'white'
        }}
      >
        <div 
          className="project-box exercise-card" 
          style={{ 
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: '200px',
            padding: '16px',
            border: '1px solid #ccc'
          }}
          onClick={() => onSelect && onSelect(exercise)}
        >
          {/* Simple visible content */}
          <h3 style={{ color: 'black', margin: '0 0 8px 0' }}>
            {exercise?.name || 'No Name'}
          </h3>
          <p style={{ color: 'gray', margin: '0 0 8px 0' }}>
            {exercise?.bodyPart || exercise?.category || 'No Category'}
          </p>
          <p style={{ color: 'blue', margin: '0' }}>
            {exercise?.equipment || 'No Equipment'}
          </p>
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
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
    <div className="projects-section exercise-library">
      {/* Header */}
      <div className="projects-section-header">
        <div>
          <p>Exercise Library</p>
          <p className="library-subtitle">Discover and explore exercises by muscle group</p>
        </div>
        <div className="header-actions">
          <p className="time">{(state.totalExercises || 0).toLocaleString()} exercises available</p>
        </div>
      </div>

      {/* Stats */}
      <div className="projects-section-line">
        <div className="projects-status">
          <div className="item-status">
            <span className="status-number">{state.filteredExercises.length}</span>
            <span className="status-type">Showing</span>
          </div>
          <div className="item-status">
            <span className="status-number">{state.categories.length}</span>
            <span className="status-type">Muscle Groups</span>
          </div>
          <div className="item-status">
            <span className="status-number">{state.equipment.length}</span>
            <span className="status-type">Equipment Types</span>
          </div>
        </div>
        
        <div className="view-actions">
          <button 
            className={`view-btn list-view ${state.viewMode === 'list' ? 'active' : ''}`} 
            title="List View"
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button 
            className={`view-btn grid-view ${state.viewMode === 'grid' ? 'active' : ''}`} 
            title="Grid View"
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' })}
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

      {/* Search and Filters */}
      <FilterBar 
        categories={state.categories}
        muscles={state.muscles}
        equipment={state.equipment}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={state.filters}
      />

      {/* Exercise Grid */}
      <div className={`project-boxes exercise-grid ${state.viewMode === 'grid' ? 'jsGridView' : 'jsListView'}`}>
        {console.log('Rendering exercises:', state.filteredExercises.length, state.filteredExercises.slice(0,2))}
        {state.filteredExercises.length > 0 ? (
          state.filteredExercises.map((exercise, index) => {
            console.log('Rendering exercise:', exercise.name, exercise.id);
            return (
              <ExerciseCard 
                key={exercise.id || `exercise-${index}`}
                exercise={exercise} 
                index={index}
                onSelect={(exercise) => dispatch({ type: 'SET_SELECTED_EXERCISE', payload: exercise })} 
              />
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6.2 5h12l-2.5 7H8.7z"/>
                <path d="M21 5H6"/>
                <path d="M7 5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/>
                <path d="M6 5v2a6 6 0 0 0 12 0V5"/>
              </svg>
            </div>
            <h3>No exercises found</h3>
            <p>Try adjusting your search terms or filters to find more exercises.</p>
            <button onClick={handleClearFilters} className="btn-primary">
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