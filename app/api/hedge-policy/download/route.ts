import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Verify JWT authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to access the hedge policy.' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const userId = new ObjectId(token.id as string);

    // Verify user has hedge policy access
    const policyRequest = await db.collection('hedge_policy_requests').findOne({
      userId,
      accessGranted: true,
    });

    if (!policyRequest) {
      return NextResponse.json(
        { error: 'You do not have access to the hedge policy. Please request access first.' },
        { status: 403 }
      );
    }

    // Log the access
    await db.collection('analytics').insertOne({
      userId,
      eventType: 'download',
      resourceType: 'document',
      resourceId: 'hedge-policy-download',
      metadata: {
        accessMethod: 'authenticated-route',
      },
      timestamp: new Date(),
    });

    // Update status to accessed
    await db.collection('hedge_policy_requests').updateOne(
      { _id: policyRequest._id },
      {
        $set: {
          status: 'accessed',
          updatedAt: new Date(),
        },
      }
    );

    // Redirect to the secure Google Drive link
    const driveLink = process.env.HEDGE_POLICY_DRIVE_LINK;

    if (!driveLink) {
      return NextResponse.json(
        { error: 'Hedge policy file is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.redirect(driveLink);
  } catch (error) {
    console.error('Hedge policy download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
