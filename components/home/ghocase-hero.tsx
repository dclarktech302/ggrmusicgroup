import Image from 'next/image';
import { VenueMapChooser } from '@/components/home/venue-map-chooser';
import Link from 'next/link';
import { formatEventDayShort } from '@/lib/content';
import type { GgrEvent, HeroImage } from '@/lib/types';

interface GhoCaseHeroProps {
    event: GgrEvent;
    image: HeroImage;
    ctaHref: string;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--gc-paper)';
// Archivo's width axis (see fonts.ts) at 75%: the condensed look of the flyer, for this variant only.
const CONDENSED = '[font-stretch:75%]';
// The giant title uses the narrowest width the axis allows (62%): at 75% it is 4.8em wide and tops out near 277px on a
// 1440 screen; at 62% it is 4.06em, so it reaches ~330px and still fits on one line.
const CONDENSED_MAX = '[font-stretch:62%]';

const PILL = 'rounded-full border-2 bg-(--gc-ink)/70 leading-none';
const PILL_MONO = `${PILL} border-(--gc-paper) px-4 py-2.5 font-mono text-[11px] uppercase tracking-[.1em] md:text-[13px]`;

/**
 * Show-specific home hero in the flyer's colours (.ggr-theme-ghocase). Rendered by GgrHero only while the show is
 * the upcoming one and event.heroVariant is 'ghocase'; after the date the default hero takes over on its own.
 * Container widths and left edge match the default hero and HeroHeader, so the logo lines up with the headline.
 */
