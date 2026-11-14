import Link from 'next/link';
import { formatEventDateLong } from '@/lib/content';
import type { ShowState } from '@/lib/show-state';
import type { GgrEvent } from '@/lib/types';

interface ShowStubProps {
    state: ShowState;
    /** The show to describe: the next one when upcoming, the last one when recent. Unused when tba. */
    event?: GgrEvent;
}

function stubCopy(state: ShowState, event?: GgrEvent) {
    if (state === 'tba' || !event) {
        return { label: 'Next show', title: 'To be announced', meta: "Join the list and you'll hear first.", linkText: undefined };
    }
    return {
        label: state === 'upcoming' ? 'Next show' : 'Last show · Recap',
        title: event.title,
        meta: `${formatEventDateLong(event.date)} · ${event.venueShortName}, ${event.city}, ${event.state}`,
        linkText: state === 'upcoming' ? 'Details' : 'See the recap',
    };
}

/** Amber ticket stub for the hero. The tear-off link (with the notches) only exists when there is somewhere to go. */
export function ShowStub({ state, event }: ShowStubProps) {
    const { label, title, meta, linkText } = stubCopy(state, event);

    return (
        <div
            role="group"
            aria-label={label}
            className={`flex w-full rounded-[14px] bg-ggr-amber text-ggr-ink md:w-[560px] md:rounded-2xl ${
                linkText ? 'ggr-stub [--stub-tab:92px] [--stub-r:8px] md:[--stub-tab:140px] md:[--stub-r:10px]' : ''
            }`}
        >
            <div className="min-w-0 flex-1 p-[14px_14px_14px_16px] md:p-[22px_22px_22px_24px]">
                <p className="font-mono text-[11px] uppercase tracking-[.16em]">{label}</p>
                <p className="mt-1.5 font-display text-xl font-extrabold leading-[1.05] tracking-[-.02em] md:mt-2 md:text-[32px]">{title}</p>
                <p className="mt-1.5 text-xs font-medium md:mt-2 md:text-[15px]">{meta}</p>
            </div>
            {linkText && (
                <Link
                    href="/shows"
                    // Ink ring, drawn inside: violet would vanish on amber, and the mask clips anything outside the stub.
                    className="flex w-[92px] shrink-0 items-center justify-center border-l-2 border-dashed border-[rgba(10,9,18,.45)] p-2 text-center font-mono text-xs font-semibold uppercase tracking-[.1em] text-ggr-ink outline-ggr-ink focus-visible:-outline-offset-4 focus-visible:outline-2 md:w-[140px]"
                >
                    {linkText}
                </Link>
            )}
        </div>
    );
}
