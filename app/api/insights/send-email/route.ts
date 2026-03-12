import { NextRequest, NextResponse } from "next/server"
import { sendEmail, buildInsightsEmail } from "@/lib/email"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const BASE_URL = process.env.NEXTAUTH_URL || "https://switchyardfx.com.au"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_NEWSLETTER_BASE_ID || "appTV0Sg1MkDFsrvP"

interface InsightRecord {
  title: string
  summary: string
  category: string
  date: string
  trend: "up" | "down" | "neutral"
}

async function fetchTopInsights(): Promise<InsightRecord[]> {
  if (!AIRTABLE_API_KEY) return []
  try {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/Commentary`)
    url.searchParams.set("filterByFormula", "{Active}=1")
    url.searchParams.set("sort[0][field]", "Date Added")
    url.searchParams.set("sort[0][direction]", "desc")
    url.searchParams.set("maxRecords", "5")

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    })
    if (!res.ok) return []
    const data = await res.json()

    return (data.records || []).map((r: any) => {
      const f = r.fields
      const pairs: string[] = f["Related FX Pairs"] || []
      const body: string = f["Commentary Text"] || ""
      return {
        title: f["Title"] || "",
        summary: f["Summary"]?.value || body.slice(0, 160) + (body.length > 160 ? "..." : ""),
        category: pairs[0] || "Strategy",
        date: f["Date Added"]
          ? new Date(f["Date Added"]).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
          : "",
        trend: ((): "up" | "down" | "neutral" => {
          const combined = ((f["Title"] || "") + " " + body).toLowerCase()
          const up = ["rally","surge","rise","bullish","recovery","gain","positive","upside"].filter(w => combined.includes(w)).length
          const down = ["pressure","weakness","bearish","decline","fall","downside","risk","drop"].filter(w => combined.includes(w)).length
          return up > down ? "up" : down > up ? "down" : "neutral"
        })(),
      }
    })
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { to, name } = await req.json()

    if (!to) {
      return NextResponse.json({ error: "Recipient email required" }, { status: 400 })
    }

    const insights = await fetchTopInsights()

    const html = buildInsightsEmail({
      recipientName: name || to.split("@")[0],
      recipientEmail: to,
      insights,
      fullInsightsUrl: `${BASE_URL}/market-insights/digest`,
    })

    await sendEmail({
      to,
      subject: "Your FX Market Insights — SwitchYard FX",
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Send insights email error:", err)
    return NextResponse.json({ error: err?.message || "Failed to send email" }, { status: 500 })
  }
}
