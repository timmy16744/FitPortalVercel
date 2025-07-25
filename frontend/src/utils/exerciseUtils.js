// Exercise category color mappings
export const EXERCISE_CATEGORY_COLORS = {
  'chest': {
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    accent: 'bg-red-500',
    tag: 'bg-red-100 text-red-800'
  },
  'back': {
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
    tag: 'bg-blue-100 text-blue-800'
  },
  'shoulders': {
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    accent: 'bg-orange-500',
    tag: 'bg-orange-100 text-orange-800'
  },
  'arms': {
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    accent: 'bg-purple-500',
    tag: 'bg-purple-100 text-purple-800'
  },
  'legs': {
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    accent: 'bg-green-500',
    tag: 'bg-green-100 text-green-800'
  },
  'core': {
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    accent: 'bg-pink-500',
    tag: 'bg-pink-100 text-pink-800'
  },
  'cardio': {
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    accent: 'bg-teal-500',
    tag: 'bg-teal-100 text-teal-800'
  },
  'full body': {
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    accent: 'bg-indigo-500',
    tag: 'bg-indigo-100 text-indigo-800'
  },
  'waist': {
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-700',
    accent: 'bg-pink-500',
    tag: 'bg-pink-100 text-pink-800'
  },
  'lower arms': {
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    accent: 'bg-purple-500',
    tag: 'bg-purple-100 text-purple-800'
  },
  'upper arms': {
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    accent: 'bg-purple-500',
    tag: 'bg-purple-100 text-purple-800'
  },
  'upper legs': {
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    accent: 'bg-green-500',
    tag: 'bg-green-100 text-green-800'
  },
  'lower legs': {
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    accent: 'bg-green-500',
    tag: 'bg-green-100 text-green-800'
  },
  'neck': {
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    accent: 'bg-orange-500',
    tag: 'bg-orange-100 text-orange-800'
  }
};

// Default colors for unknown categories
const DEFAULT_COLORS = {
  gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
  bg: 'bg-gray-50',
  border: 'border-gray-200',
  text: 'text-gray-700',
  accent: 'bg-gray-500',
  tag: 'bg-gray-100 text-gray-800'
};

// Get colors for a muscle group/category
export const getMuscleGroupColors = (category) => {
  if (!category) return DEFAULT_COLORS;
  
  const normalizedCategory = category.toLowerCase().trim();
  return EXERCISE_CATEGORY_COLORS[normalizedCategory] || DEFAULT_COLORS;
};

export const getMuscleGroupColor = (bodyPart) => {
    const colors = {
      'chest': '#ff942e',
      'back': '#4f3ff0', 
      'shoulders': '#df3670',
      'biceps': '#34c471',
      'triceps': '#4067f9',
      'forearms': '#096c86',
      'abs': '#ff6b6b',
      'quadriceps': '#845ec2',
      'hamstrings': '#f9ca24',
      'glutes': '#f0932b',
      'calves': '#6c5ce7',
      'cardio': '#00b894',
      'full body': '#2d3436',
      'other': '#636e72'
    };
    return colors[bodyPart?.toLowerCase()] || '#6366f1';
  };

// Simple color mapping for the dashboard cards
export const getCategoryColor = (category) => {
  if (!category) return { primary: '#6b7280', background: '#f3f4f6' };
  
  const colorMap = {
    'chest': { primary: '#ef4444', background: '#fee2e2' },
    'back': { primary: '#3b82f6', background: '#dbeafe' },
    'shoulders': { primary: '#f59e0b', background: '#fef3c7' },
    'arms': { primary: '#8b5cf6', background: '#ede9fe' },
    'upper arms': { primary: '#8b5cf6', background: '#ede9fe' },
    'lower arms': { primary: '#8b5cf6', background: '#ede9fe' },
    'legs': { primary: '#10b981', background: '#d1fae5' },
    'upper legs': { primary: '#10b981', background: '#d1fae5' },
    'lower legs': { primary: '#14b8a6', background: '#ccfbf1' },
    'core': { primary: '#ec4899', background: '#fce7f3' },
    'waist': { primary: '#ec4899', background: '#fce7f3' },
    'cardio': { primary: '#14b8a6', background: '#ccfbf1' },
    'neck': { primary: '#f59e0b', background: '#fef3c7' },
    'full body': { primary: '#6366f1', background: '#e0e7ff' }
  };
  
  const normalized = category.toLowerCase().trim();
  return colorMap[normalized] || { primary: '#6b7280', background: '#f3f4f6' };
};

// Normalize category names for consistent display
export const normalizeCategoryName = (category) => {
  if (!category) return 'Unknown';
  
  const normalized = category.toLowerCase().trim();
  const titleCase = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  
  // Special cases for better display
  const specialCases = {
    'waist': 'Core',
    'upper arms': 'Arms',
    'lower arms': 'Arms', 
    'upper legs': 'Legs',
    'lower legs': 'Legs',
    'full body': 'Full Body'
  };
  
  return specialCases[normalized] || titleCase;
};

