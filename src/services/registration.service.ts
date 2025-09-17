// src/services/registration.service.ts - Business logic for registration
import { RegistrationData } from '../types';
import { validation } from '../utils/validation';
import { security } from '../utils/security';
import { googleService } from './google.service';
import { emailService } from './email.service';

class RegistrationService {
  async processRegistration(data: RegistrationData, clientIP: string): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    try {
      // Validate data
      const validationResult = validation.validateRegistration(data);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.errors.join(', '),
          error: 'VALIDATION_ERROR'
        };
      }

      // Security checks
      if (security.isSpamLike(data)) {
        return {
          success: false,
          message: 'Registration rejected',
          error: 'SPAM_DETECTED'
        };
      }

      // Check for duplicate
      const existingUser = await googleService.getUserData(data.email);
      if (existingUser.length > 0) {
        return {
          success: false,
          message: data.language === 'sq' ? 'Email është i regjistruar' : 'Email already registered',
          error: 'DUPLICATE_EMAIL'
        };
      }

      // Add to sheets
      const sheetData = {
        ...data,
        ip: clientIP,
        userAgent: data.userAgent || 'Unknown'
      };

      const sheetSuccess = await googleService.addRegistration(sheetData);
      if (!sheetSuccess) {
        return {
          success: false,
          message: 'Registration failed',
          error: 'STORAGE_ERROR'
        };
      }

      // Send emails (non-blocking)
      const emailData = {
        name: data.name,
        email: data.email,
        category: data.category,
        location: data.location,
        language: data.language
      };

      emailService.sendConfirmationEmail(emailData).catch(console.error);
      emailService.sendAdminNotification(emailData).catch(console.error);

      return {
        success: true,
        message: data.language === 'sq' 
          ? 'Regjistrimi u krye me sukses' 
          : 'Registration successful'
      };

    } catch (error) {
      console.error('Registration service error:', error);
      return {
        success: false,
        message: 'Internal error',
        error: 'INTERNAL_ERROR'
      };
    }
  }
}

export const registrationService = new RegistrationService();