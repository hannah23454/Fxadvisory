import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { UserPreferences } from '@/lib/types/models';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const userId = new ObjectId((session.user as any).id);
    
    let preferences = await db.collection<UserPreferences>('preferences').findOne({
      userId
    });

    // If preferences don't exist, create default ones
    if (!preferences) {
      const defaultPreferences = {
        userId,
        currencies: ['AUD', 'USD', 'EUR'],
        topics: ['market-updates', 'policy-changes'],
        interests: ['hedging', 'forwards'],
        feedLayout: {
          liveRates: true,
          marketNews: true,
          newsletters: true,
          rssFeed: true,
          hedgingDocs: true,
          products: true
        },
        notifications: {
          email: true,
          frequency: 'daily'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection<UserPreferences>('preferences').insertOne(defaultPreferences);
      preferences = defaultPreferences;
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    console.log('Received updates:', JSON.stringify(updates, null, 2));
    
    const db = await getDatabase();
    const userId = new ObjectId((session.user as any).id);

    // Check if preferences exist
    const existingPrefs = await db.collection<UserPreferences>('preferences').findOne({
      userId
    });

    if (!existingPrefs) {
      // Create new preferences if they don't exist
      const newPreferences = {
        userId,
        currencies: updates.currencies || ['AUD', 'USD', 'EUR'],
        topics: updates.topics || [],
        interests: updates.interests || [],
        feedLayout: updates.feedLayout || {
          liveRates: true,
          marketNews: true,
          newsletters: true,
          rssFeed: true,
          hedgingDocs: true,
          products: true
        },
        notifications: updates.notifications || {
          email: true,
          frequency: 'daily'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection<UserPreferences>('preferences').insertOne(newPreferences);
      
      return NextResponse.json({ 
        success: true,
        message: 'Preferences created successfully',
        _id: result.insertedId
      });
    }

    // Update existing preferences
    // Create a clean update object without immutable fields
    const updateFields: any = {};
    
    if (updates.currencies) updateFields.currencies = updates.currencies;
    if (updates.topics) updateFields.topics = updates.topics;
    if (updates.interests) updateFields.interests = updates.interests;
    if (updates.feedLayout) updateFields.feedLayout = updates.feedLayout;
    if (updates.notifications) updateFields.notifications = updates.notifications;
    
    updateFields.updatedAt = new Date();
    
    console.log('Update fields:', JSON.stringify(updateFields, null, 2));
    
    const result = await db.collection<UserPreferences>('preferences').updateOne(
      { userId },
      { $set: updateFields }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Preferences not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
