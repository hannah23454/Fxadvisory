"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type SiteSettings = Record<string, string>

interface SiteSettingsContextValue {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  loading: true,
  refresh: async () => {},
})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await fetch('/api/admin/site-settings', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const json = await res.json()
      // supports both { ok, data } shape and legacy plain object shape
      const data = json?.data !== undefined ? json.data : json
      setSettings(data || {})
    } catch {
      // silently fail, components fall back to defaults
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
