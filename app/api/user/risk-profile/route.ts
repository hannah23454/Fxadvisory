import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const RISK_BANDS = ["Very Conservative", "Conservative", "Balanced", "Growth", "Aggressive"] as const
type RiskBand = (typeof RISK_BANDS)[number]

function calcBand(capacityScore: number, willingnessScore: number): RiskBand {
  const combined = (capacityScore + willingnessScore) / 2
  if (combined < 1.8) return "Very Conservative"
  if (combined < 2.6) return "Conservative"
  if (combined < 3.4) return "Balanced"
  if (combined < 4.2) return "Growth"
  return "Aggressive"
}

function avg(arr: number[]): number {
  if (!arr.length) return 0
  return arr.reduce((s, n) => s + n, 0) / arr.length
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const db = await getDatabase()
  const userId = new ObjectId((session.user as any).id)

  const profile = await db.collection("risk_profiles").findOne({ userId })
  return NextResponse.json(profile || null)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { capacityAnswers, willingnessAnswers } = await req.json()

  if (
    !Array.isArray(capacityAnswers) || capacityAnswers.length !== 4 ||
    !Array.isArray(willingnessAnswers) || willingnessAnswers.length !== 4
  ) {
    return NextResponse.json({ error: "Must provide 4 capacity and 4 willingness answers (1–5 each)" }, { status: 400 })
  }

  const capacityScore = avg(capacityAnswers)
  const willingnessScore = avg(willingnessAnswers)
  const band = calcBand(capacityScore, willingnessScore)

  const db = await getDatabase()
  const userId = new ObjectId((session.user as any).id)

  const doc = {
    userId,
    capacityAnswers,
    willingnessAnswers,
    capacityScore: parseFloat(capacityScore.toFixed(2)),
    willingnessScore: parseFloat(willingnessScore.toFixed(2)),
    band,
    updatedAt: new Date(),
  }

  await db.collection("risk_profiles").updateOne(
    { userId },
    { $set: doc, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )

  // Sync to Airtable (non-blocking)
  try {
    const key = process.env.AIRTABLE_API_KEY
    const base = process.env.AIRTABLE_LEADS_BASE_ID || process.env.AIRTABLE_NEWSLETTER_BASE_ID
    if (key && base) {
      const user = await db.collection("users").findOne(
        { _id: userId },
        { projection: { name: 1, email: 1, company: 1 } }
      )
      await fetch(`https://api.airtable.com/v0/${base}/Risk%20Profiles`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            Name: user?.name || "",
            Email: user?.email || "",
            Company: user?.company || "",
            "Risk Band": band,
            "Capacity Score": doc.capacityScore,
            "Willingness Score": doc.willingnessScore,
            "C1 FX Volume": capacityAnswers[0],
            "C2 Revenue Exposure": capacityAnswers[1],
            "C3 Sustain Adverse Move": capacityAnswers[2],
            "C4 Hedging Coverage": capacityAnswers[3],
            "W1 Comfort with Fluctuations": willingnessAnswers[0],
            "W2 Certainty vs Upside": willingnessAnswers[1],
            "W3 Reaction to Losses": willingnessAnswers[2],
            "W4 Primary Objective": willingnessAnswers[3],
          },
        }),
      })
    }
  } catch (err) {
    console.error("Airtable risk profile sync error:", err)
  }

  return NextResponse.json({ success: true, band, capacityScore: doc.capacityScore, willingnessScore: doc.willingnessScore })
}
