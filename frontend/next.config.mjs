import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // These packages are server-only (used in API routes) and must NOT be
  // bundled by webpack — they need Node.js native require() at runtime.
  serverExternalPackages: [
    "bcryptjs",
    "jsonwebtoken",
    "mongoose",
    "nodemailer",
    "@xenova/transformers",
  ],
  // Suppress cross-origin dev warnings from WSL / Docker / LAN access
  allowedDevOrigins: [
    "http://172.28.160.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  webpack: (config) => {
    // Allow files outside the frontend folder (like ../backend/lib/*) to
    // resolve their dependencies from the frontend/node_modules folder.
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'node_modules'),
    ];
    return config;
  },
}

export default nextConfig