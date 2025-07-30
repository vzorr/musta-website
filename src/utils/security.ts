// src/utils/security.ts - Security utilities
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

  getClientIP(req: any): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
           req.headers['x-real-ip'] as string ||
           req.connection.remoteAddress ||
           'unknown';
  }

  setSecurityHeaders(res: any): void {
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
}

export const security = new SecurityUtil();