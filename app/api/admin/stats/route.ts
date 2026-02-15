import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    // Get real counts from database
    const [
      totalUsers,
      activeUsers,
      totalContent,
      totalTrades,
      unreadMessages,
      pendingMeetings,
      confirmedMeetings,
      completedMeetings,
      cancelledMeetings
    ] = await Promise.all([
      db.collection('users').countDocuments({}),
      db.collection('users').countDocuments({ 
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
      }),
      db.collection('content').countDocuments({ published: true }),
      db.collection('trades').countDocuments({}),
      db.collection('messages').countDocuments({ read: false }),
      db.collection('bookings').countDocuments({ status: 'pending' }),
      db.collection('bookings').countDocuments({ status: 'confirmed' }),
      db.collection('bookings').countDocuments({ status: 'completed' }),
      db.collection('bookings').countDocuments({ status: 'cancelled' })
    ]);

    // Calculate engagement rate
    const engagementRate = totalUsers > 0 
      ? Math.round((activeUsers / totalUsers) * 100) 
      : 0;

    // Get user growth (compare to previous month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const usersLastMonth = await db.collection('users').countDocuments({
      createdAt: { $lt: lastMonth }
    });
    
    const userGrowth = usersLastMonth > 0
      ? Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100)
      : 0;

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalContent,
      totalTrades,
      unreadMessages,
      pendingMeetings,
      confirmedMeetings,
      completedMeetings,
      cancelledMeetings,
      engagementRate,
      userGrowth
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
