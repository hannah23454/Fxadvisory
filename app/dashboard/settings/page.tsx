"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Save, CheckCircle2, Mail, Send } from "lucide-react"

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<any>(null)
  const [emailTo, setEmailTo] = useState("")
  const [emailName, setEmailName] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const res = await fetch('/api/user/preferences')
      if (res.ok) {
        const data = await res.json()
        setPreferences(data)
      } else {
        const error = await res.json()
        console.error('Failed to load preferences:', error)
        toast.error('Failed to load settings')
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      toast.error('Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!preferences) {
      toast.error('No preferences to save')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || 'Settings saved successfully')
      } else {
        toast.error(data.error || 'Failed to save settings')
        console.error('Save error:', data)
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Network error - please try again')
    } finally {
      setSaving(false)
    }
  }

  const updateFeedLayout = (module: string, enabled: boolean) => {
    setPreferences({
      ...preferences,
      feedLayout: {
        ...preferences.feedLayout,
        [module]: enabled
      }
    })
  }

  const updateCurrencies = (currencies: string[]) => {
    setPreferences({
      ...preferences,
      currencies
    })
  }

  const sendInsightsEmail = async () => {
    if (!emailTo || !emailName) {
      toast.error("Please enter both email and name")
      return
    }

    setSendingEmail(true)
    try {
      const res = await fetch("/api/insights/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailTo, name: emailName }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Email sent to ${emailTo}`)
        setEmailTo("")
        setEmailName("")
      } else {
        toast.error(data.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Network error - please try again")
    } finally {
      setSendingEmail(false)
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          Dashboard Settings
        </h1>
        <p className="text-[#4a5a55]">
          Customize your dashboard experience
        </p>
      </div>

      {/* Dashboard Modules */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Dashboard Modules
        </h2>
        <p className="text-sm text-[#4a5a55] mb-6">
          Select which modules to display on your dashboard home
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="liveRates" className="text-base font-medium text-[#12261f]">
                Live Currency Rates
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Display real-time AUD exchange rates
              </p>
            </div>
            <Switch
              id="liveRates"
              checked={preferences?.feedLayout?.liveRates}
              onCheckedChange={(checked) => updateFeedLayout('liveRates', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="marketNews" className="text-base font-medium text-[#12261f]">
                Market Headlines
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Show latest market insights and commentary
              </p>
            </div>
            <Switch
              id="marketNews"
              checked={preferences?.feedLayout?.marketNews}
              onCheckedChange={(checked) => updateFeedLayout('marketNews', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="newsletters" className="text-base font-medium text-[#12261f]">
                Newsletters
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Display newsletter archive and history
              </p>
            </div>
            <Switch
              id="newsletters"
              checked={preferences?.feedLayout?.newsletters}
              onCheckedChange={(checked) => updateFeedLayout('newsletters', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="hedgingDocs" className="text-base font-medium text-[#12261f]">
                Hedging Documents
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Show policy documents and resources
              </p>
            </div>
            <Switch
              id="hedgingDocs"
              checked={preferences?.feedLayout?.hedgingDocs}
              onCheckedChange={(checked) => updateFeedLayout('hedgingDocs', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="products" className="text-base font-medium text-[#12261f]">
                Products & Solutions
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Display available FX products
              </p>
            </div>
            <Switch
              id="products"
              checked={preferences?.feedLayout?.products}
              onCheckedChange={(checked) => updateFeedLayout('products', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Currency Preferences */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Currency Preferences
        </h2>
        <p className="text-sm text-[#4a5a55] mb-4">
          Select your currencies of interest
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['USD', 'EUR', 'GBP', 'JPY', 'NZD', 'CNY', 'SGD', 'HKD'].map((currency) => (
            <div key={currency} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={currency}
                checked={preferences?.currencies?.includes(currency)}
                onChange={(e) => {
                  const current = preferences?.currencies || []
                  updateCurrencies(
                    e.target.checked
                      ? [...current, currency]
                      : current.filter((c: string) => c !== currency)
                  )
                }}
                className="w-4 h-4 text-[#2D6A4F] border-[#DCE5E1] rounded focus:ring-[#2D6A4F]"
              />
              <Label htmlFor={currency} className="text-sm font-medium text-[#12261f]">
                {currency}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">
          Notification Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1]">
            <div>
              <Label htmlFor="emailNotifications" className="text-base font-medium text-[#12261f]">
                Email Notifications
              </Label>
              <p className="text-sm text-[#4a5a55] mt-1">
                Receive market updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={preferences?.notifications?.email}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  notifications: {
                    ...preferences.notifications,
                    email: checked
                  }
                })
              }
            />
          </div>

          <div className="p-4 rounded-lg border border-[#DCE5E1]">
            <Label htmlFor="frequency" className="text-base font-medium text-[#12261f]">
              Email Frequency
            </Label>
            <select
              id="frequency"
              value={preferences?.notifications?.frequency || 'weekly'}
              onChange={(e) => 
                setPreferences({
                  ...preferences,
                  notifications: {
                    ...preferences.notifications,
                    frequency: e.target.value
                  }
                })
              }
              className="mt-2 w-full px-3 py-2 border border-[#DCE5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Send Insights Email */}
      <Card className="p-6 border-[#DCE5E1]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#E8EEEB] flex items-center justify-center text-[#2D6A4F]">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#12261f]">Send Weekly Insights Email</h2>
            <p className="text-sm text-[#4a5a55]">Send FX market insights digest to any email address</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="emailTo" className="text-sm font-medium text-[#12261f]">
              Recipient Email Address *
            </Label>
            <Input
              id="emailTo"
              type="email"
              placeholder="user@company.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="mt-2 border-[#DCE5E1]"
            />
          </div>

          <div>
            <Label htmlFor="emailName" className="text-sm font-medium text-[#12261f]">
              Recipient Name *
            </Label>
            <Input
              id="emailName"
              type="text"
              placeholder="e.g. John Smith"
              value={emailName}
              onChange={(e) => setEmailName(e.target.value)}
              className="mt-2 border-[#DCE5E1]"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#F5F7F6] border border-[#DCE5E1]">
            <p className="text-sm text-[#4a5a55] leading-relaxed">
              The recipient will receive a branded email with the top 5 market insights from Airtable. The email includes a button to view the full insights page at <code className="text-xs bg-white px-2 py-1 rounded text-[#2D6A4F]">/market-insights/digest</code>
            </p>
          </div>

          <Button
            onClick={sendInsightsEmail}
            disabled={sendingEmail || !emailTo || !emailName}
            className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
          >
            {sendingEmail ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={savePreferences}
          disabled={saving}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-8"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
