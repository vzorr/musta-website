// src/utils/rate-limiters.ts - Updated with Contact and Recommend limiters
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

class RateLimiterUtil {
  // Registration rate limiter: 5 requests per 15 minutes per IP
  registrationLimiter = new RateLimiterMemory({
    points: 5,
    duration: 900, // 15 minutes
  });

  // GDPR rate limiter: 3 requests per hour per IP
  gdprLimiter = new RateLimiterMemory({
    points: 3,
    duration: 3600, // 1 hour
  });

  // Contact rate limiter: 5 requests per 10 minutes per IP
  contactLimiter = new RateLimiterMemory({
    points: 5,
    duration: 600, // 10 minutes
  });

  // Recommend rate limiter: 10 requests per hour per IP
  recommendLimiter = new RateLimiterMemory({
    points: 10,
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
      const key = this.getClientKey(req);
      await this.registrationLimiter.consume(key);
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
      const key = this.getClientKey(req);
      await this.gdprLimiter.consume(key);
      return { allowed: true };
    } catch (rateLimiterRes: any) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000 / 60) 
      };
    }
  }

  async checkContactLimit(req: NextRequest | any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const key = this.getClientKey(req);
      await this.contactLimiter.consume(key);
      return { allowed: true };
    } catch (rateLimiterRes: any) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) 
      };
    }
  }

  async checkRecommendLimit(req: NextRequest | any): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const key = this.getClientKey(req);
      await this.recommendLimiter.consume(key);
      return { allowed: true };
    } catch (rateLimiterRes: any) {
      return { 
        allowed: false, 
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) 
      };
    }
  }

  /**
   * Reset rate limit for a specific key (useful for testing)
   */
  async resetLimit(limiterType: 'registration' | 'gdpr' | 'contact' | 'recommend', key: string): Promise<void> {
    let limiter;
    switch (limiterType) {
      case 'registration':
        limiter = this.registrationLimiter;
        break;
      case 'gdpr':
        limiter = this.gdprLimiter;
        break;
      case 'contact':
        limiter = this.contactLimiter;
        break;
      case 'recommend':
        limiter = this.recommendLimiter;
        break;
    }
    await limiter.delete(key);
  }

  /**
   * Get remaining points for a key
   */
  async getRemainingPoints(limiterType: 'registration' | 'gdpr' | 'contact' | 'recommend', req: NextRequest | any): Promise<number> {
    let limiter;
    switch (limiterType) {
      case 'registration':
        limiter = this.registrationLimiter;
        break;
      case 'gdpr':
        limiter = this.gdprLimiter;
        break;
      case 'contact':
        limiter = this.contactLimiter;
        break;
      case 'recommend':
        limiter = this.recommendLimiter;
        break;
    }
    
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