import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/database/mongodb'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const db = await getDatabase()
    const doc = await db.collection('site_settings').findOne({ key: 'site_text' })
    const data = doc?.data ?? null
    return NextResponse.json(
      { ok: true, data: data ?? {} },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    )
  } catch (err) {
    console.error('site-settings GET error:', err)
    return NextResponse.json(
      { ok: false, data: {}, error: String(err) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const db = await getDatabase()

    const result = await db.collection('site_settings').updateOne(
      { key: 'site_text' },
      { $set: { key: 'site_text', data, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      matched: result.matchedCount,
      upserted: result.upsertedCount,
    })
  } catch (err) {
    console.error('site-settings PUT error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
