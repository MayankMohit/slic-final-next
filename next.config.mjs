/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["cdn.sanity.io"],
  },
  compiler: {
    styledComponents: true,
  },
}

export default nextConfig