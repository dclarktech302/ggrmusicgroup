'use client';

import * as React from 'react';

/**
 * Sequences per half of the track. One half has to be at least as wide as the viewport or a gap shows at the
 * right end of the loop; 4 covers screens up to about 4100px at the lg type size. The duration below scales
 * with it (15s per sequence at 20px type) so the scroll speed in px/s is what it was with 2 sequences and a
 * 30s loop.
 */
const REPEAT = 4;

/** One-line marquee. Two identical halves scroll 0 → -50% for a seamless loop; pauses while held. */
export function Ticker({ text }: { text: string }) {
    const [paused, setPaused] = React.useState(false);

    return (
        <div
            className="select-none overflow-hidden whitespace-nowrap border-y-2 border-black bg-ggr-red py-[13px] text-black lg:py-4"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
        >
            {/* 24px type from lg (1.2x), so the loop takes 1.2x as long to keep the same px/s. */}
            <div
                className="ggr-ticker-track inline-block font-display text-xl font-black uppercase tracking-[.03em] [--ggr-ticker-duration:60s] lg:text-2xl lg:[--ggr-ticker-duration:72s]"
                data-paused={paused}
            >
                {/* Only the first sequence is read by screen readers; the rest is visual repetition. */}
                <span>{text}</span>
                <span aria-hidden>{text.repeat(REPEAT - 1)}</span>
                <span aria-hidden>{text.repeat(REPEAT)}</span>
            </div>
        </div>
    );
}
