/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for better-sqlite3 native bindings in Next.js 14
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
  },
};

export default nextConfig;
