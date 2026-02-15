import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });

    // Always return success to prevent email enumeration
    // This is a security best practice
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: 'If an account exists, a reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    await db.collection('users').updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date()
        }
      }
    );

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // In production, you would send an email here
    // For now, we'll log it to console
    console.log('Password reset link:', resetUrl);
    console.log('Email would be sent to:', email);

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // Example:
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   html: `Click here to reset your password: ${resetUrl}`
    // });

    return NextResponse.json({ 
      success: true,
      message: 'Password reset link sent to your email',
      // Remove this in production - only for development
      devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
