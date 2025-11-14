import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken } = await request.json();

    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA token missing' },
        { status: 400 }
      );
    }

    const secretKey = '6LfiPAosAAAAAGNZsUBnAaHzocm7YtvnNAi-MQM4';

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    debugger;

    const data = await response.json();
    console.log('reCAPTCHA response:', data); 
    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA validation failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Validation error' },
      { status: 500 }
    );
  }
}