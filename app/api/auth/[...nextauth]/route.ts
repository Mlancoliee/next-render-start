// NextAuth API 路由：自动处理 /api/auth/* (signin, callback, session 等)
import { handlers } from '../../../../lib/auth'

export const runtime = 'nodejs'
export const { GET, POST } = handlers
