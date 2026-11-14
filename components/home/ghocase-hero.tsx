import Image from 'next/image';
import Link from 'next/link';
import { formatEventDayShort } from '@/lib/content';
import type { GgrEvent, HeroImage } from '@/lib/types';

interface GhoCaseHeroProps {
    event: GgrEvent;
    image: HeroImage;
    ctaHref: string;
    artistsHref?: string;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--gc-paper)';
// Archivo's width axis (see fonts.ts) at 75%: the condensed look of the flyer, for this variant only.
const CONDENSED = '[font-stretch:75%]';
// The giant title uses the narrowest width the axis allows (62%): at 75% it is 4.8em wide and tops out near 277px on a
// 1440 screen; at 62% it is 4.06em, so it reaches ~330px and still fits on one line.
const CONDENSED_MAX = '[font-stretch:62%]';

/**
 * Show-specific home hero in the flyer's colours (.ggr-theme-ghocase). Rendered by GgrHero only while the show is
 * the upcoming one and event.heroVariant is 'ghocase'; after the date the default hero takes over on its own.
 * Container widths and left edge match the default hero and HeroHeader, so the logo lines up with the headline.
 */
export function GhoCaseHero({ event, image, ctaHref, artistsHref }: GhoCaseHeroProps) {
    const when = [formatEventDayShort(event.date), event.showTime].filter(Boolean).join(' · ');
    // "$5 at the door" -> "$5" and "At the door"; shown as written, so there is nothing to build without a price.
    const [amount, ...rest] = event.price?.split(' ') ?? [];
    const priceNote = rest.join(' ');

    return (
        <section className="ggr-theme-ghocase relative isolate flex min-h-[max(844px,100svh)] flex-col overflow-hidden bg-(--gc-ink) text-(--gc-paper) md:min-h-[900px]">
            <div aria-hidden className="ggr-push absolute inset-0 -z-10">
                <Image
                    src={image.src}
                    alt=""
                    fill
                    preload
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: image.objectPosition, filter: 'grayscale(1) contrast(1.15)' }}
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-(--gc-sky) mix-blend-multiply" />
            <div aria-hidden className="ggr-gc-scrim absolute inset-0 -z-10" />

            <div className="relative mx-auto flex w-full flex-1 flex-col px-8 pb-6 pt-[88px] md:max-w-[736px] md:px-6 md:pb-10 md:pt-[104px] lg:max-w-[1456px] lg:px-14 lg:pb-12 lg:pt-[112px]">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="ggr-rise flex flex-col gap-5 md:gap-6">
                        <p className="font-mono text-xs uppercase tracking-[.24em] text-(--gc-sky) md:text-sm">GGR Music Group presents</p>
                        <p className={`font-display text-[52px] font-extralight leading-[.9] tracking-[-.03em] md:text-[clamp(4.5rem,11vw,6.5rem)] lg:text-[clamp(72px,7.3vw,104px)] ${CONDENSED}`}>
                            <span className="block">Live music</span>
                            <span className="block">
                                in <span className="font-extrabold">Ocean City</span>
                            </span>
                        </p>
                        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-8">
                            <Link
                                href={ctaHref}
                                className={`inline-flex h-[52px] w-full items-center justify-center rounded-full bg-(--gc-sky) px-9 font-semibold text-(--gc-ink) transition-[background-color,transform] duration-150 hover:bg-(--gc-sky-lt) active:scale-[.97] md:h-14 md:w-auto ${FOCUS}`}
                            >
                                Sign up for updates
                            </Link>
                            {artistsHref && (
                                <Link
                                    href={artistsHref}
                                    className={`font-mono text-[11px] uppercase tracking-[.12em] underline underline-offset-4 md:text-xs md:underline-offset-[5px] ${FOCUS}`}
                                >
                                    Artists: perform
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="ggr-rise flex w-full flex-col gap-4 md:max-w-[520px] lg:w-[520px] lg:shrink-0">
                        <div
                            role="group"
                            aria-label="Next show"
                            className="ggr-stub flex w-full rounded-[14px] bg-(--gc-sky) text-(--gc-ink) [--stub-r:8px] [--stub-tab:92px] md:rounded-2xl md:[--stub-r:10px] md:[--stub-tab:140px]"
                        >
                            <div className="min-w-0 flex-1 p-[14px_14px_14px_16px] md:p-[22px_22px_22px_24px]">
                                <p className="font-mono text-[11px] uppercase tracking-[.16em]">Next show</p>
                                <p className="mt-1.5 font-display text-[22px] font-extrabold leading-[1.05] tracking-[-.02em] md:mt-2 md:text-[38px]">{when}</p>
                                <p className="mt-1.5 text-xs font-medium md:mt-2 md:text-[15px]">
                                    {event.venueShortName}, {event.city}, {event.state}
                                </p>
                            </div>
                            <Link
                                href="/shows"
                                // Ink ring, drawn inside: paper vanishes on sky, and the mask clips anything outside the stub.
                                className="flex w-[92px] shrink-0 items-center justify-center border-l-2 border-dashed border-[rgba(9,9,9,.45)] p-2 text-center font-mono text-xs font-semibold uppercase tracking-[.1em] outline-(--gc-ink) focus-visible:-outline-offset-4 focus-visible:outline-2 md:w-[140px]"
                            >
                                Details
                            </Link>
                        </div>
                        {amount && (
                            <div className="flex items-center gap-3 lg:justify-end">
                                <span className="rounded-full border-2 border-(--gc-sky) bg-(--gc-ink)/70 px-5 py-1.5 font-display text-2xl font-extrabold leading-none text-(--gc-sky) md:text-[26px]">
                                    {amount}
                                </span>
                                {priceNote && (
                                    <span className="rounded-full border-2 border-(--gc-paper) bg-(--gc-ink)/70 px-4 py-2.5 font-mono text-[11px] uppercase leading-none tracking-[.1em] md:text-[13px]">
                                        {priceNote}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="ggr-rise mt-auto flex flex-col gap-3 pt-12 md:gap-5 lg:pt-16">
                    {/* The title scales with its own width (container query units), so it never wraps or clips. */}
                    <div className="[container-type:inline-size]">
                        <h1 className={`whitespace-nowrap font-display font-extrabold uppercase leading-[.85] tracking-[-.02em] text-(--gc-sky) ${CONDENSED_MAX} text-[min(340px,24cqw)]`}>
                            {event.title.replace(/\s*\d+$/, '')} <span className="text-(--gc-paper)">{event.title.match(/\d+$/)?.[0]}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <span aria-hidden className="h-0.5 w-6 shrink-0 bg-(--gc-sky) md:w-14" />
                        <p className="whitespace-nowrap text-sm md:text-2xl">
                            <strong className="font-bold">{event.venueShortName}</strong> · {event.city}, {event.state}
                        </p>
                        <span aria-hidden className="h-0.5 flex-1 bg-(--gc-sky)" />
                    </div>
                </div>
            </div>
        </section>
    );
}
