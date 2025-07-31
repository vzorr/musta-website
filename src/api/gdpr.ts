// src/api/gdpr.ts - GDPR API calls (Fixed imports)
import { apiClient } from './client';
import { GDPRRequest, APIResponse, UserData } from '../types';

class GDPRAPI {
  private readonly baseEndpoint = '/gdpr';

  /**
   * Request data access
   */
  async requestDataAccess(email: string, language: 'sq' | 'en' = 'sq'): Promise<APIResponse<UserData[]>> {
    return apiClient.post(`${this.baseEndpoint}`, { 
      email, 
      language,
      requestType: 'access'
    });
  }

  /**
   * Request data export
   */
  async requestDataExport(email: string, language: 'sq' | 'en' = 'sq'): Promise<APIResponse> {
    return apiClient.post(`${this.baseEndpoint}`, { 
      email, 
      language,
      requestType: 'export'
    });
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
    return apiClient.post(`${this.baseEndpoint}`, {
      email,
      confirmEmail,
      reason,
      language,
      requestType: 'delete'
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
    return apiClient.post(`${this.baseEndpoint}`, {
      email,
      details,
      language,
      requestType: 'rectify'
    });
  }
}

export const gdprApi = new GDPRAPI();