// Group exercises by category
export const groupExercisesByCategory = (exercises) => {
  const grouped = {};
  
  exercises.forEach(exercise => {
    const category = normalizeCategoryName(exercise.bodyPart || exercise.category);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(exercise);
  });
  
  return grouped;
};

// Filter exercises by category
export const filterExercisesByCategory = (exercises, category) => {
  if (!category || category === 'all') return exercises;
  
  const normalizedFilter = category.toLowerCase();
  return exercises.filter(exercise => {
    const exerciseCategory = (exercise.bodyPart || exercise.category || '').toLowerCase();
    return exerciseCategory.includes(normalizedFilter);
  });
};

// Search exercises by name, category, or muscle
export const searchExercises = (exercises, searchTerm) => {
  if (!searchTerm) return exercises;
  
  const term = searchTerm.toLowerCase().trim();
  return exercises.filter(exercise => {
    const name = (exercise.name || '').toLowerCase();
    const category = (exercise.bodyPart || exercise.category || '').toLowerCase();
    const target = (exercise.target || '').toLowerCase();
    const equipment = (exercise.equipment || '').toLowerCase();
    const muscles = Array.isArray(exercise.muscles) 
      ? exercise.muscles.join(' ').toLowerCase()
      : '';
    
    return name.includes(term) ||
           category.includes(term) ||
           target.includes(term) ||
           equipment.includes(term) ||
           muscles.includes(term);
  });
};

// Get unique categories from exercises array
export const getUniqueCategories = (exercises) => {
  const categories = new Set();
  exercises.forEach(exercise => {
    const category = normalizeCategoryName(exercise.bodyPart || exercise.category);
    categories.add(category);
  });
  return Array.from(categories).sort();
};

// Get unique equipment from exercises array
export const getUniqueEquipment = (exercises) => {
  const equipment = new Set();
  exercises.forEach(exercise => {
    if (exercise.equipment) {
      equipment.add(exercise.equipment);
    }
  });
  return Array.from(equipment).sort();
};

// Format exercise instructions
export const formatInstructions = (instructions) => {
  if (!instructions) return [];
  
  if (Array.isArray(instructions)) {
    return instructions.filter(step => step && step.trim());
  }
  
  if (typeof instructions === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(instructions);
      if (Array.isArray(parsed)) {
        return parsed.filter(step => step && step.trim());
      }
    } catch (e) {
      // Not JSON, split by newlines or periods
      return instructions
        .split(/[\n.]/)
        .map(step => step.trim())
        .filter(step => step && step.length > 5); // Filter out very short fragments
    }
  }
  
  return [];
};

// Calculate estimated duration for a workout
export const calculateWorkoutDuration = (workoutData) => {
  if (!workoutData || !workoutData.days) return 0;
  
  let totalMinutes = 0;
  
  workoutData.days.forEach(day => {
    if (day.groups) {
      day.groups.forEach(group => {
        if (group.exercises) {
          group.exercises.forEach(exercise => {
            // Estimate 2-3 minutes per exercise (including rest)
            totalMinutes += 2.5;
            
            // Add time for sets
            if (exercise.sets && exercise.sets.length > 0) {
              totalMinutes += exercise.sets.length * 0.5; // 30 seconds per set
            }
          });
        }
      });
    }
  });
  
  return Math.round(totalMinutes);
};

// Get difficulty level based on exercise complexity
export const getExerciseDifficulty = (exercise) => {
  // This is a simple heuristic - in a real app you might have this data in the exercise itself
  const compound = ['squat', 'deadlift', 'bench', 'pull-up', 'row', 'press'];
  const isolation = ['curl', 'extension', 'raise', 'fly', 'crunch'];
  
  const name = (exercise.name || '').toLowerCase();
  
  if (compound.some(term => name.includes(term))) {
    return { level: 'Advanced', color: 'text-red-600', bg: 'bg-red-100' };
  }
  
  if (isolation.some(term => name.includes(term))) {
    return { level: 'Beginner', color: 'text-green-600', bg: 'bg-green-100' };
  }
  
  return { level: 'Intermediate', color: 'text-orange-600', bg: 'bg-orange-100' };
};

// Generate a color for client avatars
export const getClientAvatarColor = (clientName) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  // Use name to consistently generate same color
  const hash = clientName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Format time duration
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Validate exercise data
export const validateExercise = (exercise) => {
  const errors = [];
  
  if (!exercise.name || exercise.name.trim().length < 2) {
    errors.push('Exercise name must be at least 2 characters');
  }
  
  if (!exercise.bodyPart && !exercise.category) {
    errors.push('Exercise must have a category');
  }
  
  if (!exercise.instructions || (Array.isArray(exercise.instructions) && exercise.instructions.length === 0)) {
    errors.push('Exercise must have instructions');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 