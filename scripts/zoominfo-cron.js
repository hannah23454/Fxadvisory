/**
 * ZoomInfo → Airtable background sync daemon.
 * Run alongside the Next.js app:  node scripts/zoominfo-cron.js
 * Reads sync config from the app's API and runs on the configured interval.
 */

const BASE_URL = process.env.APP_URL || "http://localhost:3000"
const CHECK_INTERVAL_MS = 60 * 1000 // check every 60s if it's time to sync

async function getConfig() {
  const res = await fetch(`${BASE_URL}/api/zoominfo/config`)
  return res.json()
}

async function runSync() {
  console.log(`[${new Date().toISOString()}] Running ZoomInfo → Airtable sync...`)
  const res  = await fetch(`${BASE_URL}/api/zoominfo/auto-sync`, { method: "POST" })
  const data = await res.json()
  if (data.error) {
    console.error(`[sync] Error:`, data.error)
  } else {
    console.log(`[sync] Done — pushed ${data.created}/${data.total} contacts to Airtable`)
  }
}

let lastRun = null

async function tick() {
  try {
    const config = await getConfig()

    if (!config.enabled || !config.listId) return

    const intervalMs = (config.intervalMinutes || 60) * 60 * 1000
    const now        = Date.now()

    if (!lastRun || now - lastRun >= intervalMs) {
      lastRun = now
      await runSync()
    }
  } catch (err) {
    console.error(`[cron] tick error:`, err.message)
  }
}

console.log(`[cron] ZoomInfo sync daemon started. Checking every 60s.`)
console.log(`[cron] App URL: ${BASE_URL}`)

tick() // run immediately on start
setInterval(tick, CHECK_INTERVAL_MS)
