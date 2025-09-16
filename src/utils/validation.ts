// src/utils/validation.ts - Updated with Contact and Recommend validation

import Joi from 'joi';
import { RegistrationData, ContactFormData, RecommendFormData } from '../types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

class ValidationUtil {
  private normalizeFormData(data: any): any {
    const normalized = { ...data };
    
    if (Array.isArray(normalized.category) && normalized.category.length > 0) {
      normalized.category = normalized.category[0];
    }
    if (Array.isArray(normalized.location) && normalized.location.length > 0) {
      normalized.location = normalized.location[0];
    }
    
    return normalized;
  }

  // Existing registration schema
  private registrationSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),
    phone: Joi.string().trim().min(8).max(20).required(),
    category: Joi.alternatives().try(
      Joi.string().valid('plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'woodworker', 'other'),
      Joi.array().items(Joi.string().valid('plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'woodworker', 'other')).min(1).max(1)
    ).required(),
    location: Joi.alternatives().try(
      Joi.string().valid('tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other'),
      Joi.array().items(Joi.string().valid('tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other')).min(1).max(1)
    ).required(),
    language: Joi.string().valid('sq', 'en').required(),
    gdprConsent: Joi.boolean().valid(true).required(),
    marketingConsent: Joi.boolean().optional()
  });

  // Contact form schema
  private contactSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().max(150).required(),
    phone: Joi.string().trim().min(8).max(20).required(),
    subject: Joi.string().trim().min(3).max(200).required(),
    message: Joi.string().trim().min(10).max(1000).required(),
    language: Joi.string().valid('sq', 'en').default('sq')
  });

  // Recommend form schema
  private recommendSchema = Joi.object({
    // Recommender info
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().max(150).allow('').optional(),
    phone: Joi.string().trim().min(8).max(20).required(),
    
    // Usta info (required if isRecommendation is true)
    ustaName: Joi.when('isRecommendation', {
      is: true,
      then: Joi.string().trim().min(2).max(100).required(),
      otherwise: Joi.string().allow('').optional()
    }),
    ustaEmail: Joi.string().email().max(150).allow('').optional(),
    ustaPhone: Joi.when('isRecommendation', {
      is: true,
      then: Joi.string().trim().min(8).max(20).required(),
      otherwise: Joi.string().allow('').optional()
    }),
    
    // Common fields
    category: Joi.alternatives().try(
      Joi.string().valid('plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'woodworker', 'other'),
      Joi.array().items(Joi.string().valid('plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'woodworker', 'other')).min(1).max(1)
    ).required(),
    location: Joi.alternatives().try(
      Joi.string().valid('tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other'),
      Joi.array().items(Joi.string().valid('tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other')).min(1).max(1)
    ).required(),
    language: Joi.string().valid('sq', 'en').default('sq'),
    isRecommendation: Joi.boolean().default(false)
  });

  // Existing GDPR schema
  private gdprRequestSchema = Joi.object({
    email: Joi.string().email().required(),
    requestType: Joi.string().valid('access', 'export', 'delete', 'rectify').required(),
    details: Joi.string().max(500).optional(),
    language: Joi.string().valid('sq', 'en').default('sq')
  });

  // Existing validation methods
  validateRegistration(data: RegistrationData): ValidationResult {
    const normalizedData = this.normalizeFormData(data);
    const { error, value } = this.registrationSchema.validate(normalizedData, { 
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

  // New validation methods
  validateContactForm(data: ContactFormData): ValidationResult {
    const { error, value } = this.contactSchema.validate(data, { 
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

  validateRecommendForm(data: RecommendFormData): ValidationResult {
    const normalizedData = this.normalizeFormData(data);
    const { error, value } = this.recommendSchema.validate(normalizedData, { 
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

  // Utility methods
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    // Basic phone validation - adjust based on your requirements
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
  }

  sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  sanitizeMessage(message: string): string {
    // Allow basic punctuation but remove potential script tags
    return message
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '');
  }
}

export const validation = new ValidationUtil();