import { NextRequest, NextResponse } from "next/server"
import { getZoomInfoToken, normalizeZoomContact } from "@/backend/services/zoominfo.service"
import { pushContactsToAirtable } from "@/backend/lib/airtable-leads"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Extracts company ID from a ZoomInfo URL or plain ID string
function extractCompanyId(input: string): string {
  const match = input.match(/company-profile\/(\d+)/)
  return match ? match[1] : input.trim()
}

// Fetch all contacts at a company using ZoomInfo API
async function fetchContactsByCompany(companyId: string) {
  const token = await getZoomInfoToken()

  const res = await fetch("https://api.zoominfo.com/search/contact", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      outputFields: [
        "firstName", "lastName", "emailAddress", "phone",
        "mobilePhone", "companyName", "jobTitle",
        "primaryIndustry", "companyCountry", "companyState",
      ],
      matchCompanyInput: [{ companyId }],
      rpp: 100,
      page: 1,
    }),
  })

  if (!res.ok) throw new Error(`ZoomInfo API error: ${await res.text()}`)
  const data = await res.json()
  return (data.data?.result || data.result || []).map(normalizeZoomContact)
}

// POST { input: "ZoomInfo URL or company ID", pushToAirtable: true/false }
export async function POST(req: NextRequest) {
  try {
    const { input, pushToAirtable } = await req.json()
    if (!input) return NextResponse.json({ error: "Company URL or ID required" }, { status: 400 })

    const companyId = extractCompanyId(input)
    const contacts  = await fetchContactsByCompany(companyId)

    if (!pushToAirtable) {
      return NextResponse.json({ contacts, total: contacts.length })
    }

    const result = await pushContactsToAirtable(contacts)
    return NextResponse.json({ ...result, contacts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
