import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  let body: unknown = null
  try {
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else if (contentType.includes('text/')) {
      body = await request.text()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData()
      body = Object.fromEntries(form.entries())
    } else {
      const raw = await request.arrayBuffer()
      body = { byteLength: raw.byteLength }
    }
  } catch (e) {
    body = { parseError: true }
  }

  return NextResponse.json({ method: 'POST', contentType, body, ts: new Date().toISOString() })
}

export async function GET() {
  return NextResponse.json({ message: 'Send a POST request to echo your payload.' })
}


