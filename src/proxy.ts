import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

// Per-request CSP nonce — 2026-09-22 security-headers audit item. Lives
// here (not next.config.ts's static `headers()`) because a nonce must be
// unique per request: Next.js's App Router streams hydration/RSC payload
// data via inline <script> tags on every page load, and it automatically
// stamps those framework-generated scripts with the nonce carried on the
// REQUEST headers passed to `NextResponse.next()` — no manual wiring needed
// in layout.tsx. Pattern documented at
// https://nextjs.org/docs/app/guides/content-security-policy. Wraps
// next-intl's own routing middleware (renamed `proxy.ts` in Next 16) so the
// nonce/CSP request header still reaches the page render on every code path
// next-intl can take (rewrite for the default locale, or pass-through).
// Validated empirically (see commit message) by building, serving the
// production build, and confirming zero CSP console errors on every route.
export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const requestWithCsp = new NextRequest(request, { headers: requestHeaders });

  const response =
    handleI18nRouting(requestWithCsp) ??
    NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
