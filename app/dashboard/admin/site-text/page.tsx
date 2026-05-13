"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save, Type, FileText, Info, CheckCircle2 } from "lucide-react"
import { useSiteSettings } from "@/components/context/site-settings/site-settings"

const TABS = [
  { id: 'footer', label: 'Footer', icon: Type },
  { id: 'disclaimer', label: 'Disclaimer', icon: Info },
  { id: 'legal', label: 'Legal Pages', icon: FileText },
] as const

type TabId = typeof TABS[number]['id']

const DEFAULT_PRIVACY_HTML = `<p>SwitchYard FX Advisory ABN 49 691 362 553, AFSL 520548 ("we", "us", "our") is committed to protecting the privacy of your personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).</p>
<h3>Information We Collect</h3>
<p>We collect personal information such as name, email address, phone number, business details, and financial information necessary to provide our FX advisory and hedging services. Information is collected directly from you, from third-party verification providers, and through your use of our website or platform.</p>
<h3>How We Use Your Information</h3>
<p>Your information is used to provide and improve our services, comply with legal and regulatory obligations, communicate with you about your account and market updates, and for internal analytics. We do not sell your personal information to third parties.</p>
<h3>Data Security</h3>
<p>We employ industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. Despite these measures, no method of transmission over the internet is entirely secure.</p>
<h3>Contact Us</h3>
<p>For privacy-related enquiries, contact our Privacy Officer at <a href="mailto:admin@switchyard.com.au">admin@switchyard.com.au</a>.</p>`

const DEFAULT_TERMS_HTML = `<p>By accessing or using SwitchYard FX Advisory's website, platform, or services, you agree to be bound by these Terms of Service. Please read them carefully before proceeding.</p>
<h3>Services</h3>
<p>SwitchYard FX Advisory provides foreign exchange advisory, hedging strategy, and related financial services to eligible wholesale and sophisticated investors as defined under the <em>Corporations Act 2001</em> (Cth). Our services are not available to retail clients or individuals under 18 years of age.</p>
<h3>General Advice Warning</h3>
<p>Any information provided through our platform or communications constitutes general financial advice only and does not take into account your personal objectives, financial situation, or needs. You should consider obtaining independent financial advice before making any financial decision.</p>
<h3>Intellectual Property</h3>
<p>All content on this website, including text, graphics, logos, and software, is the property of SwitchYard FX Advisory and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without prior written consent.</p>
<h3>Limitation of Liability</h3>
<p>To the maximum extent permitted by law, SwitchYard FX Advisory is not liable for any indirect, incidental, or consequential losses arising from your use of our services or reliance on information provided through our platform.</p>
<h3>Governing Law</h3>
<p>These terms are governed by the laws of New South Wales, Australia. You submit to the exclusive jurisdiction of the courts of New South Wales.</p>`

const DEFAULT_COMPLIANCE_HTML = `<p>SwitchYard FX Advisory operates under an Australian Financial Services Licence (AFSL) and is regulated by the Australian Securities and Investments Commission (ASIC).</p>
<h3>AML / CTF</h3>
<p>We maintain a comprehensive Anti-Money Laundering and Counter-Terrorism Financing (AML/CTF) program in compliance with the <em>Anti-Money Laundering and Counter-Terrorism Financing Act 2006</em> (Cth). All clients are subject to identity verification and ongoing due-diligence procedures.</p>
<h3>Client Classification</h3>
<p>We provide services exclusively to wholesale clients under section 761G of the <em>Corporations Act 2001</em>. Prior to onboarding, clients are required to provide evidence of their wholesale client status.</p>
<h3>Complaints &amp; Disputes</h3>
<p>We have an internal complaints handling procedure. If you are unsatisfied with the outcome, you may escalate to the Australian Financial Complaints Authority (AFCA) at <a href="https://www.afca.org.au" target="_blank" rel="noopener noreferrer">www.afca.org.au</a>.</p>
<h3>ASIC Register</h3>
<p>You can verify our licence details on the ASIC Connect Professional Registers at <a href="https://connectonline.asic.gov.au" target="_blank" rel="noopener noreferrer">connectonline.asic.gov.au</a>.</p>`

