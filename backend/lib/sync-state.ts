import { getDatabase } from "@/database/mongodb"

export interface SyncConfig {
  enabled: boolean
  listId: string
  listName: string
  intervalMinutes: number  // 60, 360, 720, 1440
  lastSyncAt: Date | null
  lastSyncCount: number
  lastSyncError: string | null
}

const COLLECTION = "zoominfo_sync"

export async function getSyncConfig(): Promise<SyncConfig> {
  const db  = await getDatabase()
  const doc = await db.collection(COLLECTION).findOne({ _id: "config" as any })
  return doc ?? {
    enabled: false,
    listId: "",
    listName: "",
    intervalMinutes: 60,
    lastSyncAt: null,
    lastSyncCount: 0,
    lastSyncError: null,
  }
}

export async function saveSyncConfig(config: Partial<SyncConfig>) {
  const db = await getDatabase()
  await db.collection(COLLECTION).updateOne(
    { _id: "config" as any },
    { $set: config },
    { upsert: true }
  )
}

export async function recordSyncResult(count: number, error: string | null) {
  await saveSyncConfig({
    lastSyncAt: new Date(),
    lastSyncCount: count,
    lastSyncError: error,
  })
}
