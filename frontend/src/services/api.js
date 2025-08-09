// API Service for FitPortal Backend Integration

class ApiService {
  constructor() {
    // Use environment variable or default to localhost
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    // Set default trainer credentials immediately
    this.setTrainerCredentials('trainer', 'duck');
  }

  // Authentication
  setTrainerCredentials(username = 'trainer', password = 'duck') {
    this.trainerCredentials = btoa(`${username}:${password}`);
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add trainer authentication for protected endpoints
    if (this.trainerCredentials && this.requiresAuth(endpoint)) {
      config.headers['Authorization'] = `Basic ${this.trainerCredentials}`;
      console.log(`Adding auth to ${endpoint}:`, config.headers['Authorization']);
    } else {
      console.log(`No auth needed for ${endpoint}`, { hasCredentials: !!this.trainerCredentials, requiresAuth: this.requiresAuth(endpoint) });
    }

    try {
      console.log(`API Request: ${endpoint}`, { url, headers: config.headers });
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Check if endpoint requires authentication
  requiresAuth(endpoint) {
    // Most trainer endpoints require auth, except client-facing ones
    const unprotectedEndpoints = ['/login', '/client/'];
    return !unprotectedEndpoints.some(path => endpoint.includes(path));
  }

  // Authentication methods
  async login(username = 'trainer', password = 'duck') {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response:', response);
      
      if (response && response.success) {
        this.setTrainerCredentials(username, password);
        return { success: true, user: response.user };
      }
      return { success: false, error: response?.error || 'Login failed' };
    } catch (error) {
      console.error('Login request failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Client Management
  async getClients(status = 'active') {
    return this.request(`/clients?status=${status}`);
  }

  async getClient(clientId) {
    return this.request(`/client/${clientId}`);
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

  async archiveClient(clientId) {
    return this.request(`/clients/${clientId}/archive`, {
      method: 'PUT',
    });
  }

  // Exercise Management
  async getExercises() {
    return this.request('/exercises');
  }

  async getEnhancedExercises() {
    return this.request('/exercises/enhanced');
  }

  async createExercise(exerciseData) {
    return this.request('/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  }

  // Workout Templates
  async getWorkoutTemplates() {
    return this.request('/templates');
  }

  async getWorkoutTemplate(templateId) {
    return this.request(`/templates/${templateId}`);
  }

  async createWorkoutTemplate(templateData) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  // Client Programs & Workouts
  async getClientActiveProgram(clientId) {
    return this.request(`/clients/${clientId}/program/active`);
  }

  async assignProgramToClient(clientId, programData) {
    return this.request(`/clients/${clientId}/programs/assign`, {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async getClientWorkoutHistory(clientId) {
    return this.request(`/clients/${clientId}/workout-history`);
  }

  async logWorkout(clientId, workoutData) {
    return this.request(`/clients/${clientId}/program/log`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  // Exercise History & Progress
  async getExerciseHistory(clientId, exerciseId) {
    return this.request(`/clients/${clientId}/exercise/${exerciseId}/history`);
  }

  async getPersonalRecords(clientId) {
    return this.request(`/clients/${clientId}/personal-records`);
  }

  // Nutrition Tracking
  async getNutritionLogs(clientId, date = null) {
    const dateParam = date ? `?date=${date}` : '';
    return this.request(`/clients/${clientId}/nutrition-logs${dateParam}`);
  }

  async logNutrition(clientId, nutritionData) {
    return this.request(`/clients/${clientId}/nutrition-logs`, {
      method: 'POST',
      body: JSON.stringify(nutritionData),
    });
  }

  // Body Stats & Progress
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

  // Messaging
  async getMessages(clientId) {
    return this.request(`/clients/${clientId}/messages`);
  }

  async sendMessage(clientId, messageData) {
    return this.request(`/clients/${clientId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Analytics & Statistics
  async getClientStats() {
    const clients = await this.getClients('all');
    const activeClients = clients.filter(c => !c.archived);
    const newClients = clients.filter(c => {
      const joinDate = new Date(c.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return joinDate > weekAgo;
    });

    return {
      totalClients: clients.length,
      activeClients: activeClients.length,
      newClients: newClients.length,
      archivedClients: clients.filter(c => c.archived).length,
    };
  }

  async getRevenueData() {
    // This would need to be implemented in backend based on subscription/payment data
    // For now, return mock data structure that matches your backend
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      weeklyRevenue: [],
    };
  }

  async getWorkoutStats() {
    // Aggregate workout completion data across all clients
    const clients = await this.getClients('active');
    let totalWorkouts = 0;
    let completionRate = 0;

    for (const client of clients) {
      try {
        const history = await this.getClientWorkoutHistory(client.id);
        totalWorkouts += history.length;
      } catch (error) {
        console.warn(`Failed to get workout history for client ${client.id}:`, error);
      }
    }

    return {
      totalWorkouts,
      completionRate,
      weeklyCompletion: [], // Would need backend aggregation
    };
  }

  // Client Activity Feed
  async getRecentActivity() {
    const clients = await this.getClients('active');
    const activities = [];

    for (const client of clients.slice(0, 10)) { // Limit to recent clients
      try {
        // Get recent workout history
        const workouts = await this.getClientWorkoutHistory(client.id);
        const recentWorkout = workouts[0];
        
        if (recentWorkout) {
          activities.push({
            id: `workout-${client.id}-${recentWorkout.id}`,
            clientId: client.id,
            client: client.name || `${client.first_name} ${client.last_name}`,
            action: 'completed a workout',
            time: this.formatRelativeTime(recentWorkout.completed_at),
            avatar: this.getClientInitials(client),
          });
        }

        // Get recent messages
        const messages = await this.getMessages(client.id);
        const recentMessage = messages.filter(m => m.sender === 'client')[0];
        
        if (recentMessage) {
          activities.push({
            id: `message-${client.id}-${recentMessage.id}`,
            clientId: client.id,
            client: client.name || `${client.first_name} ${client.last_name}`,
            action: 'sent a message',
            time: this.formatRelativeTime(recentMessage.timestamp),
            avatar: this.getClientInitials(client),
          });
        }
      } catch (error) {
        console.warn(`Failed to get activity for client ${client.id}:`, error);
      }
    }

    // Sort by most recent and limit to 10
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }

  // Programs & Templates
  async getPrograms() {
    return this.request('/programs');
  }

  async createProgram(programData) {
    return this.request('/programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async deleteProgram(programId) {
    return this.request(`/programs/${programId}`, {
      method: 'DELETE',
    });
  }

  // Program Assignment
  async assignProgramToClient(clientId, assignmentData) {
    return this.request(`/clients/${clientId}/programs/assign`, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async unassignProgramFromClient(clientId) {
    return this.request(`/clients/${clientId}/programs/unassign`, {
      method: 'DELETE',
    });
  }

  async getClientActiveProgram(clientId) {
    return this.request(`/clients/${clientId}/program/active`);
  }

  async getClientAssignedExercises(clientId) {
    return this.request(`/clients/${clientId}/exercises`);
  }

  async getProgramStats(clientId, assignmentId) {
    return this.request(`/clients/${clientId}/program/${assignmentId}/stats`);
  }

  // Workout Logging
  async logWorkout(clientId, workoutData) {
    return this.request(`/clients/${clientId}/program/log`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async getExercisePrevious(clientId, exerciseId) {
    return this.request(`/clients/${clientId}/exercise/${exerciseId}/previous`);
  }

  // Workout Sessions
  async saveWorkoutSession(clientId, sessionData) {
    return this.request(`/clients/${clientId}/workout-session/save`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getWorkoutSession(clientId) {
    return this.request(`/clients/${clientId}/workout-session`);
  }

  async clearWorkoutSession(clientId) {
    return this.request(`/clients/${clientId}/workout-session`, {
      method: 'DELETE',
    });
  }

  // Body Stats & Progress
  async logBodyStats(clientId, statsData) {
    return this.request(`/clients/${clientId}/body-stats`, {
      method: 'POST',
      body: JSON.stringify(statsData),
    });
  }

  async uploadProgressPhoto(clientId, formData) {
    return this.request(`/clients/${clientId}/progress-photos`, {
      method: 'POST',
      body: formData,
      headers: this.trainerCredentials ? {
        'Authorization': `Basic ${this.trainerCredentials}`
      } : {}
    });
  }

  // Achievements
  async getClientAchievements(clientId) {
    return this.request(`/clients/${clientId}/achievements`);
  }

  // Daily Check-ins
  async getDailyCheckin(clientId, date = null) {
    const dateParam = date ? `?date=${date}` : '';
    return this.request(`/clients/${clientId}/daily-checkin${dateParam}`);
  }

  async logDailyCheckin(clientId, checkinData) {
    return this.request(`/clients/${clientId}/daily-checkin`, {
      method: 'POST',
      body: JSON.stringify(checkinData),
    });
  }

  // Utility methods
  getClientInitials(client) {
    const firstName = client.first_name || client.name || 'Unknown';
    const lastName = client.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  formatRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }

  // File upload helper (for progress photos, etc.)
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const config = {
      method: 'POST',
      body: formData,
    };

    // Remove Content-Type header to let browser set it with boundary
    delete config.headers;

    if (this.trainerCredentials) {
      config.headers = {
        'Authorization': `Basic ${this.trainerCredentials}`,
      };
    }

    return this.request(endpoint, config);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;