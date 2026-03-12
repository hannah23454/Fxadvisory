import { NextRequest, NextResponse } from "next/server"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_NEWSLETTER_BASE_ID || "appTV0Sg1MkDFsrvP"

const CATEGORY_IMAGES: Record<string, string> = {
  "AUD/USD": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
  "EUR/USD": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop",
  "GBP/USD": "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1200&h=600&fit=crop",
  "EUR/AUD": "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&h=600&fit=crop",
  "GBP/AUD": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=600&fit=crop",
  "NZD/AUD": "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&h=600&fit=crop",
  "USD": "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=600&fit=crop",
  "AUD": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
  "CAD": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
  "default": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
}

function getTrend(title: string, text: string): "up" | "down" | "neutral" {
  const combined = (title + " " + text).toLowerCase()
  const up = ["rally","surge","rise","bullish","recovery","gain","positive","upside"].filter(w => combined.includes(w)).length
  const down = ["pressure","weakness","bearish","decline","fall","downside","risk","drop"].filter(w => combined.includes(w)).length
  return up > down ? "up" : down > up ? "down" : "neutral"
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 })
  }

  const { id } = await params

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Commentary/${encodeURIComponent(id)}`,
      {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
        next: { revalidate: 900 },
      }
    )

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Failed to fetch insight" }, { status: 502 })
    }

    const r = await res.json()
    const f = r.fields
    const pairs: string[] = f["Related FX Pairs"] || []
    const category = pairs[0] || "Strategy"
    const title: string = f["Title"] || ""
    const body: string = f["Commentary Text"] || ""
    const summary: string = f["Summary"]?.value || body.slice(0, 160) + (body.length > 160 ? "..." : "")

    return NextResponse.json({
      id: r.id,
      title,
      summary,
      body,
      category,
      date: formatDate(f["Date Added"]),
      trend: getTrend(title, body),
      image: CATEGORY_IMAGES[category] || CATEGORY_IMAGES["default"],
      sources: f["Content Sources"] || "",
      audience: f["Suggested Audience Segments"]?.value || "",
      pairs,
    })
  } catch (err) {
    console.error("Single insight fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
