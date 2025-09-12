import { NextRequest, NextResponse } from 'next/server';
import { security } from '../../../utils/security';
import { rateLimiters } from '../../../utils/rate-limiters';
import { helpers } from '../../../utils/helpers';
import { validation } from '../../../utils/validation';
import { emailService } from '../../../services/email.service';
import { db } from '../../../utils/db';

async function getCategoryId(categoryCode: string): Promise<number | null> {
  try {
    const result = await db.query('SELECT id FROM categories WHERE code = $1', [categoryCode]);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error getting category ID:', error);
    return null;
  }
}

async function getLocationId(locationCode: string): Promise<number | null> {
  try {
    const result = await db.query('SELECT id FROM locations WHERE code = $1', [locationCode]);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error getting location ID:', error);
    return null;
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimit = await rateLimiters.checkRegistrationLimit(request);
    if (!rateLimit.allowed) {
      helpers.logInfo('Waitlist rate limit exceeded', { ip: security.getClientIP(request) });
      return NextResponse.json({
        success: false,
        message: 'Too many waitlist attempts. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      }, { status: 429 });
    }

    const clientIP = security.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const body = await request.json();

    const validationResult = validation.validateRegistration(body);
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
        message: 'Waitlist registration rejected',
        error: 'SPAM_DETECTED',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const existingWaitlist = await db.query('SELECT id FROM waitlist WHERE email = $1', [body.email]);
    if (existingWaitlist.rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: body.language === 'sq' ? 'Email është i regjistruar në waitlist' : 'Email already registered in waitlist',
        error: 'DUPLICATE_EMAIL',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const waitlistData = {
      ...body,
      userAgent,
      ip: clientIP
    };

    helpers.logInfo('Waitlist registration attempt', security.sanitizeForLog(waitlistData));

    try {
      const result = await db.query(
        `INSERT INTO waitlist (
          name, email, phone, category_id, location_id, language,
          gdpr_consent, marketing_consent, ip_address, user_agent, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         RETURNING id, created_at`,
        [
          waitlistData.name,
          waitlistData.email,
          waitlistData.phone,
          waitlistData.category ? await getCategoryId(waitlistData.category) : null,
          waitlistData.location ? await getLocationId(waitlistData.location) : null,
          waitlistData.language || 'en',
          waitlistData.gdprConsent || false,
          waitlistData.marketingConsent || false,
          clientIP,
          userAgent,
          'pending'
        ]
      );

      helpers.logInfo('Waitlist registration stored in database', { 
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      });

      const emailData = {
        name: waitlistData.name,
        email: waitlistData.email,
        category: waitlistData.category,
        location: waitlistData.location,
        language: waitlistData.language
      };

      emailService.sendConfirmationEmail(emailData).catch(console.error);
      emailService.sendAdminNotification(emailData).catch(console.error);

      const successMessage = waitlistData.language === 'sq' 
        ? 'U regjistruat me sukses në waitlist! Do t\'ju njoftojmë së shpejti.' 
        : 'Successfully registered in waitlist! We will notify you soon.';

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
        message: 'Registration failed. Please try again.',
        error: 'DATABASE_ERROR',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined;

    helpers.logError('Waitlist endpoint error', {
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
