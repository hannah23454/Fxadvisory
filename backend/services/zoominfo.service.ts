const ZOOMINFO_API = "https://api.zoominfo.com"

let cachedToken: string | null = null
let tokenExpiry = 0

export async function getZoomInfoToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const clientId     = process.env.ZOOMINFO_CLIENT_ID
  const clientSecret = process.env.ZOOMINFO_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("ZoomInfo not configured — set ZOOMINFO_CLIENT_ID and ZOOMINFO_CLIENT_SECRET in .env.local")
  }

  // OAuth 2.0 Client Credentials via Okta
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const res   = await fetch("https://okta-login.zoominfo.com/oauth2/default/v1/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=api%3Adata%3Acontact%20api%3Adata%3Acompany%20api%3Aaudience%3Aread%20api%3Aaudience%3Amanage%20api%3Aentitlement%3Aread",
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ZoomInfo auth failed: ${err}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  if (!cachedToken) throw new Error("ZoomInfo returned no access_token")
  return cachedToken
}

export interface ZoomContact {
  firstName?: string
  lastName?: string
  emailAddress?: string
  phone?: string
  mobile?: string
  companyName?: string
  jobTitle?: string
  industry?: string
  revenue?: string
  region?: string
}

export function normalizeZoomContact(c: any): ZoomContact {
  const country = c.companyCountry || c["Company Country"] || c.country || ""
  const state   = c.companyState   || c["Company State/Province"] || c.state || ""
  const region  = [country, state].filter(Boolean).join(", ")

  return {
    firstName:    c.firstName    || c["First Name"]    || c.first_name  || "",
    lastName:     c.lastName     || c["Last Name"]     || c.last_name   || "",
    emailAddress: c.emailAddress || c["Email Address"] || c.email       || "",
    phone:        c.phone        || c["Direct Phone"]  || c.directPhone || "",
    mobile:       c.mobilePhone  || c["Mobile Phone"]  || "",
    companyName:  c.companyName  || c["Company Name"]  || c.company     || "",
    jobTitle:     c.jobTitle     || c["Job Title"]     || c.title       || "",
    industry:     c.primaryIndustry || c["Primary Industry"] || c["All Industries"] || "",
    revenue:      c.revenueRange || c["Revenue Range"] || (c["Revenue (in thousands)"] ? `$${(Number(c["Revenue (in thousands)"]) / 1000).toFixed(1)}M` : ""),
    region:       region,
  }
}

export async function fetchContactsFromList(listId: string): Promise<ZoomContact[]> {
  const token = await getZoomInfoToken()

  const res = await fetch(`${ZOOMINFO_API}/search/contact`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      outputFields: ["firstName", "lastName", "emailAddress", "phone", "companyName", "jobTitle"],
      matchPersonInput: [{ listId }],
      rpp: 100,
      page: 1,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ZoomInfo contact fetch failed: ${err}`)
  }

  const data = await res.json()
  const raw: any[] = data.data?.result || data.result || []
  return raw.map(normalizeZoomContact)
}
