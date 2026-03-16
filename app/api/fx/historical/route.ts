import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const API_KEY = "262048aca78c4216915d94215fbc727e"
const ALLOWED = new Set(["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/JPY", "AUD/NZD"])

export async function GET(req: NextRequest) {
  const pair = req.nextUrl.searchParams.get("pair") ?? "AUD/USD"
  const months = parseInt(req.nextUrl.searchParams.get("months") ?? "3", 10)

  if (!ALLOWED.has(pair)) {
    return NextResponse.json({ error: "Invalid pair" }, { status: 400 })
  }

  // 12M → weekly candles (52 pts), 6M → daily (130 pts), 3M → daily (65 pts)
  const interval = months >= 12 ? "1week" : "1day"
  const outputsize = months >= 12 ? 52 : months >= 6 ? 130 : 65

  try {
    const url =
      `https://api.twelvedata.com/time_series` +
      `?symbol=${encodeURIComponent(pair)}` +
      `&interval=${interval}` +
      `&outputsize=${outputsize}` +
      `&apikey=${API_KEY}`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    const json = await res.json()

    if (json.status === "error" || !json.values) {
      return NextResponse.json(
        { error: json.message ?? "Rate data unavailable" },
        { status: 502 }
      )
    }

    // Twelve Data returns newest → oldest; reverse to oldest → newest
    const values: { datetime: string; close: string }[] = [...json.values].reverse()

    return NextResponse.json({
      pair,
      interval,
      dates: values.map((v) => v.datetime),
      rates: values.map((v) => parseFloat(v.close)),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
  }
}
