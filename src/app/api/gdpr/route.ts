import { NextRequest, NextResponse } from 'next/server';
import { gdprService } from '../../../services/gdpr.service';
import { security } from '../../../utils/security';
import { rateLimiters } from '../../../utils/rate-limiters';
import { validation } from '../../../utils/validation';
import { helpers } from '../../../utils/helpers';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimit = await rateLimiters.checkGDPRLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        message: 'Too many GDPR requests. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      }, { status: 429 });
    }

    // Parse request body
    const body = await request.json();

    // Validate GDPR request data
    const validationResult = validation.validateGDPRRequest(body);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        error: 'VALIDATION_ERROR',
        details: validationResult.errors,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const { email, requestType, details, language = 'sq' } = validationResult.data;

    // Log GDPR request (sanitized)
    helpers.logInfo('GDPR request received', {
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      requestType,
      language
    });

    let result;

    // Handle different GDPR request types
    switch (requestType) {
      case 'access':
        result = await gdprService.processDataAccess(email, language);
        break;
      
      case 'export':
        result = await gdprService.processDataExport(email, language);
        break;
      
      case 'delete':
        result = await gdprService.processDataDeletion(email, language);
        break;
      
      case 'rectify':
        if (!details) {
          return NextResponse.json({
            success: false,
            message: 'Details are required for rectification requests',
            error: 'MISSING_DETAILS',
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }
        result = {
          success: true,
          message: language === 'sq' 
            ? 'Kërkesa për korrigjim u pranua dhe do të përpunohet brenda 30 ditëve.' 
            : 'Rectification request received and will be processed within 30 days.'
        };
        break;
      
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid request type',
          error: 'INVALID_REQUEST_TYPE',
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

    // Set security headers
    const response = NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      timestamp: new Date().toISOString()
    }, { status: result.success ? 200 : 400 });
    
    security.setSecurityHeaders(response);
    return response;

  } catch (error) {
    helpers.logError('GDPR endpoint error', {
      error: security.getErrorMessage(error),
      ip: security.getClientIP(request)
    });

    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}