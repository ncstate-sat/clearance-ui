/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/clearances/assign',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
