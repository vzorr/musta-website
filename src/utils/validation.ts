// src/utils/validation.ts - All validation logic
import Joi from 'joi';
import { RegistrationData } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

class ValidationUtil {
  private registrationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),
    phone: Joi.string().trim().min(8).max(20).required(),
    category: Joi.string().valid('plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'other').required(),
    location: Joi.string().valid('tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other').required(),
    language: Joi.string().valid('sq', 'en').required(),
    gdprConsent: Joi.boolean().valid(true).required(),
    marketingConsent: Joi.boolean().optional()
  });

  private gdprRequestSchema = Joi.object({
    email: Joi.string().email().required(),
    requestType: Joi.string().valid('access', 'export', 'delete', 'rectify').required(),
    details: Joi.string().max(500).optional(),
    language: Joi.string().valid('sq', 'en').default('sq')
  });

  validateRegistration(data: RegistrationData): ValidationResult {
    const { error, value } = this.registrationSchema.validate(data, { 
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return {
        isValid: false,
        errors: error.details.map(detail => detail.message)
      };
    }

    return {
      isValid: true,
      errors: [],
      data: value
    };
  }

  validateGDPRRequest(data: any): ValidationResult {
    const { error, value } = this.gdprRequestSchema.validate(data, { 
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return {
        isValid: false,
        errors: error.details.map(detail => detail.message)
      };
    }

    return {
      isValid: true,
      errors: [],
      data: value
    };
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}

export const validation = new ValidationUtil();