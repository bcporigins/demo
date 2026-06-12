/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/join-team', destination: '/careers', permanent: true }]
  },
}

export default nextConfig
