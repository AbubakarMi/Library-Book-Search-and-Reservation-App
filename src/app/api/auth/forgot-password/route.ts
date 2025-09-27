import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { emailService } from '@/lib/email';

// Generate a random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user exists in any of the collections
    let userFound = false;
    let userName = '';
    let userRole = '';

    const collections = ['students', 'staff', 'admin'];

    for (const collectionName of collections) {
      const q = query(
        collection(db, collectionName),
        where('email', '==', email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        userName = userData.name || userData.username || 'User';
        userRole = collectionName;
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate OTP and expiration time (15 minutes from now)
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP in Firestore
    const otpDoc = doc(db, 'password_resets', email);
    await setDoc(otpDoc, {
      email,
      otpCode,
      expiresAt,
      used: false,
      createdAt: new Date(),
      userRole,
    });

    // Send OTP via email
    const emailResult = await emailService.sendNotificationEmail({
      userName,
      userEmail: email,
      bookTitle: '', // Not needed for password reset
      notificationType: 'password_reset',
      additionalData: {
        resetCode: otpCode,
        libraryName: 'LibroReserva',
      },
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email address',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}