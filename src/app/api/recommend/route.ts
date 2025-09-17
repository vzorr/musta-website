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
    const rateLimit = await rateLimiters.checkRecommendLimit(request);
    if (!rateLimit.allowed) {
      helpers.logInfo('Recommend rate limit exceeded', { ip: security.getClientIP(request) });
      return NextResponse.json({
        success: false,
        message: 'Too many recommendation attempts. Please try again later.',
        error: 'RATE_LIMITED',
        retryAfter: rateLimit.retryAfter,
        timestamp: new Date().toISOString()
      }, { status: 429 });
    }

    const clientIP = security.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const body = await request.json();

    const validationResult = validation.validateRecommendForm(body);
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
        message: 'Recommendation rejected',
        error: 'SPAM_DETECTED',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const recommendData = {
      ...body,
      userAgent,
      ip: clientIP
    };

    helpers.logInfo('Recommend form submission', security.sanitizeForLog(recommendData));

    try {
      await emailService.sendRecommendConfirmation(recommendData);
      
      await emailService.sendRecommendAdminNotification(recommendData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    try {
      const result = await db.query(
        `INSERT INTO recommendations (
          recommender_name, recommender_email, recommender_phone,
          usta_name, usta_email, usta_phone,
          category_id, location_id, language, is_recommendation,
          ip_address, user_agent, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING id, created_at`,
        [
          recommendData.name,
          recommendData.email || null,
          recommendData.phone,
          recommendData.ustaName || null,
          recommendData.ustaEmail || null,
          recommendData.ustaPhone || null,
          recommendData.category ? await getCategoryId(recommendData.category) : null,
          recommendData.location ? await getLocationId(recommendData.location) : null,
          recommendData.language || 'en',
          recommendData.isRecommendation || false,
          clientIP,
          userAgent,
          'pending'
        ]
      );

      helpers.logInfo('Recommendation stored in database', { 
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      });
    } catch (dbError) {
      console.error('Database storage failed:', dbError);
      helpers.logError('Database storage error', { error: dbError });
    }

    helpers.logInfo('Recommend form processed successfully', { 
      email: recommendData.email || recommendData.recommender_email,
      isRecommendation: recommendData.isRecommendation 
    });

    const successMessage = recommendData.isRecommendation 
      ? (recommendData.language === 'sq' 
          ? 'Rekomandimi u dërgua me sukses! Faleminderit që na ndihmoni të rritemi.' 
          : 'Recommendation sent successfully! Thank you for helping us grow.')
      : (recommendData.language === 'sq' 
          ? 'Të dhënat tuaja u regjistruan me sukses! Do t\'ju njoftojmë së shpejti.'
          : 'Your information was registered successfully! We will notify you soon.');

    return NextResponse.json({
      success: true,
      message: successMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined;

    helpers.logError('Recommend endpoint error', {
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
