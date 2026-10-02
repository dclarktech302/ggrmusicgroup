import { imageFields, imageWithAlt } from '@/lib/images';
import type { GgrEvent, HomeContent, ShowsContent } from '@/lib/types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Home page content. Stubbed locally for now; swap the body for a headless CMS
 * fetch later. Components only depend on the HomeContent shape.
 */
export async function getHomeContent(): Promise<HomeContent> {
    // Baseline test photos for the hero mosaic. Swap the slug (file name in public/images, without
    // extension) for the final image; imageFields() fills thumbSrc/fullSrc/width/height/blurDataURL.
    // The gradient is shown behind the photo until it loads and is the fallback if no slug is given.
    return {
        ctaHref: '/subscribe',
        photos: [
            { id: 'crowd', label: 'PHOTO · CROWD', alt: 'Black and white shot of a performer and crowd inside a venue', gradient: 'linear-gradient(160deg,#6a6a6a,#1c1c1c)', ...imageFields('photo-095202374210') },
            { id: 'stage', label: 'PHOTO · STAGE', alt: 'Artist performing on a lit stage', gradient: 'linear-gradient(200deg,#8a8a8a,#2a2a2a)', ...imageFields('img-4045') },
            { id: 'skate', label: 'PHOTO · SKATE', alt: 'Rapper in front of a wall of skateboard decks', gradient: 'linear-gradient(120deg,#4a4a4a,#141414)', ...imageFields('hst5409-enhanced-nr') },
            { id: 'mic', label: 'PHOTO · MIC', alt: 'Singer on the mic under purple light', gradient: 'linear-gradient(180deg,#5a5a5a,#1a1a1a)', ...imageFields('img-4508') },
            { id: 'dj', label: 'PHOTO · DJ', alt: 'Mixing console with lit faders', gradient: 'linear-gradient(140deg,#777,#222)', ...imageFields('sound-board') },
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

/** Shows page images. Same shape-over-source idea as getHomeContent(): swap for a CMS fetch later. */
export async function getShowsContent(): Promise<ShowsContent> {
    return {
        featured: [
            imageWithAlt('ghocasev-8', 'Gho Case V event photography'),
            imageWithAlt('img-4498', 'GGR & Friends Part 2 event photography'),
        ],
        gallery: [
            imageWithAlt('hst5409-enhanced-nr', 'Live music performance with dynamic lighting effects'),
            imageWithAlt('0286cba7-8496-4ba6-b2f7-acc9691751b1', 'Music event crowd enjoying live performance'),
            imageWithAlt('img-4045', 'Concert venue with stage setup and lighting rig'),
            imageWithAlt('img-4515', 'Musician performing on stage with instruments'),
            imageWithAlt('img-4510', 'Audience view from concert photography'),
            imageWithAlt('hst3437-enhanced-nr', 'Enhanced concert photography with vibrant stage lighting'),
            imageWithAlt('img-4508', 'Live music event with stage production'),
            imageWithAlt('photo-095202374210', 'Live music event with stage production'),
            imageWithAlt('photo-0915202381027', 'Live music event with stage production'),
        ],
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
