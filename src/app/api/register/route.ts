// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registrationService } from '../../../services/registration.service';
import { security } from '../../../utils/security';
import { rateLimiters } from '../../../utils/rate-limiters';
import { helpers } from '../../../utils/helpers';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimit = await rateLimiters.checkRegistrationLimit(request);
    if (!rateLimit.allowed) {
      helpers.logInfo('Rate limit exceeded', { ip: security.getClientIP(request) });
      return NextResponse.json({
        success: false,
        message: 'Too many registration attempts. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      }, { status: 429 });
    }

    // Get client information
    const clientIP = security.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Parse request body
    const body = await request.json();

    // Add client info to request data
    const registrationData = {
      ...body,
      userAgent,
      ip: clientIP
    };

    // Log registration attempt (sanitized)
    helpers.logInfo('Registration attempt', security.sanitizeForLog(registrationData));

    // Process registration
    const result = await registrationService.processRegistration(registrationData, clientIP);

    if (result.success) {
      helpers.logInfo('Registration successful', { email: registrationData.email });
      
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } else {
      helpers.logInfo('Registration failed', { 
        email: registrationData.email, 
        error: result.error 
      });
      
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

  } catch (error: unknown) {
    // Log unexpected errors with proper error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined;

    helpers.logError('Registration endpoint error', {
      error: errorMessage,
      stack: errorStack,
      ip: security.getClientIP(request)
    });

    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}