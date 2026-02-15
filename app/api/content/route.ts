import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { MarketContent } from '@/lib/types/models';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const visibility = searchParams.get('visibility');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = await getDatabase();
    const query: any = {};

    if (type) query.type = type;
    
    // Only show members-only content to authenticated users
    if (!session?.user) {
      query.visibility = 'public';
    } else if (visibility) {
      query.visibility = visibility;
    }

    const content = await db.collection<MarketContent>('market_content')
      .find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const db = await getDatabase();

    const newContent: Omit<MarketContent, '_id'> = {
      ...data,
      author: session.user.name || session.user.email || 'Admin',
      publishedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<MarketContent>('market_content').insertOne(newContent as MarketContent);

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    const db = await getDatabase();

    await db.collection<MarketContent>('market_content').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection<MarketContent>('market_content').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
