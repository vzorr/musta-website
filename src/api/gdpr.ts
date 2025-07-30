// src/api/gdpr.ts - GDPR API calls
import { apiClient } from './client';
import { GDPRRequest, APIResponse, UserData } from '../types';

class GDPRAPI {
  private readonly baseEndpoint = '/gdpr';

  /**
   * Request data access
   */
  async requestDataAccess(email: string, language: 'sq' | 'en' = 'sq'): Promise<APIResponse<UserData[]>> {
    return apiClient.post(`${this.baseEndpoint}/access`, { email, language });
  }

  /**
   * Request data export
   */
  async requestDataExport(email: string, language: 'sq' | 'en' = 'sq'): Promise<APIResponse> {
    return apiClient.post(`${this.baseEndpoint}/export`, { email, language });
  }

  /**
   * Request data deletion
   */
  async requestDataDeletion(
    email: string, 
    confirmEmail: string, 
    reason?: string, 
    language: 'sq' | 'en' = 'sq'
  ): Promise<APIResponse> {
    return apiClient.post(`${this.baseEndpoint}/delete`, {
      email,
      confirmEmail,
      reason,
      language
    });
  }

  /**
   * Request data rectification
   */
  async requestDataRectification(
    email: string, 
    details: string, 
    language: 'sq' | 'en' = 'sq'
  ): Promise<APIResponse> {
    return apiClient.post(`${this.baseEndpoint}/rectify`, {
      email,
      details,
      language
    });
  }
}

export const gdprApi = new GDPRAPI();