import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId, Filter } from 'mongodb';
import { Message } from '@/lib/types/models';
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
    const isAdmin = (session.user as any).role === 'admin';

    let messages;
    if (isAdmin) {
      // Admin can see all messages
      messages = await db.collection('messages')
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
    } else {
      // Users can only see their own messages
      messages = await db.collection('messages')
        .find({
          $or: [
            { fromUserId: userId },
            { toUserId: userId }
          ]
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, content, toUserId } = await req.json();
    const db = await getDatabase();

    const newMessage: Omit<Message, '_id'> = {
      fromUserId: new ObjectId((session.user as any).id),
      toUserId: toUserId ? new ObjectId(toUserId) : undefined,
      fromRole: (session.user as any).role,
      subject,
      content,
      read: false,
      createdAt: new Date(),
    };

    const result = await db.collection<Message>('messages').insertOne(newMessage as Message);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    const db = await getDatabase();

    await db.collection<Message>('messages').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark message read error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
