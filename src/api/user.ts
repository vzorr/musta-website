// src/api/user.ts - User-related API calls
import { apiClient } from './client';
import { APIResponse, UserData } from '../../types';

class UserAPI {
  private readonly endpoint = '/user';

  /**
   * Get user profile
   */
  async getProfile(email: string): Promise<APIResponse<UserData>> {
    return apiClient.get(`${this.endpoint}/profile`, {
      headers: {
        'X-User-Email': encodeURIComponent(email)
      }
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(email: string, preferences: any): Promise<APIResponse> {
    return apiClient.put(`${this.endpoint}/preferences`, {
      email,
      preferences
    });
  }

  /**
   * Subscribe to notifications
   */
  async subscribe(email: string, categories: string[]): Promise<APIResponse> {
    return apiClient.post(`${this.endpoint}/subscribe`, {
      email,
      categories
    });
  }

  /**
   * Unsubscribe from notifications
   */
  async unsubscribe(email: string, token?: string): Promise<APIResponse> {
    return apiClient.post(`${this.endpoint}/unsubscribe`, {
      email,
      token
    });
  }
}

export const userApi = new UserAPI();