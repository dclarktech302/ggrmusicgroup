'use client';

import * as React from 'react';
import { buildMapLinks } from '@/lib/maps';
import { detectPlatform, type Platform } from '@/lib/platform';

interface VenueMapChooserProps {
    venueName: string;
    venueAddress: string;
}

/**
 * "HOME VENUE ↗" button that expands inline to a list of map apps.
 *
 * Renders two siblings (button + panel) so the parent flex-wrap row can drop the panel onto its own
 * full-width line. Expanding inline, rather than as a popover, keeps it inside the strip's clip-path.
 * The platform is detected only when the chooser opens, so the first render matches the server.
 */
export function VenueMapChooser({ venueName, venueAddress }: VenueMapChooserProps) {
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
                aria-label={`Home venue: choose a map app for ${venueName}, ${venueAddress}`}
                onClick={toggle}
                // Padding + equal negative margin enlarge the tap target without moving the layout.
                className="-mx-2 -my-[15px] cursor-pointer px-2 py-[15px] font-mono text-[10px] font-semibold tracking-[.1em] text-ggr-red underline-offset-2 hover:underline focus-visible:underline aria-expanded:underline"
            >
                HOME VENUE ↗
            </button>

            <div id={panelId} hidden={!open} className="basis-full pt-5">
                <ul className="flex flex-col gap-2">
                    {links.map((link) => (
                        <li key={link.id}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${link.label}: ${venueName}, ${venueAddress} (opens in a new tab)`}
                                onClick={() => {
                                    setOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className="flex min-h-11 items-center justify-between border-2 border-black px-4 font-mono text-[11px] font-semibold uppercase tracking-[.1em] text-black hover:border-ggr-red hover:bg-ggr-red hover:text-white focus-visible:border-ggr-red focus-visible:bg-ggr-red focus-visible:text-white"
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
