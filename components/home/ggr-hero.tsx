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
 * v3 mobile-style hero: a 430px column on a black band. Swap into app/page.tsx in place of HeroSection.
 * Navigation comes from the site-wide HeroHeader (fixed) rendered by the page; pt clears it.
 */
export default async function GgrHero() {
    const { photos, event, ctaHref } = await getHomeContent();

    return (
        <div className={`${archivo.variable} ${jetbrainsMono.variable} bg-black pb-14 font-display md:pb-20`}>
            <main className="relative mx-auto max-w-[430px] overflow-hidden bg-ggr-page pt-[88px] text-white">
                <GrainOverlay />
                <PhotoMosaic photos={photos} />
                <Headline />
                <CtaButton href={ctaHref}>Join the movement →</CtaButton>
                <Ticker text={buildTickerText(event)} />
                <NextUp event={event} />
                <VenueStrip name={event.venueShortName} />
            </main>
        </div>
    );
}
