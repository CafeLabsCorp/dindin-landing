# dindin-landing

**[Leia em Português](README.pt-br.md)**

Download landing page for [Dindin](https://github.com/CafeLabsCorp/dindin), Café
Labs' budget-envelope personal finance app. Static site (Next.js), hosted
separately from the real app, at `dindin.cafelabs.net` — its own visual identity
("Warm Envelope"), inherited 1:1 from the app, not the portfolio's or Café Labs
institutional site's.

Includes an interactive client-side demo (`CaixinhasDemo.tsx`) that lets you play
with balance/allocation/transfer between envelopes without opening the real app.
Available in Portuguese (default) and English (`next-intl`, `/pt` and `/en`
routing, language switcher in the header).

## Stack

| Layer           | Technology                                                            |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19                                       |
| Styling         | Tailwind CSS v4 (tokens via `@theme inline` in `globals.css`)           |
| Typography      | Fraunces (headings) + Work Sans (body), via `next/font/google`         |
| i18n            | `next-intl` (PT default, EN, `/[locale]` routing)                       |
| Language        | TypeScript                                                              |
| Lint            | ESLint (`eslint-config-next`)                                           |
| Hosting/deploy  | Vercel, automatic deploy on every push to `main`                        |

Same stack pattern as the institutional site (`cafelabs-portifolio`) and
`domo-landing`.

## Running locally

Prerequisite: Node.js 20+ (tested with v20.20.1).

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. Other scripts: `npm run build` (production
build), `npm run start` (serves the build), `npm run lint`.

## Folder structure

```
src/
  proxy.ts                # next-intl middleware — reads the locale from the URL
  i18n/                    # routing.ts, navigation.ts, request.ts
  app/
    favicon.ico            # outside [locale], doesn't vary by language
    [locale]/
      layout.tsx           # root layout: fonts (Fraunces/Work Sans), metadata
      page.tsx              # single route (/): header, hero, download, demo, features, footer
      LanguageSwitcher.tsx  # language switcher in the header
      CaixinhasDemo.tsx     # interactive client-side envelopes demo
      globals.css           # design tokens ("Warm Envelope") + Tailwind v4
messages/
  pt.json                  # Portuguese copy
  en.json                  # English copy
public/
  dindin-logo.svg
```

Routes: `/pt` and `/en` (root `/` redirects to the default locale).

## Documentation

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — route/component structure and the
  envelopes demo's state logic.
- [`docs/DESIGN.md`](docs/DESIGN.md) — "Warm Envelope" identity tokens
  (color, typography, shape).
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — Vercel deploy and `dindin.cafelabs.net`
  DNS.

No `docs/BACKEND.md`: this repo has no backend of its own — it's a static
site, no API calls or persistence (the demo runs entirely in browser memory).

## Status

- [x] Hero, features, and download section.
- [x] "Web" button active, linking to the real app (`app.dindin.cafelabs.net`).
- [x] Interactive envelopes demo (`CaixinhasDemo.tsx`).
- [x] Café Labs landing structural pattern applied (100dvh hero, scroll
      indicator, above-the-fold product access) — see `docs/ARQUITETURA.md`.
- [x] PT/EN internationalization with `next-intl`, switcher in the header.
- [x] Live at `dindin.cafelabs.net` (Vercel) — see `docs/DEPLOY.md`.
- [ ] Windows download — "coming soon" placeholder, pending packaging decision
      (zip vs. Inno Setup).
- [ ] Android download — "coming soon" placeholder, pending decision on where
      to host the release `.apk`.
