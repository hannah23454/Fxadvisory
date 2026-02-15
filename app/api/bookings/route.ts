import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { BookingRequest } from '@/lib/types/models';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const isAdmin = (session.user as any).role === 'admin';
    
    const query = isAdmin 
      ? {} 
      : { userId: new ObjectId((session.user as any).id) };

    const bookings = await db.collection('bookings')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // If admin, populate user information
    if (isAdmin && bookings.length > 0) {
      const userIds = bookings.map(b => b.userId);
      const users = await db.collection('users')
        .find({ _id: { $in: userIds } })
        .toArray();
      
      const userMap = new Map(users.map(u => [u._id.toString(), u]));
      
      bookings.forEach(booking => {
        const user = userMap.get(booking.userId.toString());
        if (user) {
          (booking as any).userName = user.name;
          (booking as any).userEmail = user.email;
        }
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const db = await getDatabase();

    const newBooking: Omit<BookingRequest, '_id'> = {
      userId: new ObjectId((session.user as any).id),
      type: data.type,
      status: 'pending',
      requestedDate: data.requestedDate ? new Date(data.requestedDate) : undefined,
      notes: data.notes,
      createdAt: new Date(),
    };

    const result = await db.collection<BookingRequest>('bookings').insertOne(newBooking as BookingRequest);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, updates } = await req.json();
    const db = await getDatabase();

    const updateData: any = {};
    
    if (updates.status) {
      updateData.status = updates.status;
    }
    
    if (updates.confirmedDate) {
      updateData.confirmedDate = new Date(updates.confirmedDate);
    }
    
    if (updates.meetingLink) {
      updateData.meetingLink = updates.meetingLink;
    }
    
    if (updates.notes !== undefined) {
      updateData.notes = updates.notes;
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
