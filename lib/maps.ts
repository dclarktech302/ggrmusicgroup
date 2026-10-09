import type { Platform } from '@/lib/platform';

export type MapAppId = 'google' | 'apple' | 'waze';

export interface MapLink {
    id: MapAppId;
    label: string;
    href: string;
}

/** Display order per platform. Apple Maps is hidden on Android, where it only opens a web page. */
const ORDER: Record<Platform, MapAppId[]> = {
    ios: ['apple', 'google', 'waze'],
    android: ['google', 'waze'],
    other: ['google', 'apple', 'waze'],
};

/**
 * Universal https links for each map app, built from one encoded query string.
 * No installed-app detection: iOS/Android route these to the app when it is installed.
 */
export function buildMapLinks(venueName: string, venueAddress: string, platform: Platform = 'other'): MapLink[] {
    const q = encodeURIComponent(`${venueName}, ${venueAddress}`);
    const all: Record<MapAppId, MapLink> = {
        google: { id: 'google', label: 'Google Maps', href: `https://www.google.com/maps/search/?api=1&query=${q}` },
        apple: { id: 'apple', label: 'Apple Maps', href: `https://maps.apple.com/?q=${q}` },
        waze: { id: 'waze', label: 'Waze', href: `https://waze.com/ul?q=${q}&navigate=yes` },
    };
    return ORDER[platform].map((id) => all[id]);
}
