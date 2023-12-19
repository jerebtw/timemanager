const POCKETBASE_URL = new URL(process.env.NEXT_PUBLIC_POCKETBASE_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: POCKETBASE_URL.protocol.replace(":", ""),
        hostname: POCKETBASE_URL.hostname,
        port: POCKETBASE_URL.port,
      },
    ],
  },
};

export default nextConfig;
