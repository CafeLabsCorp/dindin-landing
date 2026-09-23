import Image from "next/image";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "./[locale]/globals.css";

// The site's only 404 page — 2026-09-22 public-site audit item.
//
// This single root file is what Next.js actually renders for BOTH cases
// that need a 404, confirmed empirically (built + served the production
// build and inspected the response for each):
//   - A broken/unknown link inside a resolved locale (e.g. /pt/nope):
//     Next.js treats "no route matches this URL" as an app-wide unmatched
//     route, which — per Next's own docs — is handled by the root
//     `not-found.js`, not by a `not-found.js` colocated with the dynamic
//     `[locale]` segment. (A nested `not-found.js` only fires from an
//     explicit `notFound()` call thrown by a page/layout inside that
//     segment; nothing in this app does that.) An earlier version of this
//     fix shipped a second, nicer-looking `[locale]/not-found.tsx` before
//     this was verified — it was never actually reachable, so it was
//     removed rather than left as dead code that misrepresents what ships.
//   - An invalid locale segment (e.g. /xx/anything bypassing next-intl's
//     proxy, which normally redirects that case to a valid locale first):
//     `[locale]/layout.tsx` calls `notFound()` before it can render its own
//     <html>/<body>, so Next falls back to this file for the shell too.
//
// There is no root `app/layout.tsx` in this app (`[locale]/layout.tsx`
// doubles as it — see that file), so, per Next's `not-found.js` contract,
// this file has to render its own complete <html>/<body> rather than relying
// on one.
//
// No locale is resolved at this point (this is unmatched-route handling, not
// page rendering — Next's not-found files receive no params, and there is no
// reliable way to recover which locale segment a URL that, by definition,
// didn't resolve to a page was aiming for). Rather than silently defaulting
// to Portuguese for an /en/... URL, both languages are shown together —
// same reasoning as `PtOnlyNotice` in legal/Notices.tsx: the reader's
// language isn't known, so it's on the page itself to be understood either
// way.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default async function RootNotFound() {
  const [tPt, tEn] = await Promise.all([
    getTranslations({ locale: "pt", namespace: "NotFound" }),
    getTranslations({ locale: "en", namespace: "NotFound" }),
  ]);

  return (
    <html
      lang={routing.defaultLocale}
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <header className="h-16 w-full border-b border-border">
          <div className="mx-auto flex h-full max-w-5xl items-center px-6">
            <Link
              href="/"
              className="flex items-center gap-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Image src="/dindin-logo.svg" alt="" width={28} height={28} aria-hidden />
              <span className="text-lg font-semibold">Dindin</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <p aria-hidden="true" className="font-serif text-7xl font-semibold text-primary">
              404
            </p>
            <h1 className="font-serif text-2xl font-semibold sm:text-3xl" lang="pt">
              {tPt("title")}
            </h1>
            <p className="text-base leading-relaxed text-muted" lang="pt">
              {tPt("description")}
            </p>
            <h2 className="font-serif text-xl font-semibold text-subtle sm:text-2xl" lang="en">
              {tEn("title")}
            </h2>
            <p className="text-base leading-relaxed text-muted" lang="en">
              {tEn("description")}
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              {tPt("backHome")} · {tEn("backHome")}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
