// export const config = {
//   runtime: 'nodejs', // optional: use 'nodejs' or omit for 'edge' (default)
// };
 
import { NextResponse } from 'next/server'

export default function middleware(request: Request) {
  // 如果平台构造的 Request.url 仍然是 localhost，尝试用头重写（权宜之计，与 adapter 修复配合）
  // const url = new URL(request.url)
  // const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  // const forwardedProto = request.headers.get('x-forwarded-proto')
  // if (forwardedHost && url.hostname === 'localhost') {
  //   const port = request.headers.get('x-forwarded-port')
  //   const hostWithPort = port && !forwardedHost.includes(':') ? `${forwardedHost}:${port}` : forwardedHost
  //   url.hostname = forwardedHost
  //   if (port) url.port = port
  //   if (forwardedProto) url.protocol = forwardedProto + ':'
  //   return NextResponse.rewrite(url)
  // }
}