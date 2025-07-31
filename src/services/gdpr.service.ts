// src/services/gdpr.service.ts - MINIMAL FIX: Make return types consistent
import { GDPRRequest } from '../types';
import { googleService } from './google.service';
import { emailService } from './email.service';

// CHANGE: Added consistent return type interface
interface GDPRServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

class GDPRService {
  async processDataAccess(email: string, language: 'sq' | 'en'): Promise<GDPRServiceResponse> {
    try {
      const userData = await googleService.getUserData(email);
      
      if (userData.length === 0) {
        return {
          success: false,
          message: language === 'sq' ? 'Nuk u gjend' : 'No data found',
          error: 'NO_DATA_FOUND'
        };
      }

      await googleService.logGDPRRequest({
        email,
        requestType: 'access',
        details: 'Data access request'
      });

      return {
        success: true,
        message: language === 'sq' ? 'Të dhënat u gjeten' : 'Data retrieved',
        data: userData
      };

    } catch (error) {
      console.error('GDPR access error:', error);
      return {
        success: false,
        message: 'Processing error',
        error: 'PROCESSING_ERROR'
      };
    }
  }

  // CHANGE: Updated return type to be consistent
  async processDataDeletion(email: string, language: 'sq' | 'en'): Promise<GDPRServiceResponse> {
    try {
      const userData = await googleService.getUserData(email);
      
      if (userData.length === 0) {
        return {
          success: false,
          message: language === 'sq' ? 'Nuk u gjend' : 'No data found',
          error: 'NO_DATA_FOUND'
        };
      }

      await googleService.logGDPRRequest({
        email,
        requestType: 'delete',
        details: 'Data deletion request'
      });

      const deleteSuccess = await googleService.deleteUserData(email);
      
      if (deleteSuccess) {
        await emailService.sendGDPREmail(email, 'confirmation');
        
        return {
          success: true,
          message: language === 'sq' ? 'Të dhënat u fshinë' : 'Data deleted'
          // CHANGE: No data property needed for deletion
        };
      } else {
        return {
          success: false,
          message: language === 'sq' ? 'Gabim në fshirje' : 'Deletion error',
          error: 'DELETION_ERROR'
        };
      }

    } catch (error) {
      console.error('GDPR deletion error:', error);
      return {
        success: false,
        message: 'Processing error',
        error: 'PROCESSING_ERROR'
      };
    }
  }

  // CHANGE: Updated return type to be consistent
  async processDataExport(email: string, language: 'sq' | 'en'): Promise<GDPRServiceResponse> {
    try {
      const userData = await googleService.getUserData(email);
      
      if (userData.length === 0) {
        return {
          success: false,
          message: language === 'sq' ? 'Nuk u gjend' : 'No data found',
          error: 'NO_DATA_FOUND'
        };
      }

      await googleService.logGDPRRequest({
        email,
        requestType: 'export',
        details: 'Data export request'
      });

      const exportSuccess = await emailService.sendGDPREmail(email, 'data_export', userData);
      
      return {
        success: exportSuccess,
        message: exportSuccess 
          ? (language === 'sq' ? 'Eksporti u dërgua' : 'Export sent')
          : (language === 'sq' ? 'Gabim në dërgim' : 'Send error'),
        error: exportSuccess ? undefined : 'EMAIL_ERROR'
        // CHANGE: No data property needed for export (sent via email)
      };

    } catch (error) {
      console.error('GDPR export error:', error);
      return {
        success: false,
        message: 'Processing error',
        error: 'PROCESSING_ERROR'
      };
    }
  }
}

export const gdprService = new GDPRService();