const DEFAULTS: Record<string, string> = {
  footer_tagline: "Trusted FX solutions for mid-market corporates. Simplify treasury risk management.",
  footer_afsl: "Switchyard Capital Pty Ltd is an Authorised Representative (ASIC AR No. 001318359) of Ebury Partners Australia Pty Limited (ACN 632 570 702) which holds an Australian Financial Services Licence (AFSL 520548).",
  footer_afsl_detail: "Ebury Partners Australia Pty Limited ('Ebury') ACN 632 570 702, Registered Office: Level 20, 201 Elizabeth Street, Sydney NSW 2000. Ebury is authorised and regulated by the Australian Securities and Investments Commission (ASIC) to provide financial services under Australian Financial Services Licence (AFSL) 520548 and is registered with the Australian Transaction Reports and Analysis Centre (AUSTRAC).",
  footer_switchyard: "For Australia and New Zealand the Programme Manager must also display Ebury's Legal & Compliance documentation:",
  footer_phone: "02 7226 3680",
  footer_email_address: "admin@switchyard.com.au",
  footer_copyright: "© 2025 SwitchYard FX. All rights reserved.",
  disclaimer_title: "Legal Disclaimer",
  disclaimer_text_1: "Switchyard Capital Pty Ltd is an Authorised Representative (ASIC AR No. 001318359) of Ebury Partners Australia Pty Limited (ACN 632 570 702) which holds an Australian Financial Services Licence (AFSL 520548).",
  disclaimer_text_2: "Ebury Partners Australia Pty Limited ('Ebury') ACN 632 570 702, Registered Office: Level 20, 201 Elizabeth Street, Sydney NSW 2000. Ebury is authorised and regulated by the Australian Securities and Investments Commission (ASIC) to provide financial services under Australian Financial Services Licence (AFSL) 520548 and is registered with the Australian Transaction Reports and Analysis Centre (AUSTRAC).",
  disclaimer_programme_prefix: "For Australia and New Zealand the Programme Manager must also display Ebury's Legal & Compliance documentation:",
  terms_privacy_html: DEFAULT_PRIVACY_HTML,
  terms_service_html: DEFAULT_TERMS_HTML,
  terms_compliance_html: DEFAULT_COMPLIANCE_HTML,
}

