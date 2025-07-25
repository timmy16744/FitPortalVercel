class ApiClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const headers = { ...this.defaultHeaders };
    
    // Always add Basic Auth for trainer endpoints (backend expects it)
    const trainerUsername = process.env.REACT_APP_TRAINER_USERNAME || 'trainer';
    const trainerPassword = process.env.REACT_APP_TRAINER_PASSWORD || 'duck';
    const credentials = btoa(`${trainerUsername}:${trainerPassword}`);
    headers['Authorization'] = `Basic ${credentials}`;
    
    return headers;
  }

  // Helper method for making requests
  async request(url, options = {}) {
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (response.status === 204) {
        return null; // No content
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials) {
    return await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Client Management
  async getClients(status = 'active') {
    return await this.request(`/clients?status=${status}`);
  }

  async getClient(clientId) {
    return await this.request(`/client/${clientId}`);
  }

  async createClient(clientData) {
    return await this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(clientId, clientData) {
    return await this.request(`/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async archiveClient(clientId) {
    return await this.request(`/clients/${clientId}/archive`, {
      method: 'PUT',
    });
  }

  async deleteClient(clientId) {
    return await this.request(`/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  async updateClientFeatures(clientId, features) {
    return await this.request(`/clients/${clientId}/features`, {
      method: 'PUT',
      body: JSON.stringify(features),
    });
  }

  // Exercise Management
  async getExercises() {
    return await this.request('/exercises');
  }

  async getExercisesEnhanced(page = 1, limit = 50, search = '', category = '') {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category })
    });
    return await this.request(`/exercises/enhanced?${params}`);
  }

  async syncExerciseDB() {
    return await this.request('/exercisedb/sync', {
      method: 'POST',
    });
  }

  // Workout Templates
  async getWorkoutTemplates() {
    return await this.request('/templates');
  }

  async getWorkoutTemplate(templateId) {
    return await this.request(`/templates/${templateId}`);
  }

  async createWorkoutTemplate(templateData) {
    return await this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateWorkoutTemplate(templateId, templateData) {
    return await this.request(`/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  // Program Assignment
  async assignProgramToClient(clientId, templateId, startDate) {
    return await this.request(`/clients/${clientId}/programs/assign`, {
      method: 'POST',
      body: JSON.stringify({
        template_id: templateId,
        start_date: startDate,
      }),
    });
  }

  async unassignProgramFromClient(clientId) {
    return await this.request(`/clients/${clientId}/programs/unassign`, {
      method: 'DELETE',
    });
  }

  async getClientActiveProgram(clientId) {
    return await this.request(`/clients/${clientId}/program/active`);
  }

  async getClientExercises(clientId) {
    return await this.request(`/clients/${clientId}/exercises`);
  }

  // Workout Logging
  async logWorkout(clientId, workoutData) {
    return await this.request(`/clients/${clientId}/program/log`, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async getWorkoutHistory(clientId) {
    return await this.request(`/clients/${clientId}/workout-history`);
  }

  async getExerciseHistory(clientId, exerciseId) {
    return await this.request(`/clients/${clientId}/exercise/${exerciseId}/history`);
  }

  async getPreviousExerciseData(clientId, exerciseId) {
    return await this.request(`/clients/${clientId}/exercise/${exerciseId}/previous`);
  }

  // Workout Session Management
  async saveWorkoutProgress(clientId, sessionData) {
    return await this.request(`/clients/${clientId}/workout-session/save`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getWorkoutSession(clientId) {
    return await this.request(`/clients/${clientId}/workout-session`);
  }

  async clearWorkoutSession(clientId) {
    return await this.request(`/clients/${clientId}/workout-session`, {
      method: 'DELETE',
    });
  }

  // Nutrition
  async getNutritionLogs(clientId, date = null) {
    const url = date ? `/clients/${clientId}/nutrition-logs?date=${date}` : `/clients/${clientId}/nutrition-logs`;
    return await this.request(url);
  }

  async addNutritionLog(clientId, nutritionData) {
    return await this.request(`/clients/${clientId}/nutrition-logs`, {
      method: 'POST',
      body: JSON.stringify(nutritionData),
    });
  }

  async updateNutritionLog(clientId, logId, nutritionData) {
    return await this.request(`/clients/${clientId}/nutrition-logs/${logId}`, {
      method: 'PUT',
      body: JSON.stringify(nutritionData),
    });
  }

  async deleteNutritionLog(clientId, logId) {
    return await this.request(`/clients/${clientId}/nutrition-logs/${logId}`, {
      method: 'DELETE',
    });
  }

  async getNutritionGoals(clientId) {
    return await this.request(`/clients/${clientId}/nutrition-goals`);
  }

  async updateNutritionGoals(clientId, goals) {
    return await this.request(`/clients/${clientId}/nutrition-goals`, {
      method: 'PUT',
      body: JSON.stringify(goals),
    });
  }

  async getClientMealPlan(clientId) {
    return await this.request(`/clients/${clientId}/meal-plan`);
  }

  // Body Stats & Progress
  async getBodyStats(clientId) {
    return await this.request(`/clients/${clientId}/body-stats`);
  }

  async addBodyStat(clientId, statData) {
    return await this.request(`/clients/${clientId}/body-stats`, {
      method: 'POST',
      body: JSON.stringify(statData),
    });
  }

  async getProgressPhotos(clientId) {
    return await this.request(`/clients/${clientId}/progress-photos`);
  }

  async uploadProgressPhoto(clientId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // For file uploads, don't set Content-Type header
    const headers = { ...this.getAuthHeaders() };
    delete headers['Content-Type'];

    return await fetch(`${this.baseURL}/clients/${clientId}/progress-photos`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  async getPersonalRecords(clientId) {
    return await this.request(`/clients/${clientId}/personal-records`);
  }

  async getAchievements(clientId) {
    return await this.request(`/clients/${clientId}/achievements`);
  }

  // Messages
  async getMessages(clientId) {
    return await this.request(`/clients/${clientId}/messages`);
  }

  async sendMessage(clientId, messageData) {
    return await this.request(`/clients/${clientId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Programs (multi-week templates)
  async getPrograms() {
    return await this.request('/programs');
  }

  async createProgram(programData) {
    return await this.request('/programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async deleteProgram(programId) {
    return await this.request(`/programs/${programId}`, {
      method: 'DELETE',
    });
  }

  // Statistics
  async getProgramStats(clientId, assignmentId) {
    return await this.request(`/clients/${clientId}/program/${assignmentId}/stats`);
  }

  // Client Today Summary
  async getClientToday(clientId) {
    return await this.request(`/client/${clientId}/today`);
  }

  // Workout Assignments
  async getWorkoutAssignments() {
    return await this.request('/workout-assignments');
  }
}

const ApiClientInstance = new ApiClient();
export default ApiClientInstance; 