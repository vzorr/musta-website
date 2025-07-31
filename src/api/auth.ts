// src/api/auth.ts - Authentication API calls (if needed in future)
import { apiClient } from './client';
import { APIResponse } from '../../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

class AuthAPI {
  private readonly endpoint = '/auth';

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> {
    const response = await apiClient.post(`${this.endpoint}/login`, credentials);
    
    // Set auth token for future requests
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
      this.storeToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<APIResponse> {
    const response = await apiClient.post(`${this.endpoint}/logout`);
    
    // Clear auth token
    apiClient.clearAuthToken();
    this.removeToken();
    
    return response;
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<APIResponse<{ token: string }>> {
    const response = await apiClient.post(`${this.endpoint}/refresh`);
    
    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
      this.storeToken(response.data.token);
    }
    
    return response;
  }

  /**
   * Initialize auth from stored token
   */
  initializeAuth(): void {
    const token = this.getStoredToken();
    if (token) {
      apiClient.setAuthToken(token);
    }
  }

  // Private methods for token management
  private storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }
}

export const authApi = new AuthAPI();