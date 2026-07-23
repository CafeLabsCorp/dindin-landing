**[Leia em Português](DESIGN.pt-br.md)**

# Design — "Warm Envelope" identity

This landing inherits the Dindin app's visual identity 1:1
(`/home/felip/projetos/dindin/docs/DESIGN.md`) — same palette, same
typography, contrast already verified there (WCAG 2.1, manual
luminance/contrast calculation). The values below are the same hex codes, they
just **must not be re-derived here**: any palette change originates in the app
and is replicated to this landing, not the other way around.

**Name mapping:** the app calls the third color role `tertiary`; this landing
uses `accent` for the same role (same value, `#C1502E`/`#F0916A`). Aside from
that rename, the tokens are equivalent 1:1.

## Color

Implemented as CSS custom properties in `src/app/[locale]/globals.css`
(`:root` for light mode, `@media (prefers-color-scheme: dark)` for dark),
mapped to Tailwind v4 via `@theme inline`.

### Light

| Token (`globals.css`)                | Hex                        | Role                                                |
| ------------------------------------- | -------------------------- | ---------------------------------------------------- |
| `--background`                        | `#FAF4EA`                  | Page background — warm ivory ("the table")           |
| `--surface`                           | `#FFFFFF`                  | Cards ("paper")                                       |
| `--foreground`                        | `#211A12`                  | Primary text                                          |
| `--muted`                             | `#5C5346`                  | Secondary text                                        |
| `--subtle`                            | `#746A5D`                  | Tertiary text/captions                                |
| `--border`                            | `rgba(33,26,18,0.12)`      | Decorative hairline                                   |
| `--primary`                           | `#2E6F4D` ("Verde Cofre")  | Brand — header CTA/links, focus                       |
| `--primary-foreground`                | `#FFFFFF`                  | Text on `primary`                                     |
| `--primary-container`                 | `#D7EBDD`                  | Tonal fill ("Available now" badge)                    |
| `--primary-container-foreground`      | `#14392A`                  | Text on `primary-container`                           |
| `--secondary`                         | `#6B7A5E`                  | Sage — "unallocated" progress bar                     |
| `--accent`                            | `#C1502E` ("Terracota")    | Primary CTA ("Open Dindin on the web") — rare use      |
| `--accent-foreground`                 | `#FFFFFF`                  | Text on `accent`                                      |
| `--status-warning`                    | `#A8660A`                  |                                                        |
| `--status-critical`                   | `#C13B3B`                  | Demo validation errors                                |
| `--status-good`                       | `#2F7D3B`                  | Positive deltas in the demo                           |

### Dark

| Token                             | Hex          |
| ---------------------------------- | ------------ |
| `--background`                     | `#16130F`    |
| `--surface`                        | `#201C17`    |
| `--foreground`                     | `#F5F1EA`    |
| `--muted`                          | `#C9C2B4`    |
| `--subtle`                         | `#A79C89`    |
| `--border`                         | `rgba(245,241,234,0.12)` |
| `--primary`                        | `#7FCB9E`    |
| `--primary-foreground`             | `#0D3320`    |
| `--primary-container`              | `#1F4732`    |
| `--primary-container-foreground`   | `#BEE8CE`    |
| `--secondary`                      | `#A9B896`    |
| `--accent`                         | `#F0916A`    |
| `--accent-foreground`              | `#431507`    |
| `--status-warning`                 | `#E0A542`    |
| `--status-critical`                | `#E8746A`    |
| `--status-good`                    | `#6FCB82`    |

In dark mode, `--shadow-card` becomes `none` — elevation relies solely on the
hairline + `surface` already being a step lighter than `background` (cards
don't "float" via shadow in dark mode).

### Categorical palette (color per envelope)

8 colors, used as a dot/left-border next to the envelope's name — never as
the sole carrier of meaning (the name is always shown alongside it):

| Token     | Name           | Light     | Dark      |
| --------- | -------------- | --------- | --------- |
| `--cat-1` | Verde Cofre    | `#2E6F4D` | `#5FAE80` |
| `--cat-2` | Terracota      | `#C1502E` | `#E2896A` |
| `--cat-3` | Âmbar          | `#A8660A` | `#E0A542` |
| `--cat-4` | Azul Petróleo  | `#2E6B78` | `#4E96A3` |
| `--cat-5` | Ameixa         | `#7A4A6B` | `#A87CA0` |
| `--cat-6` | Vinho          | `#A23B3B` | `#D06868` |
| `--cat-7` | Oliva          | `#7C7A3A` | `#ACA85C` |
| `--cat-8` | Argila Rosada  | `#B97064` | `#D69C90` |

On the landing, `--cat-1`/`--cat-2`/`--cat-3` are used by the demo's 3
envelopes (Verde Cofre/Terracota/Âmbar); the other 5 only appear in the
hero's decorative "envelope tabs" (`--cat-4` through `--cat-7`).

## Typography

Loaded via `next/font/google` in `src/app/[locale]/layout.tsx` (self-hosted
at build time — no network request at runtime, no latency/offline
trade-off):

- **Fraunces** (`--font-fraunces`, weights 400/600) — warm serif, used only
  in the hero H1 and two section headings ("Get Dindin", "How budget
  envelopes work"). Mapped to `--font-serif` in `@theme inline`.
- **Work Sans** (`--font-work-sans`, weights 400/500/600) — body, buttons,
  labels, everywhere else on the page. Mapped to `--font-sans`.

Fraunces is reserved for a few purposeful headings — it's the element that
most differentiates the page from a generic template, and loses its impact if
used everywhere.

## Shape / spacing

There's no dedicated spacing-tokens file (nor a custom `tailwind.config`) —
the page uses Tailwind v4's default scale (`px-6`, `py-16`, `gap-4`, etc.)
directly. Conventions observed in the code:

- **Cards:** `rounded-2xl` (16px) + `border border-border` + `shadow-card`
  (`0 1px 3px rgba(33,26,18,.08), 0 1px 2px rgba(33,26,18,.06)` in light,
  `none` in dark) — `--shadow-card` variable, `.shadow-card` utility class.
- **Buttons/CTAs and pills ("Available now" badge, demo delta pill):** fully
  rounded (`rounded-full`), minimum height `h-11`/`h-12`.
- **Demo inputs/selects:** `rounded-xl` (12px), `h-11`.
- **Hero's decorative "envelope tabs"** (`.envelope-tab`, `globals.css`):
  `border-radius: 14px 14px 6px 6px` — squarer bottom corners than top ones,
  an envelope silhouette; always `aria-hidden` and hidden below 720px.
- **Card hover** (`.card-hover`): `translateY(-2px)` + shadow transition,
  gated by `prefers-reduced-motion: no-preference`.
- **Visible focus:** `outline: 2px solid var(--primary)`,
  `outline-offset: 2px` on any element with `:focus-visible`.

## Motion

Every animation/transition in the file is conditioned on
`@media (prefers-reduced-motion: no-preference)` — never applied
unconditionally:

- `scroll-behavior: smooth` on `html` (hero scroll indicator).
- `.scroll-cue` — subtle bounce on the "see how it works" arrow.
- `.value-pulse` — 420ms scale-up when a demo value changes.
- `.delta-pill` — 250ms fade in/out of the "+R$ X"/"R$ -X" next to the value.
