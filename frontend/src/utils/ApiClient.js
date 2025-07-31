// FitPortal API Client - Comprehensive Backend Integration
class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    this.token = null;
  }

  // Authentication Methods
  setAuthToken(token) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Client Management
  async getClients() {
    return this.request('/clients');
  }

  async getClient(clientId) {
    return this.request(`/clients/${clientId}`);
  }

  async createClient(clientData) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(clientId, clientData) {
    return this.request(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(clientId) {
    return this.request(`/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  async archiveClient(clientId) {
    return this.request(`/clients/${clientId}/archive`, {
      method: 'POST',
    });
  }

  // Client PIN Management
  async setClientPin(clientId, pin) {
    return this.request(`/clients/${clientId}/pin`, {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  async verifyClientPin(clientId, pin) {
    return this.request(`/clients/${clientId}/verify-pin`, {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  }

  // Workout Management
  async getWorkouts() {
    return this.request('/workouts');
  }

  async getWorkout(workoutId) {
    return this.request(`/workouts/${workoutId}`);
  }

  async createWorkout(workoutData) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async updateWorkout(workoutId, workoutData) {
    return this.request(`/workouts/${workoutId}`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
    });
  }

  async deleteWorkout(workoutId) {
    return this.request(`/workouts/${workoutId}`, {
      method: 'DELETE',
    });
  }

  // Client Program Management
  async getActiveProgram(clientId) {
    return this.request(`/clients/${clientId}/program`);
  }

  async assignProgram(clientId, programData) {
    return this.request(`/clients/${clientId}/program`, {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async getClientWorkouts(clientId) {
    return this.request(`/clients/${clientId}/workouts`);
  }

  // Workout History & Logging
  async getWorkoutHistory(clientId) {
    return this.request(`/clients/${clientId}/workout-history`);
  }

  async logWorkout(clientId, workoutData) {
    return this.request(`/clients/${clientId}/workout-logs`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async updateWorkoutLog(logId, logData) {
    return this.request(`/workout-logs/${logId}`, {
      method: 'PUT',
      body: JSON.stringify(logData),
    });
  }

  // Exercise Library
  async getExercises() {
    return this.request('/exercises');
  }

  async getExercise(exerciseId) {
    return this.request(`/exercises/${exerciseId}`);
  }

  async createExercise(exerciseData) {
    return this.request('/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  }

  async updateExercise(exerciseId, exerciseData) {
    return this.request(`/exercises/${exerciseId}`, {
      method: 'PUT',
      body: JSON.stringify(exerciseData),
    });
  }

  async deleteExercise(exerciseId) {
    return this.request(`/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
  }

  // Nutrition Management
  async getNutritionLogs(clientId, date = null) {
    const endpoint = date 
      ? `/clients/${clientId}/nutrition?date=${date}`
      : `/clients/${clientId}/nutrition`;
    return this.request(endpoint);
  }

  async logNutrition(clientId, nutritionData) {
    return this.request(`/clients/${clientId}/nutrition`, {
      method: 'POST',
      body: JSON.stringify(nutritionData),
    });
  }

  async updateNutritionLog(logId, nutritionData) {
    return this.request(`/nutrition-logs/${logId}`, {
      method: 'PUT',
      body: JSON.stringify(nutritionData),
    });
  }

  async deleteNutritionLog(logId) {
    return this.request(`/nutrition-logs/${logId}`, {
      method: 'DELETE',
    });
  }

  // Meal Plans
  async getClientMealPlan(clientId) {
    return this.request(`/clients/${clientId}/meal-plan`);
  }

  async assignMealPlan(clientId, mealPlanData) {
    return this.request(`/clients/${clientId}/meal-plan`, {
      method: 'POST',
      body: JSON.stringify(mealPlanData),
    });
  }

  // Progress Tracking
  async getBodyStats(clientId) {
    return this.request(`/clients/${clientId}/body-stats`);
  }

  async logBodyStats(clientId, statsData) {
    return this.request(`/clients/${clientId}/body-stats`, {
      method: 'POST',
      body: JSON.stringify(statsData),
    });
  }

  async getProgressPhotos(clientId) {
    return this.request(`/clients/${clientId}/progress-photos`);
  }

  async uploadProgressPhoto(clientId, photoData) {
    // Handle file upload differently
    const formData = new FormData();
    formData.append('photo', photoData.file);
    formData.append('date', photoData.date);
    formData.append('notes', photoData.notes || '');

    return this.request(`/clients/${clientId}/progress-photos`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  async deleteProgressPhoto(photoId) {
    return this.request(`/progress-photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  // Analytics & Reports
  async getClientAnalytics(clientId) {
    return this.request(`/clients/${clientId}/analytics`);
  }

  async getTrainerDashboardStats() {
    return this.request('/trainer/dashboard-stats');
  }

  // Messaging & Chat
  async getMessages(clientId) {
    return this.request(`/clients/${clientId}/messages`);
  }

  async sendMessage(clientId, messageData) {
    return this.request(`/clients/${clientId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(messageId) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'POST',
    });
  }

  // Group Management
  async getClientGroups(clientId) {
    return this.request(`/clients/${clientId}/groups`);
  }

  async getGroups() {
    return this.request('/groups');
  }

  async createGroup(groupData) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async addClientToGroup(groupId, clientId) {
    return this.request(`/groups/${groupId}/clients`, {
      method: 'POST',
      body: JSON.stringify({ clientId }),
    });
  }

  async removeClientFromGroup(groupId, clientId) {
    return this.request(`/groups/${groupId}/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  // Food Database
  async searchFoods(query) {
    return this.request(`/foods/search?q=${encodeURIComponent(query)}`);
  }

  async getFoodDetails(foodId) {
    return this.request(`/foods/${foodId}`);
  }

  // File Upload Utilities
  async uploadFile(file, type = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    });
  }

  // Utility Methods
  async healthCheck() {
    return this.request('/health');
  }

  // Mock data methods for development (remove in production)
  getMockClients() {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'active',
        joinDate: '2024-01-15',
        lastActivity: '2024-01-20',
        program: 'Weight Loss Program',
        avatar: null
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        status: 'active',
        joinDate: '2024-01-10',
        lastActivity: '2024-01-19',
        program: 'Muscle Building Program',
        avatar: null
      }
    ];
  }

  getMockWorkouts() {
    return [
      {
        id: 1,
        name: 'Upper Body Strength',
        duration: 45,
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 12 },
          { name: 'Pull-ups', sets: 3, reps: 8 },
          { name: 'Bench Press', sets: 4, reps: 10 }
        ]
      },
      {
        id: 2,
        name: 'Lower Body Power',
        duration: 50,
        exercises: [
          { name: 'Squats', sets: 4, reps: 12 },
          { name: 'Deadlifts', sets: 3, reps: 8 },
          { name: 'Lunges', sets: 3, reps: 10 }
        ]
      }
    ];
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
