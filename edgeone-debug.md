# edgeone-debug 复现说明

该文档描述如何在 EO Pages 上复现登录回调时域名被替换为 `localhost` 的问题，以及利用新增的 `GET /api/edgeone-debug` 路由收集所需诊断信息。

## 新增调试接口

路径：`/api/edgeone-debug`

运行时：Edge Runtime (`export const runtime = 'edge'`)，`dynamic = 'force-dynamic'` 禁用缓存，保证每次请求都实时输出。

返回字段包含：
- `environment`: 运行时可见的关键环境变量（`NODE_ENV`, `NEXTAUTH_URL`, `AZURE_REDIRECT_URI` 等，可根据需要再补充）。
- `urlAnalysis`: 从 `request.url` 解析出的 origin/host/protocol 以及代理头：`host`, `x-forwarded-host`, `x-forwarded-proto`, `x-forwarded-port`, `x-forwarded-for`, 推导出的 `xRealIp`。
- `headers`: 完整请求头，便于对比网关是否正确传递。

## 本地开发验证

```bash
pnpm dev               # 或 npm run dev / yarn dev，根据你的包管理器
curl -s http://localhost:3000/api/edgeone-debug | jq
```

确认：
1. `requestUrl` 应该以 `http://localhost:3000` 开头（dev 默认）。
2. 若你在本地自定义 HOST 访问（例如通过 hosts 映射某域名指向 127.0.0.1），查看 `host` / `x-forwarded-host` 是否与你访问的域一致。

## EO Pages 部署验证

在 EO Pages 部署后访问：
```
https://<你的线上域名>/api/edgeone-debug
```
重点观察：
1. `requestUrl` / `nextUrlHost` 是否仍错误地显示为 `localhost`（如果是，即复现你描述的问题）。
2. `headersHost` 与 `xForwardedHost`：是否被平台正确设置为外部可见域名。若这里是正确域名但 `requestUrl` 仍是 `localhost`，说明在生成 `Request` 或运行时适配层存在主机名覆盖。
3. 环境变量中的 `NEXTAUTH_URL` 是否为正确的生产域。若它正确但登录状态丢失，推测回调阶段 host 不一致导致 cookie / session / OAuth state 校验失败。

## 排查建议

1. 比对本地与 EO Pages 的差异：是否只有 `request.url` 被改写，还是相关 `x-forwarded-*` 头也异常。
2. 若 `x-forwarded-host` 正常而 `request.url` 错误，考虑在平台的 Server Handler / 入口（如自定义适配层）检查是否对 `request` 进行了包裹并硬编码了 `localhost`。
3. 使用 NextAuth 时确保：
   - `NEXTAUTH_URL` 指向最终外网可访问域名（不要带尾部 `/`）。
   - 生产环境不要依赖 `http://localhost` 的默认推断逻辑。
4. 如果平台的边缘函数在转发到 Node 运行时时丢失了 `Host`，尝试显式在入口中注入：
   ```js
   // 伪代码：在 fetch handler 中
   const upstreamReq = new Request(originalUrl, {
     headers: { ...originalHeaders, host: originalHeaders.get('x-forwarded-host') || originalHeaders.get('host') }
   })
   ```
5. 检查是否存在中间件 `middleware.ts` 对 `request.nextUrl.host` 做了修改。

## 后续可扩展

如果需要更多信息，可以把下列头也补充：`cf-ray`, `cf-ipcountry`, 自定义平台头等；或者输出 `cookies`（通过解析 `cookie` 头）帮助判断回调丢失是否由域/安全属性造成。

---
调试完成后，若问题定位为平台适配层覆盖 host，可向平台反馈：应保持 `Request.url` 与外部访问域一致，或正确传递 `x-forwarded-host` 供框架使用。
