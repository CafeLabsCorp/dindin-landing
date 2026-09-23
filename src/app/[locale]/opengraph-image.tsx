import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";

// Shared Open Graph/Twitter preview image for the whole `[locale]` tree
// (home, /privacidade, /termos, /excluir-conta all get this same card,
// since none of them defines its own `opengraph-image`) — 2026-09-22
// public-site audit item. One card is the right amount of effort for a
// small institutional site; a distinct image per page isn't worth the
// upkeep here.
export const alt = "Dindin — Café Labs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette pulled from `globals.css` (`:root`, light theme). Fixed to the
// light-mode card on purpose: social scrapers don't send
// `prefers-color-scheme`, so there's no reliable signal to switch on, and a
// single predictable card is better in a feed than one that could go either
// way.
const BACKGROUND = "#faf4ea";
const FOREGROUND = "#211a12";
const MUTED = "#5c5346";
const SUBTLE = "#746a5d";
const CAT_COLORS = ["#2e6f4d", "#c1502e", "#a8660a", "#2e6b78", "#7a4a6b", "#7c7a3a"];

// Same decorative "envelope tab" motif as the hero section
// (`.envelope-tab` in globals.css / `page.tsx`'s `heroTabs`), redrawn here
// with plain positioned `div`s: `next/og`'s renderer (Satori) doesn't read
// the site's CSS file, so the shapes have to be inlined again.
const DECORATIVE_TABS: Array<{
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  rotate: number;
}> = [
  { top: 40, left: 60, rotate: -9 },
  { top: 30, left: 220, rotate: 6 },
  { top: 70, right: 240, rotate: -5 },
  { top: 40, right: 70, rotate: 10 },
  { bottom: 30, left: 140, rotate: 4 },
  { bottom: 20, right: 160, rotate: -7 },
];

// Fetches a Google Fonts TTF at build time so the card actually matches the
// site's typography (Fraunces for the wordmark, Work Sans for the rest).
// `next/font` can't be reused here — it only wires up CSS `@font-face` for
// the app shell, it doesn't hand back raw font bytes, which is what
// `next/og`'s renderer needs. Scoped to the exact characters needed via
// `text=` to keep the request small.
//
// This route is statically optimized (generated once at build time, not per
// request), so the network dependency only affects `next build`, never a
// visitor. If the fetch fails for any reason, the card still renders — just
// with the renderer's built-in fallback font — instead of failing the build.
async function loadGoogleFont(
  family: string,
  text: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(cssUrl, {
      // Google Fonts serves woff2 to modern browsers and ttf/otf to older
      // ones; Satori only accepts ttf/otf/woff, so an old-browser UA is the
      // documented way to request a compatible format.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
    }).then((res) => res.text());

    const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;

    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

async function loadLogo() {
  const svg = await readFile(join(process.cwd(), "public", "dindin-logo.svg"), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tHero, tHeader] = await Promise.all([
    getTranslations({ locale, namespace: "Hero" }),
    getTranslations({ locale, namespace: "Header" }),
  ]);
  const tagline = tHero("title");
  const brandBy = tHeader("brandBy");

  const [logoSrc, frauncesData, workSansData] = await Promise.all([
    loadLogo(),
    loadGoogleFont("Fraunces", "Dindin", 600),
    loadGoogleFont("Work Sans", `${tagline}${brandBy}`, 500),
  ]);

  const fonts = [
    frauncesData ? { name: "Fraunces", data: frauncesData, weight: 600 as const, style: "normal" as const } : null,
    workSansData ? { name: "Work Sans", data: workSansData, weight: 500 as const, style: "normal" as const } : null,
  ].filter((font): font is NonNullable<typeof font> => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BACKGROUND,
          position: "relative",
          fontFamily: "Work Sans",
        }}
      >
        {DECORATIVE_TABS.map((tab, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              ...(tab.top !== undefined ? { top: tab.top } : {}),
              ...(tab.left !== undefined ? { left: tab.left } : {}),
              ...(tab.right !== undefined ? { right: tab.right } : {}),
              ...(tab.bottom !== undefined ? { bottom: tab.bottom } : {}),
              width: 96,
              height: 122,
              borderRadius: "18px 18px 8px 8px",
              border: `2px solid ${CAT_COLORS[index % CAT_COLORS.length]}`,
              opacity: 0.18,
              transform: `rotate(${tab.rotate}deg)`,
              display: "flex",
            }}
          />
        ))}

        {/* next/og renders via Satori, not the browser: it needs a raw
            <img>, not next/image (eslint-config-next already excludes
            opengraph-image/twitter-image routes from no-img-element). */}
        <img src={logoSrc} width={132} height={132} style={{ marginBottom: 8 }} alt="" />

        <div
          style={{
            fontFamily: "Fraunces",
            fontSize: 96,
            fontWeight: 600,
            color: FOREGROUND,
            letterSpacing: -2,
          }}
        >
          Dindin
        </div>
        <div
          style={{
            fontFamily: "Work Sans",
            fontSize: 34,
            fontWeight: 500,
            color: MUTED,
            marginTop: 18,
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontFamily: "Work Sans",
            fontSize: 22,
            fontWeight: 500,
            color: SUBTLE,
            marginTop: 28,
          }}
        >
          {brandBy}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}
