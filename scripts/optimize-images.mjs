#!/usr/bin/env node
/**
 * Image optimization pipeline.
 *
 *   pnpm optimize-images [inputs...] [--force] [--thumbs]
 *
 * Reads photos from the given files/dirs (default: ./originals), auto-rotates from EXIF,
 * caps the LONG edge (default 2000px, never upscales), writes WebP (default q80) with a
 * slugified name to public/images, then regenerates lib/image-manifest.json from everything
 * in public/images (width, height, blurDataURL, optional thumb) so components never hardcode
 * dimensions. Per-image overrides live in scripts/image-overrides.json, keyed by output slug.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public/images');
const MANIFEST_PATH = path.join(ROOT, 'lib/image-manifest.json');
const OVERRIDES_PATH = path.join(ROOT, 'scripts/image-overrides.json');
const DEFAULT_INPUT = 'originals';

const DEFAULTS = { maxEdge: 2000, quality: 80 };
const THUMB_WIDTH = 600;
const BLUR_EDGE = 10;
const WARN_BYTES = 400 * 1024;

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.avif']);
const MANIFEST_EXTS = new Set(['.webp', '.avif', '.jpg', '.jpeg']);
// Logos, favicons and icons are not photos: never converted, never put in the manifest.
const NON_PHOTO = /(^|[-_ ])(logo|favicon|icon|apple-touch|android-chrome|cloudmark|sprite)([-_. ]|$)/i;
const THUMB_SUFFIX = '-thumb';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const inputs = args.filter((a) => !a.startsWith('--'));
const force = flags.has('--force');
const thumbs = flags.has('--thumbs');

if (flags.has('--help')) {
    console.log('Usage: pnpm optimize-images [inputs...] [--force] [--thumbs]\nSee README.md ("Images").');
    process.exit(0);
}
for (const f of flags) {
    if (!['--force', '--thumbs', '--help'].includes(f)) {
        console.error(`Unknown flag ${f}. Use --help.`);
        process.exit(1);
    }
}

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;
const rel = (p) => path.relative(ROOT, p);

function slugify(filename) {
    return path
        .parse(filename)
        .name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function collect(target) {
    const stat = await fs.stat(target).catch(() => null);
    if (!stat) throw new Error(`Input not found: ${target}`);
    if (stat.isFile()) return [target];
    const entries = await fs.readdir(target, { withFileTypes: true });
    const files = await Promise.all(
        entries
            .filter((e) => !e.name.startsWith('.'))
            .map((e) => (e.isDirectory() ? collect(path.join(target, e.name)) : [path.join(target, e.name)])),
    );
    return files.flat();
}

async function loadOverrides() {
    const raw = await fs.readFile(OVERRIDES_PATH, 'utf8').catch(() => '{}');
    const parsed = JSON.parse(raw);
    for (const [slug, o] of Object.entries(parsed)) {
        for (const key of Object.keys(o)) {
            if (!['maxEdge', 'quality'].includes(key) || !Number.isFinite(o[key])) {
                throw new Error(`image-overrides.json: "${slug}.${key}" must be a number (maxEdge or quality).`);
            }
        }
    }
    return parsed;
}

async function isUpToDate(output, input) {
    const [o, i] = await Promise.all([fs.stat(output).catch(() => null), input ? fs.stat(input) : null]);
    return Boolean(o && (!i || o.mtimeMs >= i.mtimeMs));
}

async function convert(input, slug, { maxEdge, quality }) {
    const output = path.join(OUT_DIR, `${slug}.webp`);
    const info = await sharp(input, { failOn: 'none' })
        .rotate() // apply EXIF orientation
        .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(output);
    return { output, info };
}

async function makeThumb(source, slug) {
    const output = path.join(OUT_DIR, `${slug}${THUMB_SUFFIX}.webp`);
    await sharp(source)
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: DEFAULTS.quality })
        .toFile(output);
    return output;
}

async function describe(file) {
    const meta = await sharp(file).metadata();
    const swap = meta.orientation && meta.orientation >= 5; // hand-tuned files may keep EXIF rotation
    const width = swap ? meta.height : meta.width;
    const height = swap ? meta.width : meta.height;
    const blur = await sharp(file)
        .rotate()
        .resize({ width: BLUR_EDGE, height: BLUR_EDGE, fit: 'inside' })
        .webp({ quality: 40 })
        .toBuffer();
    return { width, height, blurDataURL: `data:image/webp;base64,${blur.toString('base64')}` };
}

async function buildManifest() {
    const names = (await fs.readdir(OUT_DIR)).sort();
    const photos = names.filter((n) => {
        const { ext, name } = path.parse(n);
        return MANIFEST_EXTS.has(ext.toLowerCase()) && !NON_PHOTO.test(name);
    });
    const thumbFiles = new Map(photos.filter((n) => path.parse(n).name.endsWith(THUMB_SUFFIX)).map((n) => [path.parse(n).name.slice(0, -THUMB_SUFFIX.length), n]));
    const manifest = {};
    const warnings = [];

    for (const name of photos) {
        const slug = path.parse(name).name;
        if (slug.endsWith(THUMB_SUFFIX)) continue;
        if (manifest[slug]) {
            warnings.push(`${slug}: both ${manifest[slug].src.split('/').pop()} and ${name} exist; using the first`);
            continue;
        }
        const file = path.join(OUT_DIR, name);
        const [{ size }, meta] = await Promise.all([fs.stat(file), describe(file)]);
        const entry = { src: `/images/${name}`, ...meta, bytes: size };
        if (thumbFiles.has(slug)) {
            const tn = thumbFiles.get(slug);
            const tmeta = await describe(path.join(OUT_DIR, tn));
            entry.thumb = { src: `/images/${tn}`, width: tmeta.width, height: tmeta.height };
        }
        if (size > WARN_BYTES) warnings.push(`${name} is ${kb(size)} (> ${kb(WARN_BYTES)}). Add an override in scripts/image-overrides.json.`);
        manifest[slug] = entry;
    }
    await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    return { manifest, warnings };
}

async function main() {
    const overrides = await loadOverrides();
    await fs.mkdir(OUT_DIR, { recursive: true });

    const targets = inputs.length ? inputs : [DEFAULT_INPUT];
    const found = [];
    for (const t of targets) {
        const abs = path.resolve(t);
        try {
            found.push(...(await collect(abs)));
        } catch (err) {
            if (!inputs.length) {
                console.log(`No ./${DEFAULT_INPUT} folder; regenerating the manifest from ${rel(OUT_DIR)} only.`);
                break;
            }
            throw err;
        }
    }

    const photos = [];
    for (const file of found) {
        const { ext, base } = path.parse(file);
        if (!INPUT_EXTS.has(ext.toLowerCase()) || NON_PHOTO.test(path.parse(base).name)) {
            console.log(`- skip   ${rel(file)} (not a photo)`);
            continue;
        }
        photos.push({ file, slug: slugify(base) });
    }

    const seen = new Map();
    for (const p of photos) {
        if (seen.has(p.slug)) throw new Error(`Slug collision "${p.slug}": ${rel(seen.get(p.slug))} and ${rel(p.file)}`);
        seen.set(p.slug, p.file);
    }

    let converted = 0;
    let skipped = 0;
    let failed = 0;
    for (const { file, slug } of photos) {
        const opts = { ...DEFAULTS, ...overrides[slug] };
        const output = path.join(OUT_DIR, `${slug}.webp`);
        try {
            if (!force && (await isUpToDate(output, file))) {
                skipped++;
                console.log(`- skip   ${slug}.webp (up to date; use --force to rebuild)`);
            } else {
                const before = (await fs.stat(file)).size;
                const { info } = await convert(file, slug, opts);
                converted++;
                console.log(`✓ ${slug}.webp  ${kb(before)} -> ${kb(info.size)}  ${info.width}x${info.height}  (maxEdge ${opts.maxEdge}, q${opts.quality})`);
            }
            if (thumbs) await makeThumb(output, slug);
        } catch (err) {
            failed++;
            console.error(`✗ ${rel(file)}: ${err.message}`);
        }
    }

    const { manifest, warnings } = await buildManifest();
    const total = Object.values(manifest).reduce((s, e) => s + e.bytes, 0);
    console.log(`\n${converted} converted, ${skipped} skipped, ${failed} failed. ${Object.keys(manifest).length} images in manifest (${kb(total)} total).`);
    for (const w of warnings) console.warn(`! ${w}`);
    console.log(`Manifest: ${rel(MANIFEST_PATH)}`);
    if (failed) process.exit(1);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
