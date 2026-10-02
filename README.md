This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
