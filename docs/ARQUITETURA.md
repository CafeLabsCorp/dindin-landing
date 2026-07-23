**[Leia em Português](ARQUITETURA.pt-br.md)**

# Architecture

> TODO: confirmar — this document was written before the i18n restructure
> (commit `12694cb`, 2026-07-22), which moved files under `src/app/[locale]/*`
> and replaced most hardcoded copy with `next-intl` translation keys (it also
> added `LanguageSwitcher.tsx` and a locale routing layer under `src/i18n/` and
> `src/proxy.ts`). The paths and code snippets below reflect the
> pre-restructure layout and may be stale in places (e.g. `Caixinha` no longer
> has a `name` field — envelope names are now resolved via translation keys).
> Recommend a follow-up pass to bring this doc in line with the current
> structure.

Single-page static landing (Next.js App Router). No backend of its own, no API
calls, no database — all page "state" lives in the browser and is lost on
every refresh (including, by design, in the demo).

## Routes

A single route: `/` (`src/app/page.tsx`). There are no other pages, no dynamic
routes, no API routes.

## Components

### `layout.tsx` — root layout

Loads the two fonts via `next/font/google` (self-hosted at build time, no
network request at runtime):

- **Fraunces** (`--font-fraunces`) — weights 400/600, headings.
- **Work Sans** (`--font-work-sans`) — weights 400/500/600, body/UI.

Defines `metadata` (title/description) and applies the font variables + base
classes (`antialiased`, `min-h-full flex flex-col`, `bg-background
text-foreground`) on `<html>`/`<body>`.

### `page.tsx` — page composition

Server Component (no `"use client"`), assembles the entire page in a single
function, with no state of its own:

1. **Header** (fixed `h-16` height, not overlaid) — logo + "Dindin" wordmark on
   the left, "by Café Labs" link on the right.
2. **Hero** — `min-h-[calc(100dvh-4rem)]` (100dvh minus the header height),
   with 6 decorative "envelope tabs" (`.envelope-tab`, `aria-hidden`) scattered
   behind the central content: logo, H1, subtitle, "Open Dindin on the web" CTA
   (links to the real app, `https://app.dindin.cafelabs.net`) and an anchor
   link "see how it works ↓" (`.scroll-cue`, subtle bounce gated by
   `prefers-reduced-motion`) that scrolls down to the download section.
3. **"Download Dindin" section** — right below the hero (not at the bottom of
   the page, on purpose — see the structural-pattern note below). Three
   cards: "Web" (active, links to the app), "Windows" and "Android" (both
   "coming soon" placeholders, `border-dashed`, no link).
4. **`<CaixinhasDemo />`** — anchor `#caixinhas`, see the dedicated section
   below.
5. **Features section** — grid of 3 static cards (income allocated instantly,
   spending in the right place, backup/restore).
6. **Footer** — brand line + GitHub link and contact email.

This page follows the **Café Labs landing structural pattern** (hero always
100vh/100dvh, animated scroll indicator, quick access to "use the product"
right above or immediately below the hero, `scroll-behavior: smooth` gated by
`prefers-reduced-motion`) — the same pattern later applied to `mind-landing`,
`forge-skill-library`, `cafelabs-portifolio`, and `domo-landing`. This was the
first landing to receive this structure (2026-07-17).

### `CaixinhasDemo.tsx` — interactive demo

Client Component (`"use client"`) — the only part of the page with state.
Simulates, entirely in memory, the app's three real operations: adding
balance, allocating between envelopes, and transferring between envelopes.

**Data model (local, fixed seed):**

```ts
type CaixinhaId = "verde" | "terra" | "ambar";
interface Caixinha { id: CaixinhaId; name: string; color: string; balance: number }

const SEED_CONTA = 500;
const SEED_CAIXINHAS = [
  { id: "verde", name: "Verde Cofre", balance: 0 },
  { id: "terra", name: "Terracota",   balance: 0 },
  { id: "ambar", name: "Âmbar",       balance: 0 },
];
```

**React state (all local to the component, nothing persisted):**

- `conta: number` — unallocated balance.
- `caixinhas: Caixinha[]` — the 3 seed envelopes.
- `mode: "add" | "alocar" | "transferir"` — which of the 3 forms is visible
  (switched via tab-like buttons, `aria-pressed`).
- One `(value, error)` state pair per form (`addValor`/`addError`,
  `alocarDestino`/`alocarValor`/`alocarError`,
  `transfOrigemRaw`/`transfDestinoRaw`/`transfValor`/`transfError`).
