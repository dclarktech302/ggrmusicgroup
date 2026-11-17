'use client';

import * as React from 'react';
import { buildMapLinks } from '@/lib/maps';
import { detectPlatform, type Platform } from '@/lib/platform';

interface VenueMapChooserProps {
    venueName: string;
    venueAddress: string;
    /** 'default': red-on-paper "HOME VENUE" button (the venue strip). 'ghocase': the flyer colours, for the show hero. */
    variant?: 'default' | 'ghocase';
    /** Button content. Defaults to "HOME VENUE ↗"; the ghocase hero passes its venue line. */
    label?: React.ReactNode;
}

const FOCUS_PAPER = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--gc-paper)';

const STYLES = {
    default: {
        // Padding + equal negative margin enlarge the tap target without moving the layout.
        trigger:
            '-mx-2 -my-[15px] cursor-pointer px-2 py-[15px] font-mono text-[10px] font-semibold tracking-[.1em] text-ggr-red underline-offset-2 hover:underline focus-visible:underline aria-expanded:underline',
        panel: 'basis-full pt-5',
        list: 'flex flex-col gap-2 md:flex-row md:justify-end md:gap-3',
        item: 'md:w-52 lg:w-60',
        link: 'flex min-h-11 items-center justify-between border-2 border-black px-4 font-mono text-[11px] font-semibold uppercase tracking-[.1em] text-black hover:border-ggr-red hover:bg-ggr-red hover:text-white focus-visible:border-ggr-red focus-visible:bg-ggr-red focus-visible:text-white',
    },
    ghocase: {
        // The trigger is the venue line itself; 44px tall without moving the layout (padding plus equal negative margin).
        trigger: `-my-3 cursor-pointer whitespace-nowrap py-3 text-left text-sm underline-offset-4 hover:underline aria-expanded:underline md:-my-1.5 md:py-1.5 md:text-2xl ${FOCUS_PAPER}`,
        panel: 'basis-full',
        list: 'flex flex-col gap-2 md:flex-row md:gap-3',
        item: 'md:w-52',
        link: `flex min-h-11 items-center justify-between border-2 border-(--gc-paper) bg-(--gc-ink)/70 px-4 font-mono text-[11px] font-semibold uppercase tracking-[.1em] hover:border-(--gc-sky) hover:bg-(--gc-sky) hover:text-(--gc-ink) focus-visible:border-(--gc-sky) focus-visible:bg-(--gc-sky) focus-visible:text-(--gc-ink) ${FOCUS_PAPER}`,
    },
} as const;

/**
 * "HOME VENUE ↗" button (or, in the ghocase variant, the hero's venue line) that expands inline to a list of map apps.
 *
 * Renders two siblings (button + panel) so the parent flex-wrap row can drop the panel onto its own
 * full-width line. Expanding inline, rather than as a popover, keeps it inside the strip's clip-path.
 * The platform is detected only when the chooser opens, so the first render matches the server.
 */
export function VenueMapChooser({ venueName, venueAddress, variant = 'default', label = 'HOME VENUE ↗' }: VenueMapChooserProps) {
    const styles = STYLES[variant];
    const [open, setOpen] = React.useState(false);
    const [platform, setPlatform] = React.useState<Platform>('other');
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const panelId = React.useId();

    const toggle = () => {
        if (!open) setPlatform(detectPlatform());
        setOpen(!open);
    };

    // Escape closes the list and returns focus to the button.
    React.useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const links = buildMapLinks(venueName, venueAddress, platform);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={`${variant === 'default' ? 'Home venue: choose' : 'Choose'} a map app for ${venueName}, ${venueAddress}`}
                onClick={toggle}
                className={styles.trigger}
            >
                {label}
            </button>

            <div id={panelId} hidden={!open} className={styles.panel}>
                <ul className={styles.list}>
                    {links.map((link) => (
                        <li key={link.id} className={styles.item}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${link.label}: ${venueName}, ${venueAddress} (opens in a new tab)`}
                                onClick={() => {
                                    setOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className={styles.link}
                            >
                                {link.label}
                                <span aria-hidden>↗</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
