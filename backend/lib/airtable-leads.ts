import type { ZoomContact } from "@/backend/services/zoominfo.service"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const BASE_ID  = process.env.AIRTABLE_LEADS_BASE_ID  || "apppAjhvJzhb2wlHS"
const TABLE_ID = "tblVTjFnKzdXykqkP"

export interface PushResult {
  created: number
  total: number
  errors: string[]
}

function toAirtableRecord(c: ZoomContact) {
  const fields: Record<string, string> = {}

  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ")

  if (c.companyName)  fields["Compnay Name"]           = c.companyName
  if (fullName)       fields["Primary Contact Name"]   = fullName
  if (c.emailAddress) fields["Primary E-mail"]         = c.emailAddress.toLowerCase().trim()
  if (c.phone)        fields["Primary Contact Number"] = c.phone
  // Combine extras into Owner Notes (Region/Industry/Revenue are not plain text in Airtable)
  const noteParts = [
    c.jobTitle  ? `Title: ${c.jobTitle}`       : null,
    c.mobile    ? `Mobile: ${c.mobile}`        : null,
    c.industry  ? `Industry: ${c.industry}`    : null,
    c.revenue   ? `Revenue: ${c.revenue}`      : null,
    c.region    ? `Region: ${c.region}`        : null,
  ].filter(Boolean)
  if (noteParts.length) fields["Owner Notes"] = noteParts.join(" | ")

  return { fields }
}

async function pushBatch(contacts: ZoomContact[]): Promise<{ created: number; error?: string }> {
  const records = contacts.map(toAirtableRecord)
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records }),
  })
  if (!res.ok) return { created: 0, error: await res.text() }
  const data = await res.json()
  return { created: data.records?.length ?? 0 }
}

export async function pushContactsToAirtable(contacts: ZoomContact[]): Promise<PushResult> {
  if (!AIRTABLE_API_KEY) throw new Error("AIRTABLE_API_KEY not set")

  let totalCreated = 0
  const errors: string[] = []

  for (let i = 0; i < contacts.length; i += 10) {
    const batch = contacts.slice(i, i + 10)
    const { created, error } = await pushBatch(batch)
    totalCreated += created
    if (error) errors.push(error)
  }

  return { created: totalCreated, total: contacts.length, errors }
}
