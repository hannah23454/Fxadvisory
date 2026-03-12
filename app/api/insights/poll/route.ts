import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const POLL_ID = "insights-weekly-poll"

export async function GET() {
  try {
    const db = await getDatabase()
    const poll = await db.collection("polls").findOne({ pollId: POLL_ID })

    const defaultOptions = [
      { id: "aud-usd", label: "AUD weakness against USD", votes: 0 },
      { id: "import-costs", label: "Rising import/export costs", votes: 0 },
      { id: "hedging-strategy", label: "Hedging strategy uncertainty", votes: 0 },
      { id: "interest-rates", label: "Interest rate movements", votes: 0 },
    ]

    return NextResponse.json({
      options: poll?.options ?? defaultOptions,
      total: poll?.total ?? 0,
    })
  } catch {
    return NextResponse.json({
      options: [
        { id: "aud-usd", label: "AUD weakness against USD", votes: 0 },
        { id: "import-costs", label: "Rising import/export costs", votes: 0 },
        { id: "hedging-strategy", label: "Hedging strategy uncertainty", votes: 0 },
        { id: "interest-rates", label: "Interest rate movements", votes: 0 },
      ],
      total: 0,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { optionId } = await req.json()
    if (!optionId) {
      return NextResponse.json({ error: "optionId required" }, { status: 400 })
    }

    const db = await getDatabase()
    const poll = await db.collection("polls").findOne({ pollId: POLL_ID })

    const defaultOptions = [
      { id: "aud-usd", label: "AUD weakness against USD", votes: 0 },
      { id: "import-costs", label: "Rising import/export costs", votes: 0 },
      { id: "hedging-strategy", label: "Hedging strategy uncertainty", votes: 0 },
      { id: "interest-rates", label: "Interest rate movements", votes: 0 },
    ]

    const options: { id: string; label: string; votes: number }[] = poll?.options ?? defaultOptions
    const updatedOptions = options.map((opt) =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    )

    if (!updatedOptions.find((o) => o.id === optionId)) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 })
    }

    const total = updatedOptions.reduce((sum, o) => sum + o.votes, 0)

    await db.collection("polls").updateOne(
      { pollId: POLL_ID },
      { $set: { options: updatedOptions, total, updatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ options: updatedOptions, total })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
