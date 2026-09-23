import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Security headers — 2026-09-22 audit item (see
// mind/tarefas/empresa/dindin.md for the tracked item). Applied to every
// route: this is a static institutional site (no camera/mic/geo, no
// third-party embeds, self-hosted fonts via next/font, same-origin Vercel
// Analytics), so there is no per-route exception carved out on purpose.
// Content-Security-Policy is NOT here — it needs a per-request nonce for
// Next.js App Router's inline hydration scripts, so it is set in
// src/proxy.ts (Next 16's renamed middleware) instead. Everything below is
// static and safe to compute once. Validated empirically (see commit
// message) by building, serving the production build and checking the
// browser console for violations on every route.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
