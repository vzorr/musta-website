// src/api/registration.ts - Registration API calls
import { apiClient } from './client';
import { RegistrationFormData, APIResponse } from '../../types';

class RegistrationAPI {
  private readonly endpoint = '/register';

  /**
   * Register a new user
   */
  async register(data: RegistrationFormData): Promise<APIResponse> {
    return apiClient.post(this.endpoint, data);
  }

  /**
   * Check if email is already registered
   */
  async checkEmail(email: string): Promise<APIResponse<{ exists: boolean }>> {
    return apiClient.get(`${this.endpoint}/check-email`, {
      headers: {
        'X-Email': encodeURIComponent(email)
      }
    });
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmation(email: string): Promise<APIResponse> {
    return apiClient.post(`${this.endpoint}/resend-confirmation`, { email });
  }
}

export const registrationApi = new RegistrationAPI();