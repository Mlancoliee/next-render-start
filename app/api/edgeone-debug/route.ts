import { NextResponse } from 'next/server'

// 在 EO Pages 以及本地 dev 复现“回调被重写为 localhost”的问题。
// 该路由会原样输出：环境变量、URL 解析结果、常见反向代理头（x-forwarded-* / x-real-ip）、以及完整请求头。
// 为了更接近网关/边缘节点收到的原始请求，这里使用 edge runtime，并禁用缓存。
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const revalidate = 0

function headersToObject(headers: Headers) {
  const obj: Record<string, string> = {}
  for (const [k, v] of headers.entries()) obj[k] = v
  return obj
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const headers = request.headers

  // 常见代理头
  const xForwardedFor = headers.get('x-forwarded-for') || ''
  const realIp =
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-client-ip') ||
    (xForwardedFor.split(',')[0] || '').trim() ||
    null

  const body = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || null,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
      AZURE_REDIRECT_URI: process.env.AZURE_REDIRECT_URI || null,
    },
    urlAnalysis: {
      requestUrl: url.toString(),
      nextUrlOrigin: url.origin,
      nextUrlHost: url.host,
      nextUrlProtocol: url.protocol,
      headersHost: headers.get('host') || null,
      xForwardedHost: headers.get('x-forwarded-host') || null,
      xForwardedProto: headers.get('x-forwarded-proto') || null,
      xForwardedPort: headers.get('x-forwarded-port') || null,
      xForwardedFor,
      xRealIp: realIp,
    },
    headers: headersToObject(headers),
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
