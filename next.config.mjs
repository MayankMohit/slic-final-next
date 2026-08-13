/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Logos and avatars never change, so keep optimized variants cached for a
    // month instead of re-running the optimizer when the default TTL lapses.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default nextConfig