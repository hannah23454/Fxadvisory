import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = await getDatabase()
  const userId = new ObjectId((session.user as any).id)

  const user = await db.collection("users").findOne(
    { _id: userId },
    { projection: { password: 0, resetToken: 0, resetTokenExpiry: 0 } }
  )

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json(user)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const db = await getDatabase()
  const userId = new ObjectId((session.user as any).id)

  // Whitelist updatable fields — never allow role/password/email changes via this route
  const allowed = [
    "name", "phone", "position", "experienceLevel", "areasOfInterest",
    "company", "industry", "businessContact", "businessPreferences",
  ]
  const updates: Record<string, any> = { updatedAt: new Date() }
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  await db.collection("users").updateOne({ _id: userId }, { $set: updates })

  return NextResponse.json({ success: true })
}
