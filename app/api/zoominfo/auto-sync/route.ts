import { NextRequest, NextResponse } from "next/server"
import { fetchContactsFromList } from "@/backend/services/zoominfo.service"
import { pushContactsToAirtable } from "@/backend/lib/airtable-leads"
import { getSyncConfig, recordSyncResult } from "@/backend/lib/sync-state"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// Called by the background cron script on the configured interval.
// Also callable manually from the admin panel.
export async function POST(req: NextRequest) {
  try {
    const config = await getSyncConfig()

    if (!config.listId) {
      return NextResponse.json({ error: "No ZoomInfo list configured" }, { status: 400 })
    }

    const contacts = await fetchContactsFromList(config.listId)

    if (contacts.length === 0) {
      await recordSyncResult(0, null)
      return NextResponse.json({ created: 0, total: 0, message: "No contacts found" })
    }

    const result = await pushContactsToAirtable(contacts)
    await recordSyncResult(result.created, result.errors[0] ?? null)

    return NextResponse.json(result)
  } catch (err: any) {
    await recordSyncResult(0, err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const config = await getSyncConfig()
  return NextResponse.json(config)
}