- `liveMessage: string` — text announced via an `aria-live="polite"` region
  (`role="status"`, visually hidden) on every action, for parity with screen
  reader users.

**Business rules replicated from the real app's logic (simpler, without
persistence):**

- `handleAddSubmit` — adds `val` to `conta`. Validates `val > 0`.
- `handleAlocarSubmit` — subtracts from `conta`, adds to the destination
  envelope. Validates `val > 0` and `val <= conta` (doesn't allow allocating
  more than the available balance).
- `handleTransferirSubmit` — subtracts from the source envelope, adds to the
  destination one. Validates `val > 0` and `val <= origem.balance`.
- **Source/destination selection in "transfer" is derived, not stored
  directly:** `eligibleOrigins` filters only envelopes with `balance > 0`;
  `effectiveOrigem`/`effectiveDestino` are recomputed on every render from
  whatever the user picked (`transfOrigemRaw`/`transfDestinoRaw`), but fall
  back to the first eligible item if the previous choice is no longer valid
  (e.g. the chosen source's balance hit zero). This structurally prevents
  transferring out of an empty envelope or into itself, instead of validating
  that after the fact.
- `handleReset` — restores all state to the initial seed (clones
  `SEED_CAIXINHAS` so as not to mutate the original array).

**Visual feedback (`useDeltaPill` / `usePulse`, hooks local to the file):**

- `usePulse()` — exposes a `pulseId` that increments on every change; the
  corresponding number is remounted with `key={pulseId}` and a `.value-pulse`
  class (subtle scale-up, gated by `prefers-reduced-motion`), restarting the
  animation on every new value.
- `useDeltaPill()` — shows a "pill" for ~1.4s with the formatted delta (`+R$
  150,00` or `R$ -150,00`, via `fmtDelta`) next to the number that changed,
  with fade in/out (`.delta-pill`, also gated by reduced-motion).
- Each envelope and the account have their own instance of both hooks
  (`deltaById`/`pulseById`, indexed by `CaixinhaId`).

**Additional accessibility:**

- Focus automatically moves to the first field/`select` of the form whenever
  `mode` changes (via `formAreaRef` + `useEffect`, skipping the first render
  so it doesn't steal focus on page load).
- Validation errors use `role="alert"`.
- Explicit notice that the demo is only a local preview: "values aren't
  saved. Refreshing the page resets everything." — plus a "Reset demo"
  button.

**Persists nothing** — no `localStorage`, no cookie, no network call. It's
entirely disposable by design (the same reasoning was later replicated in the
`domo-landing` demo, which cites this implementation as an anti-reference for
a simpler interaction, see that other repo's `docs/DESIGN.md`).

## Global state/data

There is no global state manager (Context, Redux, Zustand, etc.) — the only
dynamic state on the whole page is local to `CaixinhasDemo`. Everything else
is static content hardcoded in `page.tsx` (the `heroTabs`/`features` arrays).

## Technical decisions and why

- **No custom `next.config.ts`** (the file is the default boilerplate) —
  there's no need for rewrites, redirects, external images, or
  `output: "export"`; deployment uses Next's default build on Vercel.
- **Design tokens via CSS custom properties + `@theme inline` (Tailwind v4)**,
  not a `tailwind.config.*` file — this is Tailwind v4's native mechanism, and
  the same one used by `domo-landing`. See `docs/DESIGN.md` for the values.
- **No animation framework** (Framer Motion, etc.) — the few animations
  (value pulse, delta pill, scroll cue bounce) are plain CSS, always gated by
  `@media (prefers-reduced-motion: no-preference)`.
- **`@/*` alias → `./src/*`** configured in `tsconfig.json` but not used
  today in the code (there's only one relative import, `./CaixinhasDemo`) —
  available for when the project grows beyond a single component per folder.

## Non-obvious constraints

- The demo is **entirely client-side and ephemeral by design** — don't try to
  "fix" this by adding persistence unless someone asks for it; the "values
  aren't saved" message is a product choice, not a limitation to solve.
- The color hex values in `globals.css` **must not be re-derived** — they're
  copied 1:1 from `dindin/docs/DESIGN.md` (the app's identity spec, contrast
  already verified there). Any palette change should originate in the app and
  be replicated here, not the other way around — see the "Consumed by"
  section in `dindin-landing.md` in the Mind
  (`/home/felip/projetos/mind/projetos/produtos-cafelabs/dindin-landing.md`).
