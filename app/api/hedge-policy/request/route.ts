import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDatabase } from '@/lib/mongodb';
import { sendEmail, buildHedgePolicyEmail } from '@/lib/email';
import type { User, HedgePolicyRequest, FxVolumeRange, FxProviderType } from '@/lib/types/models';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const VALID_VOLUMES: FxVolumeRange[] = [
  '<1M', '1M–5M', '5M–10M', '10M–20M', '20M–40M',
  '40M–80M', '80M–150M', '150M–200M', '200M+',
];

const VALID_PROVIDERS: FxProviderType[] = [
  'Non-Bank', 'Bank', 'Both Bank & Non-Bank',
];

export async function POST(req: NextRequest) {
  try {
    const { email, fxVolume, fxProvider } = await req.json();

    // Validate required fields
    if (!email || !fxVolume || !fxProvider) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate FX volume
    if (!VALID_VOLUMES.includes(fxVolume)) {
      return NextResponse.json(
        { error: 'Invalid FX volume selection' },
        { status: 400 }
      );
    }

    // Validate FX provider
    if (!VALID_PROVIDERS.includes(fxProvider)) {
      return NextResponse.json(
        { error: 'Invalid FX provider selection' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date();

    // Check if user exists
    let existingUser = await db.collection<User>('users').findOne({
      email: normalizedEmail,
    });

    let isNewUser = false;
    let passwordSetupUrl: string | undefined;

    if (!existingUser) {
      // Create new user with temporary password
      isNewUser = true;
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Generate password setup token (24hr expiry)
      const setupToken = crypto.randomBytes(32).toString('hex');
      const setupTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const newUser: Omit<User, '_id'> = {
        email: normalizedEmail,
        password: hashedPassword,
        name: normalizedEmail.split('@')[0], // Temporary name from email
        role: 'user',
        active: true,
        createdAt: now,
      };

      const result = await db.collection<User>('users').insertOne(newUser as User);

      // Store setup token on user
      await db.collection('users').updateOne(
        { _id: result.insertedId },
        {
          $set: {
            resetToken: setupToken,
            resetTokenExpiry: setupTokenExpiry,
            source: 'hedge-policy',
          },
        }
      );

      // Create default preferences
      await db.collection('preferences').insertOne({
        userId: result.insertedId,
        currencies: ['AUD', 'USD'],
        topics: ['market-updates', 'hedge-policy'],
        interests: ['hedging'],
        feedLayout: {
          liveRates: true,
          marketNews: true,
          newsletters: true,
          rssFeed: false,
          hedgingDocs: true,
          products: true,
        },
        notifications: {
          email: true,
          frequency: 'weekly',
        },
        updatedAt: now,
      });

      const baseUrl = process.env.NEXTAUTH_URL || 'https://switchyardfx.com.au';
      passwordSetupUrl = `${baseUrl}/reset-password?token=${setupToken}`;

      existingUser = await db.collection<User>('users').findOne({
        _id: result.insertedId,
      });
    } else {
      // Existing user — grant policy access
      await db.collection('users').updateOne(
        { _id: existingUser._id },
        {
          $addToSet: {
            accessGrants: 'hedge-policy',
          } as any,
          $set: {
            updatedAt: now,
          },
        }
      );
    }

    // Store the hedge policy request
    const hedgePolicyRequest: Omit<HedgePolicyRequest, '_id'> = {
      email: normalizedEmail,
      userId: existingUser?._id,
      fxVolume,
      fxProvider,
      status: 'pending',
      emailSent: false,
      accessGranted: true,
      createdAt: now,
      updatedAt: now,
    };

    const requestResult = await db
      .collection<HedgePolicyRequest>('hedge_policy_requests')
      .insertOne(hedgePolicyRequest as HedgePolicyRequest);

    // Send branded email
    try {
      const emailHtml = buildHedgePolicyEmail({
        email: normalizedEmail,
        fxVolume,
        fxProvider,
        passwordSetupUrl,
        isNewUser,
      });

      await sendEmail({
        to: normalizedEmail,
        subject: 'Your FX Hedge Policy Access',
        html: emailHtml,
      });

      // Mark email as sent
      await db.collection('hedge_policy_requests').updateOne(
        { _id: requestResult.insertedId },
        {
          $set: {
            emailSent: true,
            status: 'sent',
            updatedAt: new Date(),
          },
        }
      );
    } catch (emailError) {
      console.error('Failed to send hedge policy email:', emailError);
      // Don't fail the request if email fails — user can still access via dashboard
    }

    // Log analytics event
    if (existingUser?._id) {
      await db.collection('analytics').insertOne({
        userId: existingUser._id,
        eventType: 'download',
        resourceType: 'document',
        resourceId: 'hedge-policy',
        metadata: {
          fxVolume,
          fxProvider,
          isNewUser,
        },
        timestamp: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: isNewUser
        ? 'Account created and hedge policy access granted. Check your email.'
        : 'Hedge policy access granted. Check your email.',
      isNewUser,
    });
  } catch (error) {
    console.error('Hedge policy request error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
