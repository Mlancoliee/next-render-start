"use client"

import { useSession } from 'next-auth/react'

export function SessionDisplay() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span className="text-gray-500">检查登录状态...</span>
  }

  if (session?.user) {
    return (
      <span>
        已登录：{session.user.name} (<a className="underline" href="/login">账户</a>)
      </span>
    )
  }

  return (
    <span>
      未登录，<a className="underline" href="/login">去登录</a>
    </span>
  )
}
