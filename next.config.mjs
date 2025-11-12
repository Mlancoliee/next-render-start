/** @type {import('next').NextConfig} */
process.env.TZ = 'Asia/Shanghai';

const nextConfig = {
  experimental: {
    ppr: "incremental",
    // Next 15 中 trustHostHeader 已移除，由 NextAuth 的 trustHost: true 处理
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
