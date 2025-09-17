import { NextRequest, NextResponse } from 'next/server';
import { security } from '../../../utils/security';
import { rateLimiters } from '../../../utils/rate-limiters';
import { helpers } from '../../../utils/helpers';
import { validation } from '../../../utils/validation';
import { emailService } from '../../../services/email.service';
import { db } from '../../../utils/db';

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await rateLimiters.checkContactLimit(request);
    if (!rateLimit.allowed) {
      helpers.logInfo('Contact rate limit exceeded', { ip: security.getClientIP(request) });
      return NextResponse.json({
        success: false,
        message: 'Too many contact attempts. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      }, { status: 429 });
    }

    const clientIP = security.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const body = await request.json();

    const validationResult = validation.validateContactForm(body);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        message: validationResult.errors.join(', '),
        error: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (security.isSpamLike(body)) {
      return NextResponse.json({
        success: false,
        message: 'Contact submission rejected',
        error: 'SPAM_DETECTED',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const contactData = {
      ...body,
      userAgent,
      ip: clientIP
    };

    helpers.logInfo('Contact form submission', security.sanitizeForLog(contactData));

    try {
      const result = await db.query(
        `INSERT INTO contact_submissions (
          name, email, phone, subject, message, language,
          ip_address, user_agent, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, created_at`,
        [
          contactData.name,
          contactData.email,
          contactData.phone || null,
          contactData.subject || 'Contact Form Submission',
          contactData.message,
          contactData.language || 'en',
          clientIP,
          userAgent,
          'pending'
        ]
      );

      helpers.logInfo('Contact submission stored in database', { 
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      });

      const emailData = {
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        language: contactData.language
      };

      emailService.sendContactConfirmation(emailData).catch(console.error);
      emailService.sendContactAdminNotification(emailData).catch(console.error);

      const successMessage = contactData.language === 'sq' 
        ? 'Faleminderit për mesazhin tuaj! Do t\'ju përgjigjemi së shpejti.' 
        : 'Thank you for your message! We will get back to you soon.';

      return NextResponse.json({
        success: true,
        message: successMessage,
        timestamp: new Date().toISOString()
      });

    } catch (dbError) {
      console.error('Database storage failed:', dbError);
      helpers.logError('Database storage error', { error: dbError });
      
      return NextResponse.json({
        success: false,
        message: 'Contact submission failed. Please try again.',
        error: 'DATABASE_ERROR',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined;

    helpers.logError('Contact endpoint error', {
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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

