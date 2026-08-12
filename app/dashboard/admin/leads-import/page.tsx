"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Upload, Trash2, Send, FileText, CheckCircle,
  AlertCircle, Loader2, Zap, Link2, RefreshCw,
  Settings, Clock, ToggleLeft, ToggleRight, Play,
  Building2,
} from "lucide-react"

interface Lead {
  name: string
  email: string
  company: string
  phone: string
  mobile: string
  title: string
  industry: string
  revenue: string
  country: string
  state: string
}

const COLUMN_MAP: Record<string, keyof Lead> = {
  "first name":                 "name",
  "last name":                  "name",
  "full name":                  "name",
  "name":                       "name",
  "contact name":               "name",
  "email address":              "email",
  "email":                      "email",
  "work email":                 "email",
  "company name":               "company",
  "company":                    "company",
  "account name":               "company",
  "organization":               "company",
  "phone number":               "phone",
  "direct phone":               "phone",
  "phone":                      "phone",
  "mobile phone":               "mobile",
  "title":                      "title",
  "job title":                  "title",
  "position":                   "title",
  "role":                       "title",
  "primary industry":           "industry",
  "all industries":             "industry",
  "industry":                   "industry",
  "revenue range":              "revenue",
  "revenue (in thousands)":     "revenue",
  "company country":            "country",
  "country":                    "country",
  "company state/province":     "state",
  "company state":              "state",
  "state":                      "state",
}

function parseCSV(text: string): Lead[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase())
  const firstNameIdx = headers.findIndex((h) => h === "first name")
  const lastNameIdx  = headers.findIndex((h) => h === "last name")
  const leads: Lead[] = []
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i]
    if (!raw.trim()) continue
    const cols: string[] = []
    let cur = ""; let inQuote = false
    for (const ch of raw) {
      if (ch === '"') { inQuote = !inQuote }
      else if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = "" }
      else { cur += ch }
    }
    cols.push(cur.trim())
    const get = (idx: number) => (cols[idx] ?? "").replace(/^"|"$/g, "").trim()
    const lead: Lead = { name: "", email: "", company: "", phone: "", mobile: "", title: "", industry: "", revenue: "", country: "", state: "" }
    if (firstNameIdx >= 0 && lastNameIdx >= 0) {
      lead.name = [get(firstNameIdx), get(lastNameIdx)].filter(Boolean).join(" ")
    }
    headers.forEach((header, idx) => {
      const field = COLUMN_MAP[header]
      if (!field) return
      if (field === "name" && lead.name) return
      const val = get(idx)
      if (!val) return
      // Revenue in thousands → convert to readable format
      if (header === "revenue (in thousands)") {
        const num = Number(val)
        lead.revenue = lead.revenue || (isNaN(num) ? val : `$${(num / 1000).toFixed(1)}M`)
      } else {
        lead[field] = val
      }
    })
    if (lead.name || lead.email || lead.company) leads.push(lead)
  }
  return leads
}

type Tab = "auto" | "company" | "zoominfo" | "csv"

interface SyncConfig {
  enabled: boolean
  listId: string
  listName: string
  intervalMinutes: number
  lastSyncAt: string | null
  lastSyncCount: number
  lastSyncError: string | null
}

