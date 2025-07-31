// 📁 src/pages/api/gdpr/request.ts - GDPR endpoint (optional)
import { NextApiRequest, NextApiResponse } from 'next';
import { gdprService } from '../../../services/gdpr.service';
import { security } from '../../../utils/security';
import { rateLimiters } from '../../../utils/rate-limiters';
import { validation } from '../../../utils/validation';
import { helpers } from '../../../utils/helpers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'INVALID_METHOD',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Rate limiting for GDPR requests
    const rateLimit = await rateLimiters.checkGDPRLimit(req);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Too many GDPR requests. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      });
    }

    // Security headers
    security.setSecurityHeaders(res);

    // Validate GDPR request data
    const validationResult = validation.validateGDPRRequest(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: 'VALIDATION_ERROR',
        details: validationResult.errors,
        timestamp: new Date().toISOString()
      });
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
          return res.status(400).json({
            success: false,
            message: 'Details are required for rectification requests',
            error: 'MISSING_DETAILS',
            timestamp: new Date().toISOString()
          });
        }
        result = {
          success: true,
          message: language === 'sq' 
            ? 'Kërkesa për korrigjim u pranua dhe do të përpunohet brenda 30 ditëve.' 
            : 'Rectification request received and will be processed within 30 days.'
        };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid request type',
          error: 'INVALID_REQUEST_TYPE',
          timestamp: new Date().toISOString()
        });
    }

    // Return result
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    helpers.logError('GDPR endpoint error', {
      error: error.message,
      ip: security.getClientIP(req)
    });

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    });
  }
}