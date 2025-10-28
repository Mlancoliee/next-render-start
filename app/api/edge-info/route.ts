import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''
  const info = {
    runtime: 'edge',
    now: new Date().toISOString(),
    url: url.toString(),
    userAgent: ua,
    randomUUID: (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? globalThis.crypto.randomUUID() : null,
  }
  return NextResponse.json(info)
}


