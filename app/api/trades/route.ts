import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { TradeUpload } from '@/lib/types/models';

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

    const trades = await db.collection<TradeUpload>('trade_uploads')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(trades);
  } catch (error) {
    console.error('Get trades error:', error);
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

    const newTrade: Omit<TradeUpload, '_id'> = {
      userId: new ObjectId((session.user as any).id),
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      uploadType: data.uploadType,
      status: 'pending',
      bracketGroupSubmitted: false,
      trades: data.trades || [],
      createdAt: new Date(),
      notes: data.notes,
    };

    const result = await db.collection<TradeUpload>('trade_uploads').insertOne(newTrade as TradeUpload);

    // TODO: Integrate with BracketGroup API
    // For now, simulate submission
    setTimeout(async () => {
      const db = await getDatabase();
      await db.collection('trade_uploads').updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            status: 'completed',
            bracketGroupSubmitted: true,
            submittedAt: new Date()
          } 
        }
      );
    }, 3000);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Create trade error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
