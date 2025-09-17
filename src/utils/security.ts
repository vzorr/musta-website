// src/utils/security.ts - Updated with Contact and Recommend spam detection
import { NextRequest, NextResponse } from 'next/server';
import { RegistrationData, ContactFormData, RecommendFormData } from '../types';

class SecurityUtil {
  private spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /\$\$\$|money|cash|prize/i,
    /click here|visit now/i,
    /http[s]?:\/\//,
    /(\w)\1{4,}/, // Repeated characters
  ];

  private suspiciousEmailDomains = [
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'throwaway.email'
  ];

  isSpamLike(data: RegistrationData): boolean {
    const textToCheck = `${data.name} ${data.email}`.toLowerCase();
    return this.spamPatterns.some(pattern => pattern.test(textToCheck));
  }

  isSpamLikeContact(data: ContactFormData): boolean {
    const textToCheck = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase();
    
    // Check for spam patterns
    if (this.spamPatterns.some(pattern => pattern.test(textToCheck))) {
      return true;
    }
    
    // Check for suspicious email domains
    const emailDomain = data.email.split('@')[1]?.toLowerCase();
    if (emailDomain && this.suspiciousEmailDomains.includes(emailDomain)) {
      return true;
    }
    
    // Check for excessive URLs in message
    const urlCount = (data.message.match(/http[s]?:\/\//g) || []).length;
    if (urlCount > 2) {
      return true;
    }
    
    return false;
  }

  isSpamLikeRecommend(data: RecommendFormData): boolean {
    const textToCheck = `${data.name} ${data.email || ''} ${data.ustaName || ''} ${data.ustaEmail || ''}`.toLowerCase();
    
    // Check for spam patterns
    if (this.spamPatterns.some(pattern => pattern.test(textToCheck))) {
      return true;
    }
    
    // Check if recommender and usta info are suspiciously similar
    if (data.isRecommendation && data.ustaName) {
      if (data.name === data.ustaName && data.phone === data.ustaPhone) {
        return true; // Self-recommendation detected
      }
    }
    
    // Check for suspicious email domains
    if (data.email) {
      const emailDomain = data.email.split('@')[1]?.toLowerCase();
      if (emailDomain && this.suspiciousEmailDomains.includes(emailDomain)) {
        return true;
      }
    }
    
    return false;
  }

  getClientIP(req: NextRequest | any): string {
    if (req instanceof Request || req.headers?.get) {
      return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             req.headers.get('cf-connecting-ip') || // Cloudflare
             'unknown';
    }
    
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
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  }

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
    if (sanitized.ustaEmail) {
      sanitized.ustaEmail = sanitized.ustaEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    }
    if (sanitized.ustaPhone) {
      sanitized.ustaPhone = sanitized.ustaPhone.replace(/(\d{3})(\d+)(\d{3})/, '$1***$3');
    }
    return sanitized;
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      return false;
    }
    
    if (/^(\d)\1+$/.test(digitsOnly)) {
      return false;
    }
    
    if (/^1234567890/.test(digitsOnly) || /^0123456789/.test(digitsOnly)) {
      return false;
    }
    
    return true;
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

  /**
   * Generate a secure referral code
   */
  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'UST-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const security = new SecurityUtil();