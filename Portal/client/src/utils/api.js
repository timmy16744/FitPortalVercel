class ClientAPI {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Helper method for making requests
  async request(url, options = {}) {
    const config = {
      headers: this.defaultHeaders,
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

  // Client Authentication
  async getClient(clientId) {
    return await this.request(`/client/${clientId}`);
  }

  // Client Today Summary
  async getClientToday(clientId) {
    return await this.request(`/client/${clientId}/today`);
  }

  // Workout Management
  async getClientActiveProgram(clientId) {
    return await this.request(`/clients/${clientId}/program/active`);
  }

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
    const headers = { ...this.defaultHeaders };
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
}

const ClientAPIInstance = new ClientAPI();
export default ClientAPIInstance;
