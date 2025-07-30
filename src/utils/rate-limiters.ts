// src/utils/rate-limiters.ts - Rate limiting utilities
import { RateLimiterMemory } from 'rate-limiter-flexible';

class RateLimiterUtil {
  // Registration rate limiter: 5 requests per 15 minutes per IP
  registrationLimiter = new RateLimiterMemory({
    keyGenerator: (req: any) => this.getClientKey(req),
    points: 5,
    duration: 900, // 15 minutes
  });

  // GDPR rate limiter: 3 requests per hour per IP
  gdprLimiter = new RateLimiterMemory({
    keyGenerator: (req: any) => this.getClientKey(req),
    points: 3,
    duration: 3600, // 1 hour
  });

  private getClientKey(req: any): string {
    return req.headers['x-forwarded-for'] as string || 
           req.headers['x-real-ip'] as string || 
           req.connection.remoteAddress || 
           'unknown';
  }

  async checkRegistrationLimit(req: any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      await this.registrationLimiter.consume(req);
      return { allowed: true };
    } catch (rateLimiterRes) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) 
      };
    }
  }

  async checkGDPRLimit(req: any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      await this.gdprLimiter.consume(req);
      return { allowed: true };
    } catch (rateLimiterRes) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000 / 60) 
      };
    }
  }
}

export const rateLimiters = new RateLimiterUtil();