"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'

export default function LoginPage() {
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('pass')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onLogin = async () => {
    setLoading(true)
    try {
      // 使用 next-auth/react 的 signIn（客户端版本）
      const res = await signIn('credentials', { 
        username, 
        password, 
        redirect: false,
        callbackUrl: '/'
      })
      
      if (res?.error) {
        alert('登录失败: ' + res.error)
      } else if (res?.ok) {
        router.push('/')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const onLogout = async () => {
    await signOut({ redirect: false })
    router.refresh()
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>登录（Demo Credentials）</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
        <input 
          value={username} 
          onChange={e=>setUsername(e.target.value)} 
          placeholder="用户名"
          disabled={loading}
        />
        <input 
          value={password} 
          type="password" 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="密码"
          disabled={loading}
        />
        <button onClick={onLogin} disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
        <button onClick={onLogout} disabled={loading}>退出登录</button>
        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
          演示账号：user / pass
        </p>
      </div>
    </div>
  )
}
