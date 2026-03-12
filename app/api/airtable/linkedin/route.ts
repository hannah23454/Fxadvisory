import { NextResponse } from "next/server"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const MICHAEL_BASE = process.env.AIRTABLE_MICHAEL_LINKEDIN_BASE_ID || "app4SgOlC83i1uTAe"
const HANNAH_BASE = process.env.AIRTABLE_HANNAH_LINKEDIN_BASE_ID || "appDn6qM9Py6MaLe4"

interface AirtablePost {
  id: string
  title: string
  caption: string
  imageUrl: string | null
  date: string
  status: string
  person: string
  url: string | null
}

async function fetchPosts(baseId: string, person: string): Promise<AirtablePost[]> {
  if (!AIRTABLE_API_KEY) return []

  const url = new URL(`https://api.airtable.com/v0/${baseId}/Posts`)
  url.searchParams.set("sort[0][field]", "Date Created")
  url.searchParams.set("sort[0][direction]", "desc")
  url.searchParams.set("maxRecords", "20")
  // Show all posts that have a caption (excludes empty drafts)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    next: { revalidate: 1800 }, // 30 min cache
  })

  if (!res.ok) {
    console.error(`LinkedIn fetch failed for ${person}:`, await res.text())
    return []
  }

  const data = await res.json()

  return (data.records || [])
    .filter((r: any) => r.fields["LinkedIn Caption"] || r.fields["Post Title"])
    .map((r: any) => ({
    id: r.id,
    title: r.fields["Post Title"] || "",
    caption: r.fields["LinkedIn Caption"] || "",
    imageUrl: r.fields["Image URL"] || null,
    date: r.fields["Date Created"] || r.createdTime,
    status: r.fields["Status"] || "",
    url: r.fields["LinkedIn URL"] || r.fields["Post URL"] || r.fields["URL"] || r.fields["Link"] || null,
    person,
  }))
}

export async function GET() {
  if (!AIRTABLE_API_KEY) {
    return NextResponse.json({ error: "Airtable not configured" }, { status: 500 })
  }

  try {
    const [michael, hannah] = await Promise.all([
      fetchPosts(MICHAEL_BASE, "Michael"),
      fetchPosts(HANNAH_BASE, "Hannah"),
    ])

    const combined = [...michael, ...hannah].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return NextResponse.json(combined.slice(0, 12))
  } catch (err) {
    console.error("LinkedIn posts fetch error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
