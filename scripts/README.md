# Image pipeline

`pnpm optimize-images [inputs...] [--force] [--thumbs]` turns raw photos into optimized WebP in `public/images` and regenerates `lib/image-manifest.json`. The basic workflow is in the [Images section of the main README](../README.md#images); this page covers the options.

## Options and tuning

- `pnpm optimize-images path/to/file-or-dir` converts specific inputs instead of `./originals`.
- `--thumbs` also writes a 600px-wide `<slug>-thumb.webp` for each image (the manifest records it as `thumb`).
- `--force` rebuilds files that already exist. Without it, an output that is newer than its original is skipped.
- Per-image overrides go in `scripts/image-overrides.json`, keyed by slug: `{ "my-photo": { "maxEdge": 1600, "quality": 75 } }`. The script warns about any output over 400KB, which is the cue to add one.
- **Hand-tuned files:** export a file yourself (e.g. from Squoosh) and put it directly in `public/images/<slug>.webp`. It is never overwritten (the script skips an output newer than its original), and it still gets a manifest entry (dimensions and blur placeholder) on the next `pnpm optimize-images` run, even with no original.
- Logos, favicons and icons (and SVG/ICO/PNG files in `public/images`) are not photos. They are ignored by the script and manifest; just put them in `public/images` and reference them directly.
