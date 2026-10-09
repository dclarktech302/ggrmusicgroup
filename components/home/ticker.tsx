'use client';

import * as React from 'react';

/** One-line marquee. Two identical halves scroll 0 → -50% for a seamless loop; pauses while held. */
export function Ticker({ text }: { text: string }) {
    const [paused, setPaused] = React.useState(false);
    const half = text + text;

    return (
        <div
            className="select-none overflow-hidden whitespace-nowrap border-y-2 border-black bg-ggr-red py-[13px] text-black"
            onPointerDown={() => setPaused(true)}
            onPointerUp={() => setPaused(false)}
            onPointerCancel={() => setPaused(false)}
            onPointerLeave={() => setPaused(false)}
        >
            <div
                className="ggr-ticker-track inline-block font-display text-xl font-black uppercase tracking-[.03em]"
                data-paused={paused}
            >
                <span>{half}</span>
                <span aria-hidden>{half}</span>
            </div>
        </div>
    );
}