export default function LeadsImportPage() {
  const [tab, setTab]       = useState<Tab>("auto")
  const [leads, setLeads]   = useState<Lead[]>([])
  const [listId, setListId] = useState("")
  const [pushing, setPushing] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ created: number; total: number; errors: string[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Company lookup state
  const [companyInput, setCompanyInput]     = useState("")
  const [companyContacts, setCompanyContacts] = useState<any[]>([])
  const [companyLoading, setCompanyLoading] = useState(false)
  const [companyPushing, setCompanyPushing] = useState(false)

  const lookupCompany = async () => {
    if (!companyInput.trim()) return
    setCompanyLoading(true); setCompanyContacts([])
    try {
      const res  = await fetch("/api/zoominfo/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: companyInput, pushToAirtable: false }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      setCompanyContacts(data.contacts || [])
      if (data.contacts?.length === 0) toast.info("No contacts found for this company")
      else toast.success(`Found ${data.contacts.length} contacts`)
    } catch { toast.error("Lookup failed") }
    finally { setCompanyLoading(false) }
  }

  const pushCompanyContacts = async () => {
    if (!companyInput.trim()) return
    setCompanyPushing(true)
    try {
      const res  = await fetch("/api/zoominfo/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: companyInput, pushToAirtable: true }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      toast.success(`${data.created} contacts pushed to Airtable`)
      setCompanyContacts([]); setCompanyInput("")
    } catch { toast.error("Push failed") }
    finally { setCompanyPushing(false) }
  }

  const [syncConfig, setSyncConfig] = useState<SyncConfig>({
    enabled: false, listId: "", listName: "", intervalMinutes: 60,
    lastSyncAt: null, lastSyncCount: 0, lastSyncError: null,
  })

  useEffect(() => {
    fetch("/api/zoominfo/config").then(r => r.json()).then(setSyncConfig).catch(() => {})
  }, [])

  const saveConfig = async (patch: Partial<SyncConfig>) => {
    const updated = { ...syncConfig, ...patch }
    setSyncConfig(updated)
    await fetch("/api/zoominfo/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
    toast.success("Auto-sync settings saved")
  }

  const runNow = async () => {
    setRunning(true)
    try {
      const res  = await fetch("/api/zoominfo/auto-sync", { method: "POST" })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      toast.success(`Sync complete — ${data.created} contacts pushed to Airtable`)
      fetch("/api/zoominfo/config").then(r => r.json()).then(setSyncConfig)
    } catch { toast.error("Sync failed") }
    finally { setRunning(false) }
  }

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/zoominfo/webhook`
    : "/api/zoominfo/webhook"

  // ── ZoomInfo live sync ──────────────────────────────────────────
  const syncList = async () => {
    if (!listId.trim()) { toast.error("Enter a ZoomInfo List ID"); return }
    setSyncing(true); setResult(null)
    try {
      const res  = await fetch("/api/zoominfo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId: listId.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Sync failed"); return }
      setResult(data)
      toast.success(`${data.created} contacts synced to Airtable`)
    } catch { toast.error("Network error") }
    finally { setSyncing(false) }
  }

  // ── CSV upload ──────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) { toast.error("Please upload a CSV file"); return }
    const reader = new FileReader()
    reader.onload = (e) => {
      const parsed = parseCSV(e.target?.result as string)
      if (parsed.length === 0) { toast.error("No leads found — check column names"); return }
      setLeads(parsed); setResult(null)
      toast.success(`${parsed.length} leads loaded`)
    }
    reader.readAsText(file)
  }

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }

  const removeRow = (idx: number) => setLeads((p) => p.filter((_, i) => i !== idx))

  const pushCSV = async () => {
    if (leads.length === 0) return
    setPushing(true); setResult(null)
    try {
      const res  = await fetch("/api/airtable/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          records: leads.map((l) => ({
            ...l,
            region: [l.country, l.state].filter(Boolean).join(", "),
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Push failed"); return }
      setResult(data)
      if (data.errors?.length === 0) { toast.success(`${data.created} leads pushed to Airtable`); setLeads([]) }
      else toast.warning(`${data.created}/${data.total} pushed — some errors`)
    } catch { toast.error("Network error") }
    finally { setPushing(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-1">Leads Import</h1>
        <p className="text-[#4a5a55]">Push ZoomInfo contacts to Airtable automatically or via CSV upload.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {[
          { key: "auto",     label: "Auto Sync",      icon: Settings  },
          { key: "company",  label: "By Company",     icon: Building2 },
          { key: "zoominfo", label: "By List",        icon: Zap       },
          { key: "csv",      label: "CSV Upload",     icon: Upload    },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key as Tab); setResult(null) }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              tab === key
                ? "bg-[#2D6A4F] text-white shadow-md"
                : "bg-white border border-[#DCE5E1] text-[#4a5a55] hover:border-[#2D6A4F]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Result Banner */}
      {result && (
        <Card className={`p-4 flex items-center gap-3 ${result.errors.length === 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          {result.errors.length === 0
            ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            : <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>
            <p className="font-semibold text-[#12261f]">
              {result.created} of {result.total} contacts sent to Airtable
            </p>
            {result.errors.length > 0 && <p className="text-sm text-amber-700 mt-0.5">{result.errors[0]}</p>}
          </div>
        </Card>
      )}

      {/* ── Auto Sync Tab ── */}
      {tab === "auto" && (
        <div className="space-y-4">
          <Card className="p-6 border-[#DCE5E1] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#2D6A4F]" />
                <h2 className="text-lg font-bold text-[#12261f]">Automatic ZoomInfo → Airtable Sync</h2>
              </div>
              <button
                onClick={() => saveConfig({ enabled: !syncConfig.enabled })}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                {syncConfig.enabled
                  ? <><ToggleRight className="w-8 h-8 text-[#2D6A4F]" /><span className="text-[#2D6A4F]">Enabled</span></>
                  : <><ToggleLeft className="w-8 h-8 text-gray-400" /><span className="text-gray-400">Disabled</span></>}
              </button>
            </div>

            {/* ZoomInfo List ID */}
            <div>
              <label className="block text-sm font-semibold text-[#12261f] mb-1">ZoomInfo List ID</label>
              <input
                type="text"
                value={syncConfig.listId}
                onChange={(e) => setSyncConfig(s => ({ ...s, listId: e.target.value }))}
                onBlur={() => saveConfig({ listId: syncConfig.listId })}
                placeholder="e.g. 12345678"
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm"
              />
              <p className="text-xs text-[#4a5a55] mt-1">Find this in ZoomInfo → Lists → click your list → copy the ID from the URL</p>
            </div>

            {/* Sync Interval */}
            <div>
              <label className="block text-sm font-semibold text-[#12261f] mb-1">Sync Every</label>
              <select
                value={syncConfig.intervalMinutes}
                onChange={(e) => saveConfig({ intervalMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm bg-white"
              >
                <option value={60}>Every hour</option>
                <option value={360}>Every 6 hours</option>
                <option value={720}>Every 12 hours</option>
                <option value={1440}>Every day</option>
              </select>
            </div>

            {/* Last Sync Status */}
            <div className="bg-[#f5f7f6] rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#4a5a55]" />
                <span className="text-[#4a5a55]">Last sync:</span>
                <span className="font-medium text-[#12261f]">
                  {syncConfig.lastSyncAt
                    ? new Date(syncConfig.lastSyncAt).toLocaleString()
                    : "Never"}
                </span>
              </div>
              {syncConfig.lastSyncAt && (
                <div className="flex items-center gap-2 text-sm">
                  {syncConfig.lastSyncError
                    ? <AlertCircle className="w-4 h-4 text-red-500" />
                    : <CheckCircle className="w-4 h-4 text-green-500" />}
                  <span className={syncConfig.lastSyncError ? "text-red-600" : "text-green-600"}>
                    {syncConfig.lastSyncError || `${syncConfig.lastSyncCount} contacts pushed`}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={runNow}
                disabled={running || !syncConfig.listId}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
              >
                {running
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing...</>
                  : <><Play className="w-4 h-4 mr-2" />Run Sync Now</>}
              </Button>
            </div>
          </Card>

          {/* How it works */}
          <Card className="p-5 border-[#DCE5E1] bg-[#f5f7f6]">
            <h3 className="font-semibold text-[#12261f] mb-2">How automatic sync works</h3>
            <ol className="text-sm text-[#4a5a55] space-y-1 list-decimal list-inside">
              <li>Enter your ZoomInfo List ID and set the sync interval above</li>
              <li>Toggle <strong>Enabled</strong> on</li>
              <li>Run <code className="bg-white px-1 rounded">start.bat</code> from the project folder to start the app + sync daemon together</li>
              <li>The daemon checks every 60s — when the interval is due, it pulls from ZoomInfo and pushes to Airtable automatically</li>
              <li>Results are shown in "Last sync" above</li>
            </ol>
          </Card>
        </div>
      )}

      {/* ── Company Lookup Tab ── */}
      {tab === "company" && (
        <div className="space-y-4">
          <Card className="p-6 border-[#DCE5E1] space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="text-lg font-bold text-[#12261f]">Push Contacts by Company</h2>
            </div>
            <p className="text-sm text-[#4a5a55]">
              Paste a ZoomInfo company URL or company ID — the system fetches all contacts at that company and pushes them to Airtable.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="https://app.zoominfo.com/#/apps/home-page/panel/company-profile/345667062/preview"
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm"
              />
              <Button
                onClick={lookupCompany}
                disabled={companyLoading || !companyInput.trim()}
                variant="outline"
                className="border-[#2D6A4F] text-[#2D6A4F] shrink-0"
              >
                {companyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Preview"}
              </Button>
              <Button
                onClick={pushCompanyContacts}
                disabled={companyPushing || !companyInput.trim()}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white shrink-0"
              >
                {companyPushing
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Pushing...</>
                  : <><Send className="w-4 h-4 mr-2" />Push to Airtable</>}
              </Button>
            </div>

            <p className="text-xs text-[#4a5a55]">
              Tip: In ZoomInfo, open any company profile → copy the full URL from your browser address bar → paste it above.
            </p>
          </Card>

          {/* Preview contacts */}
          {companyContacts.length > 0 && (
            <Card className="border-[#DCE5E1] overflow-hidden">
              <div className="p-4 border-b border-[#DCE5E1] bg-[#f5f7f6] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2D6A4F]" />
                <span className="font-semibold text-[#12261f]">{companyContacts.length} contacts found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#DCE5E1] bg-white">
                      {["Name","Email","Phone","Job Title"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[#4a5a55] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companyContacts.map((c, i) => (
                      <tr key={i} className="border-b border-[#DCE5E1] hover:bg-[#f5f7f6]">
                        <td className="px-4 py-2 font-medium text-[#12261f]">{[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-4 py-2 text-[#4a5a55]">{c.emailAddress || "—"}</td>
                        <td className="px-4 py-2 text-[#4a5a55]">{c.phone || c.mobile || "—"}</td>
                        <td className="px-4 py-2 text-[#4a5a55]">{c.jobTitle || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── ZoomInfo Tab ── */}
      {tab === "zoominfo" && (
        <div className="space-y-4">
          {/* Webhook Setup */}
          <Card className="p-6 border-[#DCE5E1] space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="text-lg font-bold text-[#12261f]">Automatic Sync (Webhook)</h2>
            </div>
            <p className="text-sm text-[#4a5a55]">
              Set up a ZoomInfo Automation to POST to this URL whenever a new contact is added.
              Every new contact will instantly appear in Airtable — no manual action needed.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-[#f5f7f6] border border-[#DCE5E1] rounded px-4 py-2 text-sm text-[#12261f] font-mono">
                {webhookUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="border-[#DCE5E1] shrink-0"
                onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("Copied!") }}
              >
                <Link2 className="w-4 h-4 mr-1" /> Copy
              </Button>
            </div>
            <div className="bg-[#f5f7f6] rounded-lg p-4 text-sm text-[#4a5a55] space-y-1">
              <p className="font-semibold text-[#12261f] mb-2">ZoomInfo setup steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>In ZoomInfo → go to <strong>Automations</strong> in the left sidebar</li>
                <li>Click <strong>Create Automation</strong></li>
                <li>Trigger: <strong>Contact added to list</strong> (pick your list)</li>
                <li>Action: <strong>Send to Webhook</strong></li>
                <li>Paste the URL above and save</li>
              </ol>
            </div>
          </Card>

          {/* Manual List Sync */}
          <Card className="p-6 border-[#DCE5E1] space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-5 h-5 text-[#2D6A4F]" />
              <h2 className="text-lg font-bold text-[#12261f]">Sync a List Now</h2>
            </div>
            <p className="text-sm text-[#4a5a55]">
              Enter a ZoomInfo List ID to immediately pull all contacts from that list into Airtable.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                placeholder="e.g. 500_040226_PERSON or list numeric ID"
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#DCE5E1] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] text-sm bg-white"
              />
              <Button
                onClick={syncList}
                disabled={syncing || !listId.trim()}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white shrink-0"
              >
                {syncing
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing...</>
                  : <><RefreshCw className="w-4 h-4 mr-2" />Sync to Airtable</>}
              </Button>
            </div>
            <p className="text-xs text-[#4a5a55]">
              Find the List ID in ZoomInfo → Lists → click your list → copy the ID from the URL.
            </p>
          </Card>
        </div>
      )}

      {/* ── CSV Tab ── */}
      {tab === "csv" && (
        <div className="space-y-4">
          {leads.length === 0 && (
            <Card
              className="border-2 border-dashed border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors p-16 flex flex-col items-center gap-4 cursor-pointer"
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#2D6A4F]" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-[#12261f]">Drop ZoomInfo CSV here</p>
                <p className="text-sm text-[#4a5a55] mt-1">or click to browse — columns auto-detected</p>
              </div>
              <input ref={fileRef} type="file" accept=".csv" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
            </Card>
          )}

          {leads.length > 0 && (
            <Card className="border-[#DCE5E1] overflow-hidden">
              <div className="p-4 border-b border-[#DCE5E1] flex items-center justify-between bg-[#f5f7f6]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2D6A4F]" />
                  <span className="font-semibold text-[#12261f]">{leads.length} leads ready</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setLeads([]); setResult(null) }} className="border-[#DCE5E1] text-[#4a5a55]">Clear</Button>
                  <Button size="sm" onClick={pushCSV} disabled={pushing} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white">
                    {pushing
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Pushing...</>
                      : <><Send className="w-4 h-4 mr-2" />Push to Airtable</>}
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#DCE5E1] bg-white">
                      {["#","Company","Contact Name","Email","Phone","Mobile","Job Title","Industry","Revenue","Region",""].map((h) => (
                        <th key={h} className="text-left px-3 py-3 text-[#4a5a55] font-medium text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => (
                      <tr key={idx} className="border-b border-[#DCE5E1] hover:bg-[#f5f7f6]">
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-[#12261f] text-sm">{lead.company || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.name || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.email || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.phone || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.mobile || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.title || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.industry || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{lead.revenue || "—"}</td>
                        <td className="px-3 py-2 text-[#4a5a55] text-sm">{[lead.country, lead.state].filter(Boolean).join(", ") || "—"}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
