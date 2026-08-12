import { NextRequest, NextResponse } from "next/server"
import { normalizeZoomContact } from "@/backend/services/zoominfo.service"
import { pushContactsToAirtable } from "@/backend/lib/airtable-leads"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// ZoomInfo Automations POSTs here whenever a contact is added to a watched list.
// Set the webhook URL in ZoomInfo → Automations → Action → Send to Webhook → this URL.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ZoomInfo can send a single object or an array under various keys
    const raw: any[] = Array.isArray(body)
      ? body
      : body.contacts || body.data || body.records || [body]

    if (raw.length === 0) {
      return NextResponse.json({ received: 0 })
    }

    const contacts = raw.map(normalizeZoomContact)
    const result   = await pushContactsToAirtable(contacts)

    console.log(`[ZoomInfo webhook] received ${raw.length}, pushed ${result.created} to Airtable`)
    return NextResponse.json({ received: raw.length, created: result.created, errors: result.errors })
  } catch (err: any) {
    console.error("[ZoomInfo webhook] error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
