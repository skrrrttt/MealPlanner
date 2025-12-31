/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure proper routing for Cloudflare Pages
  trailingSlash: true,
}

export default nextConfig
