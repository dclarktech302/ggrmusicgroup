export interface SubscribeFormData {
    email: string;
    phone: string;
    communication_frequency: string;
    discovery_source: string;
    discovery_source_other: string;
    preferred_platform: string;
    satisfaction_rating: string;
    content_preferences: string[];
    content_preferences_other: string;
    would_share: string;
    consent_agreed: boolean;
}

export type SubscribeFormErrors = Partial<Record<keyof SubscribeFormData, string>>;

export interface HomePhoto {
    id: string;
    /** Short mono label shown on the tile, e.g. "PHOTO · CROWD". Placeholder-only; drop once real photos land. */
    label: string;
    alt: string;
    /** CSS background used while no real photo is supplied. */
    gradient: string;
    /** Tile-sized image. When absent the gradient placeholder is rendered. */
    thumbSrc?: string;
    /** Full-res image for the lightbox. Falls back to thumbSrc. */
    fullSrc?: string;
    /** Intrinsic size and tiny blur placeholder, from the image manifest (see lib/images.ts). */
    width?: number;
    height?: number;
    blurDataURL?: string;
}

export interface GgrEvent {
    title: string;
    /** Series/edition label used in the eyebrow, e.g. "Ghostfest No. 04". */
    editionLabel: string;
    /** ISO calendar date, e.g. "2026-10-24". */
    date: string;
    doorsTime: string;
    venueName: string;
    venueShortName: string;
    /** Street address, used for the venue map link. */
    venueAddress: string;
    city: string;
    state: string;
}

export interface HomeContent {
    photos: HomePhoto[];
    event: GgrEvent;
    ctaHref: string;
}

/** A photo on the shows page; dimensions and blur placeholder come from the image manifest. */
export interface ShowsImage {
    src: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL: string;
}

export interface ShowsContent {
    /** Large images shown above the gallery; the first is the LCP candidate. */
    featured: ShowsImage[];
    gallery: ShowsImage[];
}
