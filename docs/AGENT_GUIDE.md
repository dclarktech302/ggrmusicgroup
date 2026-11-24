# Agent guide: GGR Music Group site

Agent sessions follow the
[Denkore agent standard](https://github.com/denkoregroup/denkore-orchestrator/blob/main/docs/agents/STANDARD.md).
This file adds what's specific to this repo. Read `AGENTS.md` and the README first. The roadmap
is issue #17.

## Project

- The GGR Music Group site, live at ggrmusic.com: Next.js 16, React 19, TypeScript, Tailwind 4,
  shadcn/ui, pnpm, on Vercel.
- **Every merge to `main` deploys to production.** Other branches get Vercel previews.
- Content lives in `lib/content.ts`. Signups post to a Google Sheets webhook through
  `/api/subscribe`.

## Brand rules

- The name is always "GGR Music Group". Never "Ghost Gang Records".
- No sponsors on the site.
- Nothing invented: no dates, venues, lineups, prices or claims that aren't already on the site
  or given by David.

## Commands

| Check | Command | In the sandbox? |
| --- | --- | --- |
| Install | `pnpm install` | yes |
| Lint | `pnpm lint` | yes |
| Tests | `pnpm test` (Node 22.18 or newer) | yes |
| Types | `pnpm exec tsc --noEmit` | yes |
| Build | `pnpm build` | try it; if it can't fetch something, the Vercel preview builds it |

There's no GitHub Actions CI here: the Vercel preview (team davids-projects) is the build check.
Say in every PR which checks ran locally.

## Photos

New photos go through `pnpm optimize-images` (see the README). Commit the WebP files and the
regenerated `lib/image-manifest.json`; raw originals stay out of git.

## Live systems

Vercel settings and env vars, DNS, the Google Sheets webhook and the komi.io form: ask David
before any change. Never put `GOOGLE_WEBHOOK_URL` or any token in code, logs, issues or PRs.
