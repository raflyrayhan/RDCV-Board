/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      'drive-thirdparty.googleusercontent.com',
      'lh3.googleusercontent.com',
      'ssl.gstatic.com',
      'www.gstatic.com',
    ],
  },

  async headers() {
    return [
      {
        // ONLY for your API routes (or wherever you actually need COEP/COOP)
        source: '/api/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

export default nextConfig;
