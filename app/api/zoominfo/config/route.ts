import { NextRequest, NextResponse } from "next/server"
import { getSyncConfig, saveSyncConfig } from "@/backend/lib/sync-state"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const config = await getSyncConfig()
  return NextResponse.json(config)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  await saveSyncConfig(body)
  return NextResponse.json({ success: true })
}
