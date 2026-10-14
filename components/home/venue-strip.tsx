import { VenueMapChooser } from '@/components/home/venue-map-chooser';

const TORN_EDGE =
    'polygon(0 10px,8% 0,18% 8px,30% 1px,44% 10px,58% 0,70% 8px,84% 1px,100% 9px,100% 100%,0 100%)';

interface VenueStripProps {
    /** Short name shown on the strip. */
    name: string;
    /** Full venue name and address, used only to build the map links. */
    venueName: string;
    venueAddress: string;
}

/** Full-width paper band with a torn top edge; its content sits in the same container as the rest of the hero. */
export function VenueStrip({ name, venueName, venueAddress }: VenueStripProps) {
    return (
        <div className="bg-ggr-paper text-black" style={{ clipPath: TORN_EDGE }}>
            <div className="flex flex-wrap items-center justify-between px-5 pb-6 pt-8 md:mx-auto md:max-w-[736px] md:px-6 md:pb-8 md:pt-10 lg:max-w-[1456px] lg:px-14 lg:pb-10 lg:pt-12">
                <div className="font-display text-lg font-black uppercase md:text-2xl lg:text-[32px]">{name}</div>
                <VenueMapChooser venueName={venueName} venueAddress={venueAddress} />
            </div>
        </div>
    );
}
