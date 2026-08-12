import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID  = process.env.AIRTABLE_LEADS_BASE_ID || "apppAjhvJzhb2wlHS"
const TABLE_ID = "tblVTjFnKzdXykqkP"

interface LeadRecord {
  name?: string
  email?: string
  company?: string
  phone?: string
  mobile?: string
  title?: string
  industry?: string
  revenue?: string
  region?: string
}

async function pushBatch(records: LeadRecord[]): Promise<{ created: number; errors: string[] }> {
  const airtableRecords = records.map((lead) => {
    const fields: Record<string, string> = {}

    if (lead.company) fields["Compnay Name"]           = lead.company
    if (lead.name)    fields["Primary Contact Name"]   = lead.name
    if (lead.email)   fields["Primary E-mail"]         = lead.email.toLowerCase().trim()
    if (lead.phone)   fields["Primary Contact Number"] = lead.phone
    // Combine extras into Owner Notes (Region/Industry/Revenue are not plain text in Airtable)
    const noteParts = [
      lead.title    ? `Title: ${lead.title}`       : null,
      lead.mobile   ? `Mobile: ${lead.mobile}`     : null,
      lead.industry ? `Industry: ${lead.industry}` : null,
      lead.revenue  ? `Revenue: ${lead.revenue}`   : null,
      lead.region   ? `Region: ${lead.region}`     : null,
    ].filter(Boolean)
    if (noteParts.length) fields["Owner Notes"] = noteParts.join(" | ")

    return { fields }
  })

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: airtableRecords }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("Airtable bulk POST error:", err)
    return { created: 0, errors: [err] }
  }

  const data = await res.json()
  return { created: data.records?.length ?? 0, errors: [] }
}

export async function POST(req: NextRequest) {
  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 })
  }

  try {
    const { records }: { records: LeadRecord[] } = await req.json()

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 })
    }

    const valid = records.filter((r) => r.email || r.company || r.name)

    let totalCreated = 0
    const allErrors: string[] = []

    for (let i = 0; i < valid.length; i += 10) {
      const batch = valid.slice(i, i + 10)
      const { created, errors } = await pushBatch(batch)
      totalCreated += created
      allErrors.push(...errors)
    }

    return NextResponse.json({
      success: true,
      created: totalCreated,
      total: valid.length,
      errors: allErrors,
    })
  } catch (err) {
    console.error("Bulk leads import error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
