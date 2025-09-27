import { NextRequest, NextResponse } from 'next/server';
import { emailService, NotificationEmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body: NotificationEmailData = await request.json();

    // Validate required fields
    if (!body.userName || !body.userEmail || !body.notificationType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.userEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await emailService.sendNotificationEmail(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: result.data
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}