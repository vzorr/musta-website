// 📁 src/pages/api/register.ts - Main registration endpoint
import { NextApiRequest, NextApiResponse } from 'next';
import { registrationService } from '../../services/registration.service';
import { security } from '../../utils/security';
import { rateLimiters } from '../../utils/rate-limiters';
import { helpers } from '../../utils/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      error: 'INVALID_METHOD',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Rate limiting check
    const rateLimit = await rateLimiters.checkRegistrationLimit(req);
    if (!rateLimit.allowed) {
      helpers.logInfo('Rate limit exceeded', { ip: security.getClientIP(req) });
      return res.status(429).json({
        success: false,
        message: 'Too many registration attempts. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      });
    }

    // Set security headers
    security.setSecurityHeaders(res);

    // Get client information
    const clientIP = security.getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Add client info to request data
    const registrationData = {
      ...req.body,
      userAgent,
      ip: clientIP
    };

    // Log registration attempt (sanitized)
    helpers.logInfo('Registration attempt', security.sanitizeForLog(registrationData));

    // Process registration
    const result = await registrationService.processRegistration(registrationData, clientIP);

    if (result.success) {
      helpers.logInfo('Registration successful', { email: registrationData.email });
      
      return res.status(200).json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } else {
      helpers.logInfo('Registration failed', { 
        email: registrationData.email, 
        error: result.error 
      });
      
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    // Log unexpected errors
    helpers.logError('Registration endpoint error', {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      ip: security.getClientIP(req)
    });

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    });
  }
}