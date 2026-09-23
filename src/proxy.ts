import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

// Per-request CSP nonce — 2026-09-22 security-headers audit item. Lives here
// (not next.config.ts's static `headers()`) because a nonce must be unique
// per request. Next.js auto-detects a `nonce-...` token in the
// Content-Security-Policy RESPONSE header and stamps it onto its own
// framework-injected hydration/RSC <script> tags — no request-header
// plumbing needed, since nothing in this app renders its own manual inline
// <script> tag that would need to read the nonce back via `headers()`.
// Pattern documented at
// https://nextjs.org/docs/app/guides/content-security-policy.
//
// FIXED 2026-09-23: the previous version reconstructed the incoming request
// via `new NextRequest(request, { headers })` before handing it to
// next-intl's `handleI18nRouting`. That reconstruction silently broke
// next-intl's locale rewrite in production (Vercel's Edge Runtime) — `/`
// kept working (no rewrite needed) but `/privacidade` and even the
// already-prefixed `/pt/privacidade` 404ed, because next-intl's routing
// logic depends on internal state (`nextUrl`, cookies) that a
// hand-reconstructed NextRequest doesn't faithfully reproduce. This version
// never touches the request next-intl sees — it calls
// `handleI18nRouting(request)` with the untouched original request (exactly
// as it worked before this file existed) and only adds the CSP header to
// whatever response next-intl returns (next/rewrite/redirect all accept
// `.headers.set(...)` the same way).
export default function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // 'unsafe-inline' here (confirmed necessary, not assumed): React/Tailwind
    // set inline `style="..."` attributes at runtime (e.g. dynamic values),
    // and CSP hashes/nonces don't cover style ATTRIBUTES (only <style>
    // elements) unless paired with 'unsafe-hashes', which would need a new
    // hash allowlisted per distinct dynamic value — not viable. Confirmed by
    // removing this and seeing "Applying inline style violates..." on every
    // route in a real browser.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const response = handleI18nRouting(request);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
