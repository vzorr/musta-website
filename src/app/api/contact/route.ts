// src/app/api/contact/route.ts - Contact form API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject, language } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name, email, and message are required' 
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email address' 
        },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'Unknown';

    // Prepare contact data
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      subject: subject?.trim() || 'Contact Form Submission',
      language: language || 'en',
      timestamp: new Date().toISOString(),
      userAgent,
      ip
    };

    // Log the contact submission (in production, you'd save to database or send email)
    console.log('Contact form submission:', contactData);

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    // 4. Integrate with CRM system

    // For now, we'll just return success
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! We will get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request' 
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
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
