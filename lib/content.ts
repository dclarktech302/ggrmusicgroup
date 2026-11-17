import { getImage, imageFields, imageWithAlt } from '@/lib/images';
import type { GgrEvent, HomeContent, OfferImages, ShowsContent } from '@/lib/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Home page content. Stubbed locally for now; swap the body for a headless CMS
 * fetch later. Components only depend on the HomeContent shape.
 */
export async function getHomeContent(): Promise<HomeContent> {
    // Hero background photo. One-line swap: change the slug (a file name in public/images, without extension).
    const hero = getImage('img-4508');
    // Photo for the GHO-CASE hero variant (performer in cyan-blue stage light, 1169x1300).
    const showHero = getImage('img-4515');

    return {
        ctaHref: '/subscribe',
        heroImage: { src: hero.src, width: hero.width, height: hero.height, blurDataURL: hero.blurDataURL, objectPosition: 'center 30%' },
        showHeroImage: { src: showHero.src, width: showHero.width, height: showHero.height, blurDataURL: showHero.blurDataURL, objectPosition: '21% 0%' },
        // artistsHref is unset on purpose: the "Artists: perform" link stays hidden until a destination exists.
        // Baseline test photos for the mosaic component (imageFields() fills thumbSrc/fullSrc/width/height/blurDataURL).
        photos: [
            { id: 'crowd', label: 'PHOTO · CROWD', alt: 'Black and white shot of a performer and crowd inside a venue', gradient: 'linear-gradient(160deg,#6a6a6a,#1c1c1c)', ...imageFields('photo-095202374210') },
            { id: 'stage', label: 'PHOTO · STAGE', alt: 'Artist in a white tee performing on stage with the mic raised', gradient: 'linear-gradient(200deg,#8a8a8a,#2a2a2a)', objectPosition: 'center top', ...imageFields('0286cba7-8496-4ba6-b2f7-acc9691751b1') },
            { id: 'skate', label: 'PHOTO · SKATE', alt: 'Black and white shot of an artist in white performing on stage with the crowd in front', gradient: 'linear-gradient(120deg,#4a4a4a,#141414)', ...imageFields('photo-0915202381027') },
            { id: 'mic', label: 'PHOTO · MIC', alt: 'Singer on the mic under purple light', gradient: 'linear-gradient(180deg,#5a5a5a,#1a1a1a)', ...imageFields('img-4508') },
            { id: 'dj', label: 'PHOTO · DJ', alt: 'Mixing console with lit faders', gradient: 'linear-gradient(140deg,#777,#222)', ...imageFields('sound-board') },
        ],
        // GHO-CASE 8 is the upcoming show. Once its date has passed the hero and stub fall back on their own (the
        // recap shows for 45 days). To announce another show, replace this block; drop `heroVariant` for the default hero.
        nextEvent: {
            // Same wording as the Eventbrite listing.
            title: 'Tha GHO-CASE 8',
            editionLabel: 'GHO-CASE No. 08',
            date: '2026-12-04',
            doorsTime: '7PM',
            showTime: '8PM',
            ageLimit: '18+',
            price: '$5 at the door',
            // $5 plus a $2.18 Eventbrite processing fee.
            onlinePrice: '$7.18 online',
            ticketUrl: 'https://www.eventbrite.com/e/tha-gho-case-8-tickets-2004867494646',
            lineup: ['Iamshowbizz', 'Linthanos', 'Neff', 'D. Royal', 'GloTheDilf'],
            blurb: 'A live hip-hop artist competition. Judges and the crowd vote, and three winners get prizes.',
            heroVariant: 'ghocase',
            venueName: 'The Smokey Heifer',
            venueShortName: 'The Smokey Heifer',
            venueAddress: '3 Ninth St FL 2, Ocean City, MD 21842',
            city: 'Ocean City',
            state: 'MD',
        },
        // Most recent past show: the recap shows for 45 days after its date when no show is upcoming.
        lastEvent: {
            title: 'Ghostfest 4',
            editionLabel: 'Ghostfest No. 04',
            date: '2026-10-24',
            doorsTime: '6PM',
            venueName: 'Lurking Class Skate Shop',
            venueShortName: 'Lurking Class',
            // Source: City of Salisbury business directory. Verify against the shop's own page.
            venueAddress: '213 W Main St, Salisbury, MD 21801',
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
            // 57 added photos. Alt texts are drafts written from thumbnails; review before relying on them. Photographer credit is pending (usage rights
            // and wording are being confirmed): add no credit text yet, and leave the small corner watermarks on some photos alone.
            imageWithAlt('ggr-photo-01', 'Performer seated on a speaker, rapping in blue and yellow stage light'),
            imageWithAlt('ggr-photo-02', 'Performer climbing the graffiti stage wall during a set'),
            imageWithAlt('ggr-photo-03', 'Two artists performing on stage in magenta and red light'),
            imageWithAlt('ggr-photo-04', 'Artist performing on stage in blue light with a sticker-covered wall behind'),
            imageWithAlt('ggr-photo-05', 'Artist in a patterned outfit pointing up on stage in green and blue light'),
            imageWithAlt('ggr-photo-06', 'Two artists performing on stage in green light with the crowd in front'),
            imageWithAlt('ggr-photo-07', 'Artist performing in front of a yellow portrait mural'),
            imageWithAlt('ggr-photo-08', 'Artist in a blue cap rapping on stage'),
            imageWithAlt('ggr-photo-09', 'Artist in a white tee rapping into the mic in green light'),
            imageWithAlt('ggr-photo-10', 'Group of artists performing together on stage'),
            imageWithAlt('ggr-photo-11', 'Artist in a puffer jacket performing in pink and cyan light'),
            imageWithAlt('ggr-photo-12', 'Portrait of an artist in a white puffer jacket and cap'),
            imageWithAlt('ggr-photo-13', 'DJ at the decks with a laptop on stage'),
            imageWithAlt('ggr-photo-14', 'Performer standing on a ledge in front of the graffiti wall'),
            imageWithAlt('ggr-photo-15', 'Close-up of an artist smiling mid-song with the mic'),
            imageWithAlt('ggr-photo-16', 'Two artists sharing the mic on stage in green light'),
            imageWithAlt('ggr-photo-17', 'Two performers on a dark stage in white and orange outfits'),
            imageWithAlt('ggr-photo-18', 'Artist performing on stage in red light with a yellow mural behind'),
            imageWithAlt('ggr-photo-19', 'Portrait of a man in a patterned jacket in front of a sticker-covered wall'),
            imageWithAlt('ggr-photo-20', 'Three friends posing on stage in front of the graffiti wall'),
            imageWithAlt('ggr-photo-21', 'Group of artists performing together in teal light'),
            imageWithAlt('ggr-photo-22', 'Artist in a red hoodie rapping on stage with a DJ behind'),
            imageWithAlt('ggr-photo-23', 'Two artists on stage in green and teal light'),
            imageWithAlt('ggr-photo-24', 'Artist in a number 8 jersey with arms raised in purple light'),
            imageWithAlt('ggr-photo-25', 'Artist rapping into the mic in purple light'),
            imageWithAlt('ggr-photo-26', 'Artist sitting cross-legged on stage in pink and blue light'),
            imageWithAlt('ggr-photo-27', 'Artist in a cap and light blue shirt performing in pink light'),
            imageWithAlt('ggr-photo-28', 'Artist kneeling on stage, performing in cyan light'),
            imageWithAlt('ggr-photo-29', 'Group of friends posing at the venue bar'),
            imageWithAlt('ggr-photo-30', 'Artist in a hoodie performing on stage'),
            imageWithAlt('ggr-photo-31', 'Artist performing on a small stage with green and blue lighting'),
            imageWithAlt('ggr-photo-32', 'Artist in a striped top performing on stage in red light'),
            imageWithAlt('ggr-photo-33', 'Artist in a gray hoodie with a mic in front of a venue sign'),
            imageWithAlt('ggr-photo-34', 'Two artists sitting on the edge of the stage with mics'),
            imageWithAlt('ggr-photo-35', 'Two artists posing with a championship belt'),
            imageWithAlt('ggr-photo-36', 'Wide shot of a stage show in blue light with a crowd in front'),
            imageWithAlt('ggr-photo-37', 'Artist in a white tee performing in dark blue light'),
            imageWithAlt('ggr-photo-38', 'Artist in an orange shirt and plaid shorts performing in blue and green light'),
            imageWithAlt('ggr-photo-39', 'Artist performing in blue light in front of graffiti'),
            imageWithAlt('ggr-photo-40', 'Close-up of an artist with locs rapping in purple light'),
            imageWithAlt('ggr-photo-41', 'Artist in a black hoodie with an arm raised on stage in blue light'),
            imageWithAlt('ggr-photo-42', 'DJ at a table with a keyboard and decks'),
            imageWithAlt('ggr-photo-43', 'Artist in a GGR shirt performing under green lights'),
            imageWithAlt('ggr-photo-44', 'Artist performing on a dark stage in blue light'),
            imageWithAlt('ggr-photo-45', 'Black and white shot of artists on stage in front of a skateboard wall'),
            imageWithAlt('ggr-photo-46', 'Artist posing in a patterned shirt in front of a GGR backdrop'),
            imageWithAlt('ggr-photo-47', 'Two artists performing on stage in front of a sticker wall'),
            imageWithAlt('ggr-photo-48', 'Artist in a blue cap and shirt walking on stage'),
            imageWithAlt('ggr-photo-49', 'Artist with green hair rapping on stage in green and blue light'),
            imageWithAlt('ggr-photo-50', 'Artist in a yellow tee singing with his head back in warm light'),
            imageWithAlt('ggr-photo-51', 'Artist in a white tee and black shorts performing, black and white with color accents'),
            imageWithAlt('ggr-photo-52', 'Artist in a black tee with a hand on his chest in cyan light'),
            imageWithAlt('ggr-photo-53', 'Artist leaning back mid-song under a red venue sign'),
            imageWithAlt('ggr-photo-54', 'Artist in a cap and graphic sweatshirt performing in purple light'),
            imageWithAlt('ggr-photo-55', 'Singer performing in front of a window with city lights'),
            imageWithAlt('ggr-photo-56', 'Musician playing an electric guitar on stage in purple light'),
            imageWithAlt('ggr-photo-57', 'Fisheye shot of artists seated on stage in purple and pink light'),
        ],
    };
}

