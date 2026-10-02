import type { GgrEvent, HomeContent } from '@/lib/types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Home page content. Stubbed locally for now; swap the body for a headless CMS
 * fetch later. Components only depend on the HomeContent shape.
 */
export async function getHomeContent(): Promise<HomeContent> {
    // Photos below are gradient placeholders. To use a real image, spread its manifest fields:
    //   { id: 'crowd', label: '...', alt: '...', gradient: '...', ...imageFields('my-photo-slug') }
    // (imageFields from '@/lib/images' fills thumbSrc/fullSrc/width/height/blurDataURL).
    return {
        ctaHref: '/subscribe',
        photos: [
            { id: 'crowd', label: 'PHOTO · CROWD', alt: 'Crowd at a GGR show', gradient: 'linear-gradient(160deg,#6a6a6a,#1c1c1c)' },
            { id: 'stage', label: 'PHOTO · STAGE', alt: 'Artist on stage', gradient: 'linear-gradient(200deg,#8a8a8a,#2a2a2a)' },
            { id: 'skate', label: 'PHOTO · SKATE', alt: 'Skaters at Lurking Class', gradient: 'linear-gradient(120deg,#4a4a4a,#141414)' },
            { id: 'mic', label: 'PHOTO · MIC', alt: 'Microphone close-up', gradient: 'linear-gradient(180deg,#5a5a5a,#1a1a1a)' },
            { id: 'dj', label: 'PHOTO · DJ', alt: 'DJ at the decks', gradient: 'linear-gradient(140deg,#777,#222)' },
        ],
        event: {
            title: 'Ghostfest 4',
            editionLabel: 'Ghostfest No. 04',
            date: '2026-10-24',
            doorsTime: '6PM',
            venueName: 'Lurking Class Skate Shop',
            venueShortName: 'Lurking Class',
            city: 'Salisbury',
            state: 'MD',
        },
    };
}

/** "2026-10-24" -> "OCT 24". Parses the ISO parts directly so the result never shifts with timezone. */
export function formatEventDate(iso: string): string {
    const [, month, day] = iso.split('-').map(Number);
    return `${MONTHS[month - 1]} ${day}`;
}

/** One ticker sequence: "Ghostfest 4 ✕ Oct 24 ✕ Lurking Class ✕ Doors 6PM ✕ Salisbury MD ✕ ". */
export function buildTickerText(event: GgrEvent): string {
    const date = formatEventDate(event.date);
    return [event.title, date, event.venueShortName, `Doors ${event.doorsTime}`, `${event.city} ${event.state}`]
        .map((part) => `${part} ✕ `)
        .join('');
}
