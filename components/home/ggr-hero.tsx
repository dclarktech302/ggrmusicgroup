import Image from 'next/image';
import Link from 'next/link';
import { archivo, jetbrainsMono } from '@/components/home/fonts';
import { ShowStub } from '@/components/home/show-stub';
import { VenueStrip } from '@/components/home/venue-strip';
import { getHomeContent } from '@/lib/content';
import { easternToday, getShowState } from '@/lib/show-state';

const LINK_CLASS =
    'font-mono text-[11px] uppercase tracking-[.12em] text-ggr-bone underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ggr-violet-lt md:text-xs md:underline-offset-[5px]';

/**
 * Home hero, rendered by app/page.tsx: a full-bleed photo, a stacked headline, the call to action and a ticket stub
 * that shows the next show, the last show's recap, or "to be announced" depending on the date.
 *
 * The date is read when the page is rendered, so app/page.tsx revalidates on a timer to keep the stub current.
 * The container widths (736px at md, 1456px at lg) are shared with HeroHeader via app/page.tsx so the logo lines
 * up with the headline's left edge.
 */
export default async function GgrHero() {
    const { heroImage, ctaHref, nextEvent, lastEvent, artistsHref, sponsorsHref } = await getHomeContent();
    const state = getShowState(easternToday(), nextEvent, lastEvent);
    const stubEvent = state === 'upcoming' ? nextEvent : state === 'recent' ? lastEvent : undefined;

    return (
        <div className={`${archivo.variable} ${jetbrainsMono.variable}`}>
            <section className="relative isolate flex min-h-[max(844px,100svh)] flex-col overflow-hidden bg-ggr-ink text-ggr-bone md:min-h-[860px]">
                <div aria-hidden className="ggr-push absolute inset-0 -z-10">
                    <Image
                        src={heroImage.src}
                        alt=""
                        fill
                        preload
                        sizes="100vw"
                        className="object-cover"
                        style={{ objectPosition: heroImage.objectPosition }}
                        placeholder="blur"
                        blurDataURL={heroImage.blurDataURL}
                    />
                </div>
                <div aria-hidden className="ggr-scrim absolute inset-0 -z-10" />

                <div className="relative mx-auto flex w-full flex-1 flex-col px-8 pb-6 pt-[88px] md:max-w-[736px] md:px-6 md:pt-[104px] lg:max-w-[1456px] lg:px-14 lg:pb-16 lg:pt-[112px]">
                    <div className="ggr-rise flex flex-col gap-3.5 md:gap-6">
                        <h1 className="font-display text-[clamp(2.25rem,11.8vw,2.875rem)] font-extralight leading-[.95] tracking-[-.04em] md:text-[clamp(3.75rem,8.6vw,5.75rem)] lg:text-[92px] lg:leading-[.92]">
                            <span className="block font-extrabold">Live music</span>
                            <span className="block">showcases on</span>
                            <span className="block">Maryland&apos;s</span>
                            <span className="block font-extrabold text-ggr-violet-lt">Eastern Shore</span>
                        </h1>
                        <p className="max-w-[560px] text-base text-ggr-bone/92 md:text-lg lg:text-[21px]">
                            GGR Music Group has put on live showcases and events across the Shore since 2022.
                        </p>
                        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-8">
                            <Link
                                href={ctaHref}
                                className="inline-flex h-[52px] w-full items-center justify-center rounded-full bg-ggr-violet px-9 font-semibold text-white shadow-[0_0_48px_rgba(129,75,228,.4)] transition-[background-color,transform] duration-150 hover:bg-ggr-violet-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ggr-violet-lt active:scale-[.97] md:h-14 md:w-auto"
                            >
                                Join the email list
                            </Link>
                            {(artistsHref || sponsorsHref) && (
                                <div className="flex gap-6 md:gap-8">
                                    {artistsHref && (
                                        <Link href={artistsHref} className={LINK_CLASS}>
                                            Artists: perform
                                        </Link>
                                    )}
                                    {sponsorsHref && (
                                        <Link href={sponsorsHref} className={LINK_CLASS}>
                                            Sponsors: partner
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="ggr-rise mt-auto pt-10 lg:pt-16">
                        <ShowStub state={state} event={stubEvent} />
                    </div>
                </div>
            </section>

            {/* The strip has the map links, so it only makes sense when there is a venue to show. */}
            {state === 'upcoming' && nextEvent && (
                <div className="bg-black pb-14 md:pb-20 lg:bg-ggr-page">
                    <div className="bg-ggr-page font-display">
                        <VenueStrip name={nextEvent.venueShortName} venueName={nextEvent.venueName} venueAddress={nextEvent.venueAddress} />
                    </div>
                </div>
            )}
        </div>
    );
}
