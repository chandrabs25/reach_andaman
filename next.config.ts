/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  output: 'out', // Or any other directory you prefer
   images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
