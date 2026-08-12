import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const clientId     = process.env.ZOOMINFO_CLIENT_ID     || ""
  const clientSecret = process.env.ZOOMINFO_CLIENT_SECRET || ""

  const results: Record<string, any> = {}

  // Step 1 — get Okta token
  let freshToken: string | null = null
  try {
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const r = await fetch("https://okta-login.zoominfo.com/oauth2/default/v1/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=api%3Adata%3Acontact%20api%3Adata%3Acompany%20api%3Aaudience%3Aread%20api%3Aaudience%3Amanage%20api%3Aentitlement%3Aread",
    })
    const data = await r.json()
    freshToken = data.access_token || null
    results["okta_token"] = { status: r.status, has_token: !!freshToken, expires_in: data.expires_in }
  } catch (e: any) { results["okta_token"] = { error: e.message } }

  // Step 2 — use fresh token to search contacts
  if (freshToken) {
    try {
      const r = await fetch("https://api.zoominfo.com/search/contact", {
        method: "POST",
        headers: { Authorization: `Bearer ${freshToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          outputFields: ["firstName", "lastName", "emailAddress", "companyName"],
          matchPersonInput: [{ companyName: "Apple" }],
          rpp: 2, page: 1,
        }),
      })
      const body = await r.text()
      results["search_contact"] = { status: r.status, body: body.slice(0, 500) }
    } catch (e: any) { results["search_contact"] = { error: e.message } }

    // Step 3 — use fresh token to search by company ID (PowerGEM)
    try {
      const r = await fetch("https://api.zoominfo.com/search/contact", {
        method: "POST",
        headers: { Authorization: `Bearer ${freshToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          outputFields: ["firstName", "lastName", "emailAddress", "companyName", "jobTitle"],
          matchCompanyInput: [{ companyId: "345667062" }],
          rpp: 3, page: 1,
        }),
      })
      const body = await r.text()
      results["search_by_company_id"] = { status: r.status, body: body.slice(0, 500) }
    } catch (e: any) { results["search_by_company_id"] = { error: e.message } }
  }

  return NextResponse.json(results)
}
