import { CtaButton } from '@/components/home/cta-button';
import { archivo, jetbrainsMono } from '@/components/home/fonts';
import { GrainOverlay } from '@/components/home/grain-overlay';
import { Headline } from '@/components/home/headline';
import { NextUp } from '@/components/home/next-up';
import { PhotoMosaic } from '@/components/home/photo-mosaic';
import { Ticker } from '@/components/home/ticker';
import { VenueStrip } from '@/components/home/venue-strip';
import { buildTickerText, getHomeContent } from '@/lib/content';

/**
 * Home hero, rendered by app/page.tsx. Navigation comes from the site-wide HeroHeader (fixed); pt clears it.
 *
 * - Below md: a 430px phone column on a black band (unchanged).
 * - md to lg: one column that widens to 736px, with the photo collage scaled up.
 * - lg and up: asymmetric two-column intro (type left, collage bleeding off the right edge), a full-bleed
 *   ticker as the divider, then the next-up block across the width.
 *
 * The container widths (736px at md, 1456px = 1440px + the header's 8px side gutters at lg) are shared with
 * HeroHeader via app/page.tsx so the logo lines up with the hero's left edge.
 */
export default async function GgrHero() {
    const { photos, event, ctaHref } = await getHomeContent();

    return (
        <div className={`${archivo.variable} ${jetbrainsMono.variable} bg-black pb-14 font-display md:pb-20 lg:bg-ggr-page`}>
            <main className="relative mx-auto max-w-[430px] overflow-hidden bg-ggr-page pt-[88px] text-white md:max-w-none lg:pt-[120px]">
                <GrainOverlay />

                <div className="md:mx-auto md:max-w-[736px] md:px-6 md:pb-12 lg:grid lg:max-w-[1456px] lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:px-14 lg:pb-16">
                    <div className="lg:col-[6/13] lg:-mr-14">
                        <PhotoMosaic photos={photos} />
                    </div>
                    <div className="lg:col-[1/6] lg:row-start-1">
                        <Headline />
                        <CtaButton href={ctaHref}>Join the movement →</CtaButton>
                    </div>
                </div>

                <Ticker text={buildTickerText(event)} />

                <div className="md:mx-auto md:max-w-[736px] md:px-6 lg:max-w-[1456px] lg:px-14">
                    <NextUp event={event} />
                </div>

                <VenueStrip name={event.venueShortName} venueName={event.venueName} venueAddress={event.venueAddress} />
            </main>
        </div>
    );
}