export function GhoCaseHero({ event, image, ctaHref }: GhoCaseHeroProps) {
    const when = [formatEventDayShort(event.date), event.showTime].filter(Boolean).join(' · ');
    // "$5 at the door" -> "$5" and "At the door"; shown as written.
    const [amount, ...rest] = event.price?.split(' ') ?? [];
    const priceNote = rest.join(' ');
    // "Tha GHO-CASE 8": the giant artwork is "GHO-CASE 8", and "Tha" is a small word above its top-left corner.
    const [, lead, name, number] = event.title.match(/^(?:(Tha)\s+)?(.*?)\s*(\d+)?$/) ?? [];

    const ticketClass = `inline-flex h-[52px] w-full items-center justify-center rounded-full bg-(--gc-sky) px-9 font-semibold text-(--gc-ink) transition-[background-color,transform] duration-150 hover:bg-(--gc-sky-lt) active:scale-[.97] md:h-14 md:w-auto ${FOCUS}`;
    // Left-aligned with a 44px tap area on phones; on md and up it is the plain text link it was.
    const textLink = `inline-flex min-h-11 items-center self-start font-mono text-xs uppercase tracking-[.12em] underline underline-offset-[5px] md:min-h-0 md:self-auto ${FOCUS}`;

    return (
        <section className="ggr-theme-ghocase relative isolate flex min-h-[max(640px,100svh)] flex-col overflow-hidden bg-(--gc-ink) text-(--gc-paper) md:min-h-[900px]">
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

            <div className="relative mx-auto flex w-full flex-1 flex-col px-8 pb-6 pt-[104px] md:max-w-[736px] md:px-6 md:pb-10 md:pt-[104px] lg:max-w-[1456px] lg:px-14 lg:pb-12 lg:pt-[112px]">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <div className="ggr-rise flex flex-col gap-5 md:gap-6 lg:min-w-0">
                        <p className="font-mono text-xs uppercase tracking-[.24em] text-(--gc-sky) md:text-sm">GGR Music Group presents</p>
                        <p className={`font-display text-[52px] font-extralight leading-[.9] tracking-[-.03em] md:text-[clamp(4.5rem,11vw,6.5rem)] lg:text-[clamp(72px,7.3vw,104px)] ${CONDENSED}`}>
                            <span className="block">Live music</span>
                            <span className="block">
                                in <span className="font-extrabold">Ocean City</span>
                            </span>
                        </p>
                        {/* Phones skip the blurb: the stub already carries the details and the button should sit in the first screen. */}
                        {event.blurb && <p className="hidden max-w-[520px] text-lg text-(--gc-paper)/92 md:block">{event.blurb}</p>}
                        <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-8">
                            {event.ticketUrl ? (
                                <>
                                    <a
                                        href={event.ticketUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Get tickets for ${event.title} (opens in a new tab)`}
                                        className={ticketClass}
                                    >
                                        Get tickets
                                    </a>
                                    <Link href={ctaHref} className={textLink}>
                                        Sign up for updates
                                    </Link>
                                </>
                            ) : (
                                <Link href={ctaHref} className={ticketClass}>
                                    Sign up for updates
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
                                    {/* Two deliberate lines on phones (never a one-word last line); one line from md up. */}
                                    {event.doorsTime && (
                                        <>
                                            <span className="block md:inline">Doors {event.doorsTime}</span>
                                            <span aria-hidden className="hidden md:inline">
                                                {' · '}
                                            </span>
                                        </>
                                    )}
                                    <span className="block md:inline">
                                        {event.venueShortName}, {event.city}
                                        <span className="hidden md:inline">, {event.state}</span>
                                    </span>
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
                        {/* Phones: one short line of plain text instead of the four pills. */}
                        <p className="font-mono text-[11px] uppercase tracking-[.06em] md:hidden">
                            <span className="sr-only">Admission: </span>
                            {[event.price, event.onlinePrice, event.ageLimit].filter(Boolean).join(' · ')}
                        </p>
                        <ul aria-label="Admission" className="hidden flex-wrap items-center gap-2 md:flex lg:justify-end">
                            {amount && (
                                <li className={`${PILL} border-(--gc-sky) px-5 py-1.5 font-display text-2xl font-extrabold text-(--gc-sky) md:text-[26px]`}>{amount}</li>
                            )}
                            {priceNote && <li className={PILL_MONO}>{priceNote}</li>}
                            {event.onlinePrice && <li className={PILL_MONO}>{event.onlinePrice}</li>}
                            {event.ageLimit && <li className={PILL_MONO}>{event.ageLimit}</li>}
                        </ul>
                    </div>
                </div>

                {/* Phones: the title follows the content with a fixed gap; it is pinned to the bottom only from md up. */}
                <div className="ggr-rise flex flex-col gap-4 pt-8 md:mt-auto md:gap-5 md:pt-12 lg:pt-8">
                    {/* The title scales with its own width (container query units), so it never wraps or clips. */}
                    <div className="[container-type:inline-size]">
                        <h1 className={`relative whitespace-nowrap pt-[.2em] font-display font-extrabold uppercase leading-[.85] tracking-[-.02em] text-(--gc-sky) ${CONDENSED_MAX} text-[min(340px,24cqw)]`}>
                            {lead && (
                                <>
                                    <span className="absolute left-0 top-0 text-[.18em] font-extralight normal-case leading-none tracking-normal text-(--gc-paper)">{lead}</span>{' '}
                                </>
                            )}
                            {name}
                            {number && (
                                <>
                                    {' '}
                                    <span className="text-(--gc-paper)">{number}</span>
                                </>
                            )}
                        </h1>
                    </div>
                    {/* The venue line is the map link: it opens the same platform-aware chooser as the strip. `relative` puts
                        it above the giant title, whose text boxes extend past its own box and would swallow the tap. */}
                    <div className="relative flex flex-wrap items-center gap-x-3 gap-y-5 md:gap-x-4">
                        <span aria-hidden className="h-0.5 w-6 shrink-0 bg-(--gc-sky) md:w-14" />
                        <VenueMapChooser
                            variant="ghocase"
                            venueName={event.venueName}
                            venueAddress={event.venueAddress}
                            label={
                                <>
                                    <strong className="font-bold">{event.venueShortName}</strong> · {event.city}, {event.state}{' '}
                                    <span aria-hidden className="text-(--gc-sky)">
                                        ↗
                                    </span>
                                </>
                            }
                        />
                        <span aria-hidden className="h-0.5 min-w-4 flex-1 bg-(--gc-sky)" />
                    </div>
                </div>
            </div>
        </section>
    );
}
