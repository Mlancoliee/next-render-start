/** @type {import('next').NextConfig} */
process.env.TZ = 'Asia/Shanghai';

const nextConfig = {
  experimental: {
    ppr: "incremental",
    // 关键：在反向代理（如 EO Pages）前使用时，信任 x-forwarded-host/proto
    // 这样 Next.js 会用这些头重建 request.url，避免在服务端把域名解析为 localhost
    trustHostHeader: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
