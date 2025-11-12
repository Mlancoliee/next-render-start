import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { cache } from "react"

// 简化演示：使用 Credentials Provider，本地校验用户名/密码。
// 生产建议接入真实 OAuth（GitHub/AzureAD 等）。
export const authConfig: NextAuthConfig = {
  basePath: "/api/auth",
  trustHost: true, // 在反向代理后信任外部 Host（NextAuth v5）
  
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        const u = credentials?.username as string | undefined
        const p = credentials?.password as string | undefined
        // demo 账户：user / pass
        if (u === "user" && p === "pass") {
          return { id: "1", name: "Demo User", email: "demo@example.com" }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
}

const nextAuth = NextAuth(authConfig)

export const { handlers, signIn, signOut } = nextAuth

// 使用 React cache 包装 auth 调用，避免 Next.js 15 的同步 headers 警告
export const auth = cache(nextAuth.auth)

