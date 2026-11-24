# GGR Music Group

Site for GGR Music Group, an Eastern Shore music group, live at [ggrmusic.com](https://ggrmusic.com). Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and shadcn/ui, deployed on Vercel. Content lives in code, signups go to GGR's komi.io form, and photos go through a WebP pipeline you run before committing.

## Run it locally

You need Node.js and pnpm.

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

No environment variables are needed. The other scripts are in [`package.json`](package.json). `pnpm test` needs Node 22.18 or newer.

## Project structure

- `app/`: the routes (`/`, `/shows`, and `/subscribe`, which redirects to the komi.io form).
- `components/`: page sections. `home/` is the home hero and `ui/` holds small primitives.
- `lib/`: site content (`content.ts`) and its types (`types.ts`, including `GgrEvent`, the featured event), the komi.io signup link (`signup.ts`), the image manifest, and the map-link helpers with their tests.
- `scripts/`: the image pipeline ([options](scripts/README.md)).
- `public/images/`: optimized photos plus logos and icons.
- `originals/`: raw photos for the pipeline. Gitignored.

To change the featured event, edit `getHomeContent()` in `lib/content.ts`.

## Images

Photos are optimized before they are committed and served through `next/image`.

1. Drop the raw photos (JPG, PNG or TIFF) in `originals/`. It is gitignored, so keep your own backup.
2. Run `pnpm optimize-images`. Each photo is auto-rotated, its long edge capped at 2000px (never upscaled), and written as WebP to `public/images/<slug>.webp`. The slug is the lowercased, dash-separated filename: `IMG_4045.jpeg` becomes `img-4045`.
3. Commit the new files in `public/images` and the regenerated `lib/image-manifest.json`.
4. Reference the image by slug in `lib/content.ts`. The manifest supplies its width, height and blur placeholder:

   ```ts
   { id: 'crowd', alt: '…', ...imageFields('my-photo-slug') }
   ```

   Slugs are typed, so a typo fails at compile time. Don't import the manifest in a client component; pass the values down as props.

Flags, per-image overrides and hand-tuned files are in [scripts/README.md](scripts/README.md).

## Deployment

Vercel deploys from this repo: commits to `main` go to production at ggrmusic.com, and other branches get preview deployments.

## Working with AI agents

`CLAUDE.md` imports `AGENTS.md`, which tells agents to read the Next.js docs in `node_modules/next/dist/docs/` before writing code.
