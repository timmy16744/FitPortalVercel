import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Save, X, AlertCircle, Dumbbell, Target } from 'lucide-react';
import ApiClient from '../../utils/api';

const WorkoutManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    bodyPart: '',
    equipment: '',
    target: '',
    instructions: '',
    gifUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, selectedCategory]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await ApiClient.getExercisesEnhanced();
      setExercises(response.exercises || []);
      setCategories(response.categories || []);
      setError('');
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;
    
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.bodyPart?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.equipment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(exercise => exercise.bodyPart === selectedCategory);
    }
    
    setFilteredExercises(filtered);
  };

  const handleAddExercise = () => {
    setEditingExercise(null);
    setFormData({
      name: '',
      bodyPart: '',
      equipment: '',
      target: '',
      instructions: '',
      gifUrl: ''
    });
    setShowAddModal(true);
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name || '',
      bodyPart: exercise.bodyPart || '',
      equipment: exercise.equipment || '',
      target: exercise.target || '',
      instructions: exercise.instructions || '',
      gifUrl: exercise.gifUrl || exercise.media_url || ''
    });
    setShowAddModal(true);
  };

  const handleSaveExercise = async () => {
    if (!formData.name || !formData.bodyPart) {
      setError('Name and body part are required');
      return;
    }

    try {
      if (editingExercise) {
        await ApiClient.updateExercise(editingExercise.id, formData);
        setSuccess('Exercise updated successfully');
      } else {
        await ApiClient.addExercise(formData);
        setSuccess('Exercise added successfully');
      }
      
      setShowAddModal(false);
      await fetchExercises();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError('Failed to save exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    try {
      await ApiClient.deleteExercise(exerciseId);
      setSuccess('Exercise deleted successfully');
      await fetchExercises();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setError('Failed to delete exercise');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExercise(null);
    setError('');
  };

  const getBodyPartColor = (bodyPart) => {
    const colors = {
      chest: '#ff6b6b',
      back: '#4ecdc4',
      shoulders: '#45b7d1',
      legs: '#96ceb4',
      arms: '#f7b731',
      core: '#5f27cd',
      cardio: '#00d2d3'
    };
    return colors[bodyPart?.toLowerCase()] || '#6c5ce7';
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: 'var(--secondary-color)', fontSize: '16px' }}>
          Loading exercises...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px', 
      height: '100%', 
      overflow: 'auto'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .workout-management-container {
            animation: fadeIn 0.6s ease-out;
          }
          .exercise-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          .exercise-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          }
          .search-filter-container {
            animation: slideIn 0.7s ease-out;
          }
          .stats-bar {
            animation: fadeIn 0.8s ease-out 0.1s;
            animation-fill-mode: both;
          }
          .exercise-grid {
            animation: fadeIn 0.9s ease-out 0.2s;
            animation-fill-mode: both;
          }
        `}
      </style>
      <div className="workout-management-container">

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        animation: 'slideIn 0.6s ease-out' 
      }}>
        <h2 style={{ 
          color: 'var(--main-color)', 
          fontSize: '24px', 
          fontWeight: '700', 
          margin: 0 
        }}>
          Exercise Management
        </h2>
        <button
          onClick={handleAddExercise}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
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
          Add Exercise
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          color: '#155724',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          {success}
        </div>
      )}
      
      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-filter-container" style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        backgroundColor: 'var(--projects-section)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--secondary-color)'
          }} />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--search-area-bg)',
              color: 'var(--main-color)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <Filter size={20} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--secondary-color)'
          }} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 12px 10px 40px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--search-area-bg)',
              color: 'var(--main-color)',
              fontSize: '14px',
              outline: 'none',
              minWidth: '200px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar" style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        fontSize: '14px',
        color: 'var(--secondary-color)'
      }}>
        <span>Total: <strong style={{ color: 'var(--main-color)' }}>{exercises.length}</strong> exercises</span>
        <span>•</span>
        <span>Filtered: <strong style={{ color: 'var(--main-color)' }}>{filteredExercises.length}</strong> exercises</span>
      </div>

      {/* Exercise Grid */}
      <div className="exercise-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {filteredExercises.map((exercise, index) => (
          <div 
            key={exercise.id} 
            className="exercise-card"
            style={{
            backgroundColor: 'var(--projects-section)',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            animation: `scaleIn 0.4s ease-out ${Math.min(index * 0.05, 1)}s`,
            animationFillMode: 'both'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--main-color)',
                margin: 0,
                flex: 1,
                marginRight: '8px'
              }}>
                {exercise.name}
              </h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditExercise(exercise);
                  }}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#4f46e5',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(79, 70, 229, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteExercise(exercise.id);
                  }}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#ef4444',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getBodyPartColor(exercise.bodyPart)
              }}></span>
              <span style={{ 
                fontSize: '14px', 
                color: 'var(--secondary-color)' 
              }}>
                {exercise.bodyPart || 'Not specified'}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--secondary-color)' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Equipment:</strong> {exercise.equipment || 'Not specified'}
              </div>
              {exercise.target && (
                <div>
                  <strong>Target:</strong> {exercise.target}
                </div>
              )}
            </div>

            {exercise.gifUrl && (
              <div style={{ marginTop: '12px' }}>
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          color: 'var(--secondary-color)'
        }}>
          <Dumbbell size={64} style={{ margin: '0 auto 24px', opacity: 0.3 }} />
          <h3 style={{ marginBottom: '16px', color: 'var(--main-color)' }}>
            No exercises found
          </h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--main-color)',
                margin: 0
              }}>
                {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--secondary-color)',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  Exercise Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Push-ups"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  Body Part *
                </label>
                <input
                  type="text"
                  value={formData.bodyPart}
                  onChange={(e) => setFormData({...formData, bodyPart: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="chest"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  Equipment
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="body weight"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  Target Muscle
                </label>
                <input
                  type="text"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="pectorals"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                  rows="3"
                  placeholder="Step-by-step instructions..."
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--main-color)'
                }}>
                  GIF URL
                </label>
                <input
                  type="url"
                  value={formData.gifUrl}
                  onChange={(e) => setFormData({...formData, gifUrl: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--search-area-bg)',
                    color: 'var(--main-color)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="https://example.com/exercise.gif"
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={handleSaveExercise}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                <Save size={16} />
                {editingExercise ? 'Update' : 'Add'} Exercise
              </button>
              <button
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: '#f8f9fa',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default WorkoutManagement;