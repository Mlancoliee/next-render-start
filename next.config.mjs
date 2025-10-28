/** @type {import('next').NextConfig} */
process.env.TZ = 'Asia/Shanghai';

const nextConfig = {
  experimental: {
    ppr: "incremental",
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
