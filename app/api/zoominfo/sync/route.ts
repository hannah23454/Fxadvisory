import { NextRequest, NextResponse } from "next/server"
import { fetchContactsFromList } from "@/backend/services/zoominfo.service"
import { pushContactsToAirtable } from "@/backend/lib/airtable-leads"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// POST { listId: "xxx" } → fetches all contacts from that ZoomInfo list → pushes to Airtable
export async function POST(req: NextRequest) {
  try {
    const { listId } = await req.json()
    if (!listId) return NextResponse.json({ error: "listId is required" }, { status: 400 })

    const contacts = await fetchContactsFromList(listId)
    if (contacts.length === 0) {
      return NextResponse.json({ message: "No contacts found in that list", created: 0 })
    }

    const result = await pushContactsToAirtable(contacts)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error("[ZoomInfo sync] error:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
