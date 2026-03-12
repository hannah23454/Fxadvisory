import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID = process.env.AIRTABLE_LEADS_BASE_ID || process.env.AIRTABLE_NEWSLETTER_BASE_ID || "appTV0Sg1MkDFsrvP"
const TABLE = "Leads"

export async function POST(req: NextRequest) {
  if (!AIRTABLE_API_KEY) {
    console.error("AIRTABLE_API_KEY not set")
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { name, email, company, source, requestType, notes } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const fields: Record<string, string> = {
      Email: email.toLowerCase().trim(),
      Source: source || "Website",
      Status: "New",
    }

    if (name) fields["Name"] = name
    if (company) fields["Company"] = company
    if (requestType) fields["Request Type"] = requestType
    if (notes) fields["Notes"] = notes

    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Airtable leads POST error:", err)
      // Don't surface Airtable errors to the client — still return success
      // so form submission isn't blocked by Airtable config
      return NextResponse.json({ success: true, warning: "Airtable write failed" })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, id: data.id }, { status: 201 })
  } catch (err) {
    console.error("Airtable leads route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
