import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, otpCode, newPassword } = await request.json();

    if (!email || !otpCode || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP code, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get OTP document
    const otpDoc = doc(db, 'password_resets', email);
    const otpSnapshot = await getDoc(otpDoc);

    if (!otpSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    const otpData = otpSnapshot.data();

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt.toDate()) {
      // Delete expired OTP
      await deleteDoc(otpDoc);
      return NextResponse.json(
        { success: false, error: 'Reset code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is already used
    if (otpData.used) {
      return NextResponse.json(
        { success: false, error: 'Reset code has already been used' },
        { status: 400 }
      );
    }

    // Verify OTP code
    if (otpData.otpCode !== otpCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset code' },
        { status: 400 }
      );
    }

    // Find user in the appropriate collection
    const userRole = otpData.userRole;
    const q = query(
      collection(db, userRole),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    const userDocRef = doc(db, userRole, userId);
    await updateDoc(userDocRef, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    // Mark OTP as used
    await updateDoc(otpDoc, {
      used: true,
      usedAt: new Date(),
    });

    // Clean up - delete the OTP document after successful use
    setTimeout(async () => {
      try {
        await deleteDoc(otpDoc);
      } catch (error) {
        console.error('Error cleaning up OTP document:', error);
      }
    }, 5000); // Delete after 5 seconds

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}