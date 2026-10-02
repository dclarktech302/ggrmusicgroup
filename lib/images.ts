import manifestJson from '@/lib/image-manifest.json';

/** One entry of the generated manifest (see scripts/optimize-images.mjs). */
export interface ManifestImage {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
    bytes: number;
    thumb?: { src: string; width: number; height: number };
}

const manifest: Record<string, ManifestImage> = manifestJson;

/** Slug = output filename without extension, e.g. "hst5409-enhanced-nr". Typos fail at compile time. */
export type ImageSlug = keyof typeof manifestJson;

export function getImage(slug: ImageSlug): ManifestImage {
    const image = manifest[slug];
    if (!image) throw new Error(`Unknown image slug "${slug}". Run pnpm optimize-images.`);
    return image;
}

/**
 * Image fields for a HomePhoto, from the manifest: `{ ...photo, ...imageFields('some-slug') }`.
 * The single place `src` is decided, so a custom loader/CDN can be introduced without touching components.
 */
export function imageFields(slug: ImageSlug) {
    const { src, width, height, blurDataURL, thumb } = getImage(slug);
    return { thumbSrc: thumb?.src ?? src, fullSrc: src, width, height, blurDataURL };
}

/** Image fields plus alt text, for components that render a plain image (e.g. the shows page). */
export function imageWithAlt(slug: ImageSlug, alt: string) {
    const { src, width, height, blurDataURL } = getImage(slug);
    return { src, alt, width, height, blurDataURL };
}
