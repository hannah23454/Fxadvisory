import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';
import { User } from '@/lib/types/models';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, company, position, phone } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection<User>('users').findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser: Omit<User, '_id'> = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'user', // Default role
      company,
      position,
      phone,
      active: true,
      createdAt: new Date(),
    };

    const result = await db.collection<User>('users').insertOne(newUser as User);

    // Create default preferences
    await db.collection('preferences').insertOne({
      userId: result.insertedId,
      currencies: ['AUD', 'USD'],
      topics: ['market-updates'],
      interests: [],
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
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
