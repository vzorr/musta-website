// src/utils/security.ts - Updated for App Router
import { NextRequest, NextResponse } from 'next/server';
import { RegistrationData } from '../types';

class SecurityUtil {
  private spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /\$\$\$|money|cash|prize/i,
    /click here|visit now/i,
    /http[s]?:\/\//,
    /(\w)\1{4,}/, // Repeated characters
  ];

  isSpamLike(data: RegistrationData): boolean {
    const textToCheck = `${data.name} ${data.email}`.toLowerCase();
    return this.spamPatterns.some(pattern => pattern.test(textToCheck));
  }

  getClientIP(req: NextRequest | any): string {
    // Handle NextRequest (App Router)
    if (req instanceof Request || req.headers?.get) {
      return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             'unknown';
    }
    
    // Handle legacy request (Pages Router) - for gradual migration
    return (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
           req.headers?.['x-real-ip'] as string ||
           req.connection?.remoteAddress ||
           'unknown';
  }

  setSecurityHeaders(res: NextResponse): void {
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-XSS-Protection', '1; mode=block');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  // Legacy method for Pages Router compatibility
  setSecurityHeadersLegacy(res: any): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  sanitizeForLog(data: any): any {
    const sanitized = { ...data };
    if (sanitized.email) {
      sanitized.email = sanitized.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    }
    if (sanitized.phone) {
      sanitized.phone = sanitized.phone.replace(/(\d{3})(\d+)(\d{3})/, '$1***$3');
    }
    return sanitized;
  }

  /**
   * Normalize error to string for logging
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    
    return 'Unknown error occurred';
  }

  /**
   * Normalize error to Error object
   */
  normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return new Error(String(error.message));
    }
    
    return new Error('Unknown error occurred');
  }
}

export const security = new SecurityUtil();