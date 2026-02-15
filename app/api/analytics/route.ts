import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Analytics } from '@/lib/types/models';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const db = await getDatabase();

    const event: Omit<Analytics, '_id'> = {
      userId: new ObjectId((session.user as any).id),
      eventType: data.eventType,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      metadata: data.metadata || {},
      timestamp: new Date(),
    };

    await db.collection<Analytics>('analytics').insertOne(event as Analytics);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Track event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const db = await getDatabase();
    
    // Get most viewed currencies
    const topCurrencies = await db.collection<Analytics>('analytics').aggregate([
      { 
        $match: { 
          resourceType: 'currency',
          timestamp: { $gte: startDate }
        } 
      },
      { $group: { _id: '$resourceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Get most viewed content
    const topContent = await db.collection<Analytics>('analytics').aggregate([
      { 
        $match: { 
          resourceType: 'article',
          timestamp: { $gte: startDate }
        } 
      },
      { $group: { _id: '$resourceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Get engagement trends
    const engagementTrends = await db.collection<Analytics>('analytics').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    return NextResponse.json({
      topCurrencies,
      topContent,
      engagementTrends,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
