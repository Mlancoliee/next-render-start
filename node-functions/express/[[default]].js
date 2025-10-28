import express from "express";
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log(`[2025-08-22T06:34:12.160Z] ${req.method} ${req.url}`);
  next();
});

// 启用 JSON 请求体解析
app.use(express.json());

// 添加根路由处理
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Node Functions!" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express on Node Functions! hello" });
});

app.get("/test", (req, res) => {
  res.json({ message: "Hello from Express on Node Functions! test" });
});

// 健康检查：体现最基础的路由
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 查询参数：/greet?name=Alice
app.get("/greet", (req, res) => {
  const { name = "Guest" } = req.query;
  res.json({ message: `Hello, ${name}!` });
});

// 路径参数：/users/123
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ userId: id, message: `Fetched user ${id}` });
});

// POST JSON：回显请求体
app.post("/echo", (req, res) => {
  res.json({ received: req.body ?? null });
});

// 路由级中间件：简单鉴权示例（仅演示用途）
const requireApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (apiKey !== "secret-demo-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/admin", requireApiKey, (req, res) => {
  res.json({ message: "Welcome, admin" });
});

// 主动抛错：测试错误处理中间件
app.get("/error", (req, res) => {
  throw new Error("Intentional error for demo");
});

// 404 兜底
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// 统一错误处理
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// 导出处理函数
export default app;