// src/utils/rate-limiters.ts - Rate limiting utilities (Updated for App Router)
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

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

  private getClientKey(req: NextRequest | any): string {
    // Handle NextRequest (App Router)
    if (req instanceof Request || req.headers?.get) {
      return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             req.headers.get('x-real-ip') ||
             req.headers.get('cf-connecting-ip') || // Cloudflare
             'unknown';
    }
    
    // Handle legacy request (Pages Router) - for backward compatibility
    return (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
           req.headers?.['x-real-ip'] as string ||
           req.connection?.remoteAddress ||
           'unknown';
  }

  async checkRegistrationLimit(req: NextRequest | any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      await this.registrationLimiter.consume(req);
      return { allowed: true };
    } catch (rateLimiterRes: any) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) 
      };
    }
  }

  async checkGDPRLimit(req: NextRequest | any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      await this.gdprLimiter.consume(req);
      return { allowed: true };
    } catch (rateLimiterRes: any) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000 / 60) 
      };
    }
  }

  /**
   * Reset rate limit for a specific key (useful for testing)
   */
  async resetLimit(limiterType: 'registration' | 'gdpr', key: string): Promise<void> {
    const limiter = limiterType === 'registration' ? this.registrationLimiter : this.gdprLimiter;
    await limiter.delete(key);
  }

  /**
   * Get remaining points for a key
   */
  async getRemainingPoints(limiterType: 'registration' | 'gdpr', req: NextRequest | any): Promise<number> {
    const limiter = limiterType === 'registration' ? this.registrationLimiter : this.gdprLimiter;
    const key = this.getClientKey(req);
    
    try {
      const result = await limiter.get(key);
      return result ? result.remainingPoints : limiter.points;
    } catch {
      return limiter.points;
    }
  }
}

export const rateLimiters = new RateLimiterUtil();