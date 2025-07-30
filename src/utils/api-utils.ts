// src/utils/api-utils.ts - API utility functions
import { APIError } from '../api/client';

/**
 * Handle API errors with user-friendly messages
 */
export function getErrorMessage(error: APIError | Error, language: 'sq' | 'en' = 'sq'): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return language === 'sq' ? 'Të dhënat nuk janë të vlefshme' : 'Invalid data provided';
      case 'RATE_LIMITED':
        return language === 'sq' ? 'Shumë kërkesa. Provo më vonë' : 'Too many requests. Try again later';
      case 'DUPLICATE_EMAIL':
        return language === 'sq' ? 'Email-i është i regjistruar' : 'Email already registered';
      case 'NO_DATA_FOUND':
        return language === 'sq' ? 'Nuk u gjetën të dhëna' : 'No data found';
      case 'NETWORK_ERROR':
        return language === 'sq' ? 'Problem me rrjetin' : 'Network connection problem';
      default:
        return error.message;
    }
  }
  
  return language === 'sq' ? 'Ka ndodhur një gabim' : 'An error occurred';
}

/**
 * Check if error requires user action
 */
export function requiresUserAction(error: APIError): boolean {
  return ['VALIDATION_ERROR', 'DUPLICATE_EMAIL', 'UNAUTHORIZED'].includes(error.code);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: APIError): boolean {
  return ['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'RATE_LIMITED'].includes(error.code) ||
         error.isServerError();
}

/**
 * Format API response data for display
 */
export function formatResponseData(data: any): string {
  if (typeof data === 'string') return data;
  if (typeof data === 'object') return JSON.stringify(data, null, 2);
  return String(data);
}