export default function SiteTextPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('footer')
  const [fields, setFields] = useState<Record<string, string>>(DEFAULTS)
  const { refresh } = useSiteSettings()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/site-settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        const data = json?.data !== undefined ? json.data : json
        setFields({ ...DEFAULTS, ...data })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        await refresh()
        router.refresh()
        setLastSaved(new Date().toLocaleTimeString())
        toast.success('Site text saved — changes are now live')
      } else {
        const msg = json?.error || `HTTP ${res.status}`
        setSaveError(msg)
        toast.error(`Save failed: ${msg}`)
      }
    } catch (err) {
      const msg = String(err)
      setSaveError(msg)
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">Site Text Editor</h1>
          <p className="text-[#4a5a55]">
            Edit website copy, legal text, and disclaimers. Changes go live instantly.
          </p>
        </div>
        <Button
          onClick={save}
          disabled={saving}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white min-w-[120px]"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      {/* Save status banners */}
      {lastSaved && !saveError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Saved at {lastSaved}. Hard-refresh the public page (Ctrl+Shift+R) to see changes if they don&apos;t appear immediately.</span>
        </div>
      )}
      {saveError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <strong>Save failed:</strong> {saveError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#DCE5E1]">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#2D6A4F] text-[#2D6A4F]'
                  : 'border-transparent text-[#4a5a55] hover:text-[#12261f] hover:border-[#DCE5E1]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          <Card className="p-6 border-[#DCE5E1] space-y-5">
            <h3 className="font-semibold text-[#12261f] text-lg">Branding & Contact</h3>

            <Field label="Tagline (below logo)">
              <Textarea
                value={fields.footer_tagline}
                onChange={e => set('footer_tagline', e.target.value)}
                rows={2}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone Number">
                <Input
                  value={fields.footer_phone}
                  onChange={e => set('footer_phone', e.target.value)}
                />
              </Field>
              <Field label="Email Address">
                <Input
                  value={fields.footer_email_address}
                  onChange={e => set('footer_email_address', e.target.value)}
                />
              </Field>
            </div>

            <Field label="Copyright Line">
              <Input
                value={fields.footer_copyright}
                onChange={e => set('footer_copyright', e.target.value)}
              />
            </Field>
          </Card>

          <Card className="p-6 border-[#DCE5E1] space-y-5">
            <h3 className="font-semibold text-[#12261f] text-lg">AFSL Compliance Block</h3>
            <p className="text-xs text-[#4a5a55]">
              This text appears in the dark green box at the bottom of every page footer.
            </p>

            <Field label="Paragraph 1 — Authorised Representative">
              <Textarea
                value={fields.footer_afsl}
                onChange={e => set('footer_afsl', e.target.value)}
                rows={3}
              />
            </Field>

            <Field label="Paragraph 2 — Ebury Details">
              <Textarea
                value={fields.footer_afsl_detail}
                onChange={e => set('footer_afsl_detail', e.target.value)}
                rows={4}
              />
            </Field>

            <Field label="Paragraph 3 — Ebury Link Prefix">
              <Textarea
                value={fields.footer_switchyard}
                onChange={e => set('footer_switchyard', e.target.value)}
                rows={2}
              />
            </Field>
          </Card>
        </div>
      )}

      {/* Disclaimer Tab */}
      {activeTab === 'disclaimer' && (
        <Card className="p-6 border-[#DCE5E1] space-y-5">
          <h3 className="font-semibold text-[#12261f] text-lg">Legal Disclaimer Block</h3>
          <p className="text-xs text-[#4a5a55]">
            This box appears above the footer on the Terms page and other key pages.
          </p>

          <Field label="Title">
            <Input
              value={fields.disclaimer_title}
              onChange={e => set('disclaimer_title', e.target.value)}
            />
          </Field>

          <Field label="Text Block 1 — Authorised Representative">
            <Textarea
              value={fields.disclaimer_text_1}
              onChange={e => set('disclaimer_text_1', e.target.value)}
              rows={3}
            />
          </Field>

          <Field label="Text Block 2 — Ebury Details">
            <Textarea
              value={fields.disclaimer_text_2}
              onChange={e => set('disclaimer_text_2', e.target.value)}
              rows={4}
            />
          </Field>

          <Field label="Ebury Link Prefix">
            <Textarea
              value={fields.disclaimer_programme_prefix}
              onChange={e => set('disclaimer_programme_prefix', e.target.value)}
              rows={2}
            />
          </Field>
        </Card>
      )}

      {/* Legal Pages Tab */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>HTML supported.</strong> You can use basic HTML tags: &lt;p&gt;, &lt;h3&gt;, &lt;em&gt;, &lt;strong&gt;, &lt;a href="..."&gt;, &lt;ul&gt;, &lt;li&gt;. These sections appear on the <strong>/terms</strong> page.
          </div>

          <Card className="p-6 border-[#DCE5E1] space-y-3">
            <h3 className="font-semibold text-[#12261f] text-lg">Privacy Policy</h3>
            <p className="text-xs text-[#4a5a55]">Content under the "Privacy Policy" heading on /terms#privacy</p>
            <Textarea
              value={fields.terms_privacy_html}
              onChange={e => set('terms_privacy_html', e.target.value)}
              rows={14}
              className="font-mono text-xs"
            />
          </Card>

          <Card className="p-6 border-[#DCE5E1] space-y-3">
            <h3 className="font-semibold text-[#12261f] text-lg">Terms of Service</h3>
            <p className="text-xs text-[#4a5a55]">Content under the "Terms of Service" heading on /terms#terms</p>
            <Textarea
              value={fields.terms_service_html}
              onChange={e => set('terms_service_html', e.target.value)}
              rows={16}
              className="font-mono text-xs"
            />
          </Card>

          <Card className="p-6 border-[#DCE5E1] space-y-3">
            <h3 className="font-semibold text-[#12261f] text-lg">Compliance</h3>
            <p className="text-xs text-[#4a5a55]">Content under the "Compliance" heading on /terms#compliance</p>
            <Textarea
              value={fields.terms_compliance_html}
              onChange={e => set('terms_compliance_html', e.target.value)}
              rows={14}
              className="font-mono text-xs"
            />
          </Card>
        </div>
      )}

      {/* Floating save reminder */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={save}
          disabled={saving}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[#12261f]">{label}</Label>
      {children}
    </div>
  )
}
