**[Leia em Português](DEPLOY.pt-br.md)**

# Deploy

## Where it runs

- **Hosting:** Vercel, via the Git integration (not the CLI — there's no
  `.vercel/` in this environment nor a `vercel.json` in the repo, so the
  project-Vercel↔repo connection was made from the dashboard, not via a local
  `vercel link`).
- **Remote repository:** `https://github.com/CafeLabsCorp/dindin-landing.git`
  (`CafeLabsCorp` organization), `main` branch tracking `origin/main`.
- **Domain:** `dindin.cafelabs.net`. Confirmed by direct DNS resolution in
  this environment: the subdomain is a `CNAME` to `<hash>.vercel-dns-017.com`,
  which resolves to Vercel's anycast IPs (`64.29.17.65` / `216.198.79.65`) —
  in other words, the domain really does point to Vercel, it's not just a
  documented intent.
- **Real app** (not this repo): `app.dindin.cafelabs.net`, on Firebase
  Hosting (project `dindin-cafelabs`) — the landing's "Web" button links
  there.

TODO: confirmar which provider/DNS the `cafelabs.net` domain is registered
and managed under (registrar + DNS zone) — not verifiable from this repo
alone; confirm directly with the provider's panel or whoever administers the
domain.

## Pipeline

No CI of its own in this repo (there's no `.github/workflows/`, unlike the
`dindin` app, which runs `flutter analyze`/`flutter test` in CI). The
"pipeline" is entirely Vercel's automatic build:

1. Push (or merge) to `main` on GitHub.
2. Vercel's Git integration detects the push and triggers an automatic build
   (`npm install` + `next build`, per `package.json`).
3. Build passes → automatic production deploy, at the `dindin.cafelabs.net`
   domain. There is no manual approval step.

There's no `npm run lint`/`npm run build` running as a mandatory gate before
merge (no CI blocks it); running them locally before pushing to `main` is up
to whoever commits. Consistent with Felipe's workflow of committing directly
to `main` without a feature branch/PR.

## Environments

Only production exists. Vercel would also generate automatic "Preview
Deployments" for any branch/PR that isn't `main`, but since this project's
actual workflow is always committing directly to `main` (no feature
branches), that isn't used in practice today.

TODO: confirmar whether environment variables are configured in the Vercel
dashboard — there's no `.env*` in the repo (only listed in `.gitignore`) and
the code doesn't read any `process.env.*` today, so there's probably no
variable needed, but this isn't 100% verifiable without dashboard access.

## Rollback

There's no rollback script in this repo (unlike the `dindin` app, which has
`scripts/deploy.sh` with backup gates). To revert a problematic deploy:

- **Vercel dashboard** → `dindin-landing` project → "Deployments" tab →
  previous (known-good) deploy → "Promote to Production". No need to revert
  the Git commit for this — Vercel keeps previous builds ready for
  promotion.
- Alternatively, revert the problematic commit on `main`
  (`git revert <commit>`) and push — this triggers a new automatic build.

## Notes

- No uptime/error monitoring configured for this landing — it's a static
  page with no server logic, so the failure surface is small (a broken build
  is visible in the Vercel dashboard right at push time).
- Since there's no backend/API in this repo, there are no secrets/credentials
  to manage here besides any of Vercel's own build variables (none identified
  in the code today).
