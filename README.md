# GGR Music Group

Site for GGR Music Group, an Eastern Shore music group, live at [ggrmusic.com](https://ggrmusic.com). Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and shadcn/ui (configured in `components.json`), deployed on Vercel. Event details and photo content live in code (`lib/content.ts`), the `/subscribe` form posts to a Google Sheets webhook, and photos go through a WebP pipeline that you run before committing (see Images).

## Getting started

You need Node.js and [pnpm](https://pnpm.io). The repo has a `pnpm-lock.yaml`, so install with pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The dev server runs at http://localhost:3000.

### Environment variables

`.env.example` lists every variable the code reads. Copy it to `.env.local` and fill it in. `.env*` files are gitignored except `.env.example`.

| Variable | What it does |
| --- | --- |
| `GOOGLE_WEBHOOK_URL` | URL of a Google Apps Script web app that feeds the subscriber Google Sheet. `POST /api/subscribe` validates the signup form and forwards it here as JSON. Required for signup: if it is missing, the route logs an error and returns a 500. The rest of the site does not read it. |

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (`next dev`). |
| `pnpm build` | Production build (`next build`). |
| `pnpm start` | Serve the production build (`next start`). Run `pnpm build` first. |
| `pnpm lint` | Run ESLint. |
| `pnpm optimize-images` | Convert raw photos in `originals/` to WebP and regenerate the image manifest. See Images. |
| `pnpm test` | Run the unit tests in `lib/` with Node's built-in test runner (`node --test`). They cover `lib/platform.ts` and `lib/maps.ts`. The test files import `.ts` directly, which needs Node 22.18 or newer. |

## Project structure

The `@/` import alias points at the repo root (see `tsconfig.json`).

| Path | What lives there |
| --- | --- |
| `app/` | Next.js App Router. `page.tsx` is the home page, `shows/` and `subscribe/` are the other pages, and `api/subscribe/route.ts` validates the signup form and posts it to the Google Sheets webhook. `layout.tsx` sets fonts and metadata and renders Vercel Analytics and Speed Insights. `globals.css` holds the Tailwind setup, the GGR colour and font tokens, and the keyframes used by the home hero. |
| `components/` | Page sections such as `header.tsx`, `footer.tsx`, `features-12.tsx` (the "What We Offer" section on the home page), `content-5.tsx` and `simple-lightbox.tsx` (the `/shows` page) and `form.tsx` (the `/subscribe` form). `home/` holds the home hero (`ggr-hero.tsx` composes the photo mosaic and lightbox, headline, call to action, ticker, next-up block and the venue strip with its map chooser). `ui/` holds a few small UI primitives. |
| `lib/` | `content.ts` (site content), `types.ts` (the shapes of that content and of the signup form), `images.ts` plus the generated `image-manifest.json` (image dimensions and blur placeholders), `maps.ts` and `platform.ts` (map links and device detection for the venue chooser, with `*.test.mjs` tests) and `utils.ts` (the `cn` class-name helper). |
| `scripts/` | `optimize-images.mjs` and `image-overrides.json`, the image pipeline described below. |
| `public/images/` | Optimized photos (WebP) plus logos and icons. |
| `originals/` | Raw photos that feed the image pipeline. Gitignored, so it only exists on your machine. |

### Where content lives

There is no CMS or database. Site content is defined in `lib/content.ts`, as async functions so the source could change later without touching components: `getHomeContent()` for the home hero, `getShowsContent()` for the `/shows` page and `getOfferImages()` for the "What We Offer" section. The shapes are declared in `lib/types.ts`.

The home page features one event, not a list of shows. It is a `GgrEvent`, held in `HomeContent.event`:

| Field | Meaning |
| --- | --- |
| `title` | Event name, for example "Ghostfest 4". |
| `editionLabel` | Series and edition label used in the eyebrow text. |
| `date` | ISO calendar date, for example `2026-10-24`. |
| `doorsTime` | Doors time as display text. |
| `venueName`, `venueShortName` | Full and short venue names. |
| `venueAddress` | Street address, used to build the map links. |
| `city`, `state` | Location shown under the venue name. |

The "next up" block, the scrolling ticker and the venue strip are all built from that one object. To change the featured event, edit `event` in `getHomeContent()`. `HomeContent` also carries the hero photos (`photos`, see Images) and the call-to-action link (`ctaHref`). The `/shows` page currently shows photo galleries (`ShowsContent` has `featured` and `gallery` images), not event listings.

Two signup paths exist: the hero call to action goes to `/subscribe`, which posts to `/api/subscribe`, while the "Subscribe Now" button further down the home page links to an external form hosted on komi.io (see `app/page.tsx`).

## Images

Photos are optimized once, before they are committed, and served through `next/image`.

1. Drop the raw photos (JPG/PNG/TIFF) in `/originals`. This folder is gitignored, so keep your own backup of the files.
2. Run `pnpm optimize-images`. Each photo is auto-rotated, its **long edge** capped at 2000px (never upscaled), and written as WebP (quality 80) to `public/images/<slug>.webp`. The slug is the lowercased, dash-separated filename: `IMG_4045.jpeg` becomes `img-4045`.
3. Commit the new files in `public/images` and the regenerated `lib/image-manifest.json`.
4. Reference the image by slug. The manifest holds each image's real `width`, `height` and a tiny `blurDataURL`, so nothing is hardcoded:

   ```ts
   import { imageFields } from '@/lib/images';

   // in lib/content.ts: fills thumbSrc, fullSrc, width, height and blurDataURL
   { id: 'crowd', label: 'PHOTO · CROWD', alt: '…', gradient: '…', ...imageFields('my-photo-slug') }
   ```

   `ImageSlug` is a type generated from the manifest, so a typo fails at compile time. Don't import `lib/image-manifest.json` from a client component; pass the values down as props.

Options and tuning:

- `pnpm optimize-images path/to/file-or-dir` converts specific inputs instead of `./originals`.
- `--thumbs` also writes a 600px-wide `<slug>-thumb.webp` for each image (the manifest records it as `thumb`).
- `--force` rebuilds files that already exist. Without it, an output that is newer than its original is skipped.
- Per-image overrides go in `scripts/image-overrides.json`, keyed by slug: `{ "my-photo": { "maxEdge": 1600, "quality": 75 } }`. The script warns about any output over 400KB, which is the cue to add one.
- **Hand-tuned files:** export a file yourself (e.g. from Squoosh) and put it directly in `public/images/<slug>.webp`. It is never overwritten (the script skips an output newer than its original), and it still gets a manifest entry (dimensions and blur placeholder) on the next `pnpm optimize-images` run, even with no original.
- Logos, favicons and icons (and SVG/ICO/PNG files in `public/images`) are not photos. They are ignored by the script and manifest; just put them in `public/images` and reference them directly.

## Deployment

The site deploys on Vercel from this GitHub repository. A commit on `main` deploys to production at ggrmusic.com (which redirects to www.ggrmusic.com), and a commit on any other branch gets a preview deployment. There is no `vercel.json`; the project uses Vercel's Next.js preset.

Environment variables are not stored in the repo, so production and previews read them from the Vercel project's Environment Variables settings. Set `GOOGLE_WEBHOOK_URL` there, or signups will fail.

`app/layout.tsx` renders Vercel Web Analytics and Speed Insights. Their `/_vercel/...` scripts only exist on Vercel, so they return 404 when you run the site locally; that is expected. To check a production build locally, run `pnpm build` and then `pnpm start`.

## Working with AI agents

`CLAUDE.md` imports `AGENTS.md`. `AGENTS.md` warns that this version of Next.js has breaking changes compared with what a model may remember, and tells agents to read the relevant guide in `node_modules/next/dist/docs/` before writing code, so run `pnpm install` first.
