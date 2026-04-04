import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Absolute app root (avoids Turbopack using a parent folder like the user home as resolve context). */
const projectDir = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: isProd
      ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://ui-avatars.com https://github.com https://media.licdn.com data:; font-src 'self'; connect-src 'self' https://github-contributions-api.jogruber.de https://vitals.vercel-insights.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests;"
      : "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https://ui-avatars.com https://github.com https://media.licdn.com data:; font-src 'self'; connect-src 'self' ws://localhost:3000 wss://localhost:3000 https://github-contributions-api.jogruber.de; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self';",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: projectDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
  async headers() {
    // In development, don't send strict security headers so Next.js dev tools work normally.
    if (!isProd) {
      return [];
    }

    // In production (e.g. gagah.tech), apply strict security headers.
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
