import { NextResponse } from "next/server"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_NEWSLETTER_BASE_ID || "appTV0Sg1MkDFsrvP"

// Financial-themed Unsplash images mapped to FX categories
const CATEGORY_IMAGES: Record<string, string> = {
  "AUD/USD": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
  "EUR/USD": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop",
  "GBP/USD": "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=400&fit=crop",
  "EUR/AUD": "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&h=400&fit=crop",
  "GBP/AUD": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
  "NZD/AUD": "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&h=400&fit=crop",
  "USD": "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop",
  "AUD": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  "CAD": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  "default": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
}

function getTrend(title: string, text: string): "up" | "down" | "neutral" {
  const combined = (title + " " + text).toLowerCase()
  const upWords = ["rally", "surge", "rise", "strength", "bullish", "recovery", "opportunity", "break", "gain", "high", "positive", "upside"]
  const downWords = ["pressure", "weakness", "bearish", "decline", "fall", "downside", "risk", "concern", "low", "drop", "sell"]
  const upScore = upWords.filter(w => combined.includes(w)).length
  const downScore = downWords.filter(w => combined.includes(w)).length
  if (upScore > downScore) return "up"
  if (downScore > upScore) return "down"
  return "neutral"
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
}

export async function GET(request: Request) {
  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50")

  try {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/Commentary`)
    url.searchParams.set("filterByFormula", "{Active}=1")
    url.searchParams.set("sort[0][field]", "Date Added")
    url.searchParams.set("sort[0][direction]", "desc")
    url.searchParams.set("maxRecords", String(limit))

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      next: { revalidate: 900 }, // 15 min cache
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Airtable insights error:", err)
      return NextResponse.json({ error: "Failed to fetch from Airtable" }, { status: 502 })
    }

    const data = await res.json()

    const records = data.records.map((r: any, idx: number) => {
      const fields = r.fields
      const pairs: string[] = fields["Related FX Pairs"] || []
      const category = pairs[0] || "Strategy"
      const title: string = fields["Title"] || ""
      const body: string = fields["Commentary Text"] || ""
      const summary: string =
        fields["Summary"]?.value || body.slice(0, 160) + (body.length > 160 ? "..." : "")

      return {
        id: r.id,
        title,
        summary,
        body,
        category,
        date: formatDate(fields["Date Added"]),
        trend: getTrend(title, body),
        image: CATEGORY_IMAGES[category] || CATEGORY_IMAGES["default"],
        featured: idx === 0,
        sources: fields["Content Sources"] || "",
        audience: fields["Suggested Audience Segments"]?.value || "",
      }
    })

    return NextResponse.json(records)
  } catch (err) {
    console.error("Airtable insights fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
