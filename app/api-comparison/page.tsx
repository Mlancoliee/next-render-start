'use client'

import { useState } from 'react'
import Link from 'next/link'

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null

export default function ApiComparisonPage() {
  const [nextResult, setNextResult] = useState<Json>(null)
  const [edgeResult, setEdgeResult] = useState<Json>(null)
  const [nodeFnInfo, setNodeFnInfo] = useState<Json>(null)
  const [echoResult, setEchoResult] = useState<Json>(null)

  const callNextInfo = async () => {
    const res = await fetch('/api/next-info', { cache: 'no-store' })
    setNextResult(await res.json())
  }

  const callEdgeInfo = async () => {
    const res = await fetch('/api/edge-info', { cache: 'no-store' })
    setEdgeResult(await res.json())
  }

  const callNodeInfo = async () => {
    const res = await fetch('/node-info', { cache: 'no-store' })
    setNodeFnInfo(await res.json())
  }

  const callEcho = async () => {
    const res = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ hello: 'world', ts: Date.now() }),
    })
    setEchoResult(await res.json())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/" className="text-blue-600 hover:underline">返回首页</Link>
        <h1 className="text-2xl font-bold">Next.js API vs Node Functions 对比</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-2">Next.js API（Node runtime）</h2>
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={callNextInfo}>GET /api/next-info</button>
            <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{JSON.stringify(nextResult, null, 2)}</pre>
          </section>

          <section className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-2">Next.js API（Edge runtime）</h2>
            <button className="px-3 py-2 bg-purple-600 text-white rounded" onClick={callEdgeInfo}>GET /api/edge-info</button>
            <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{JSON.stringify(edgeResult, null, 2)}</pre>
          </section>

          <section className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-2">Next.js API（Echo）</h2>
            <button className="px-3 py-2 bg-gray-800 text-white rounded" onClick={callEcho}>POST /api/echo</button>
            <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{JSON.stringify(echoResult, null, 2)}</pre>
          </section>

          <section className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-2">Node Functions（EdgeOne）</h2>
            <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={callNodeInfo}>GET /node-info</button>
            <pre className="mt-2 text-sm whitespace-pre-wrap break-words">{JSON.stringify(nodeFnInfo, null, 2)}</pre>
          </section>
        </div>

        <div className="text-sm text-gray-600">
          <p>提示：/api/* 为 Next.js Route Handlers；/node-info 为 EdgeOne Node Functions。</p>
        </div>
      </div>
    </div>
  )
}


