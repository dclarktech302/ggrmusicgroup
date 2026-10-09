const TORN_EDGE =
    'polygon(0 10px,8% 0,18% 8px,30% 1px,44% 10px,58% 0,70% 8px,84% 1px,100% 9px,100% 100%,0 100%)';

interface VenueStripProps {
    /** Short name shown on the strip. */
    name: string;
    /** Full venue name and address, used only to build the map link. */
    venueName: string;
    venueAddress: string;
}

export function VenueStrip({ name, venueName, venueAddress }: VenueStripProps) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}, ${venueAddress}`)}`;

    return (
        <div
            className="flex items-center justify-between bg-ggr-paper px-5 pb-6 pt-8 text-black"
            style={{ clipPath: TORN_EDGE }}
        >
            <div className="font-display text-lg font-black uppercase">{name}</div>
            <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${venueName}, ${venueAddress} (opens in Google Maps)`}
                className="font-mono text-[10px] font-semibold tracking-[.1em] text-ggr-red underline-offset-2 hover:underline focus-visible:underline"
            >
                HOME VENUE ↗
            </a>
        </div>
    );
}