/** "What We Offer" accordion images (stock photos). Swap slugs/alt text here; the component only reads this shape. */
export async function getOfferImages(): Promise<OfferImages> {
    return {
        'item-1': imageWithAlt('artistic-setting', 'Man standing around graffiti'),
        'item-2': imageWithAlt('sound-board', 'High quality soundboard for music recording'),
        'item-3': imageWithAlt('guitar-amps', 'Guitar amplifiers for music recording'),
        'item-4': imageWithAlt('piano-instructor-student', 'Piano instructor and student'),
    };
}

/** "2026-10-24" -> "OCT 24". Parses the ISO parts directly so the result never shifts with timezone. */
export function formatEventDate(iso: string): string {
    const [, month, day] = iso.split('-').map(Number);
    return `${MONTHS[month - 1]} ${day}`;
}

/** "2026-12-04" -> "Fri, Dec 4". The weekday comes from Date.UTC on the parsed parts, so it never shifts with timezone. */
export function formatEventDayShort(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
    const name = MONTHS[month - 1];
    return `${weekday}, ${name[0]}${name.slice(1).toLowerCase()} ${day}`;
}

/** "2026-10-24" -> "Oct 24, 2026". */
export function formatEventDateLong(iso: string): string {
    const [year, month, day] = iso.split('-').map(Number);
    const name = MONTHS[month - 1];
    return `${name[0]}${name.slice(1).toLowerCase()} ${day}, ${year}`;
}

/** One ticker sequence: "Ghostfest 4 ✕ Oct 24 ✕ Lurking Class ✕ Doors 6PM ✕ Salisbury MD ✕ ". */
export function buildTickerText(event: GgrEvent): string {
    const date = formatEventDate(event.date);
    return [event.title, date, event.venueShortName, event.doorsTime && `Doors ${event.doorsTime}`, `${event.city} ${event.state}`]
        .filter(Boolean)
        .map((part) => `${part} ✕ `)
        .join('');
}
