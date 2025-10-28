import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const info = {
    runtime: 'nodejs',
    nodeVersion: process.version,
    pid: typeof process.pid === 'number' ? process.pid : null,
    platform: process.platform,
    now: new Date().toISOString(),
    url: url.toString(),
  }
  return NextResponse.json(info)
}


