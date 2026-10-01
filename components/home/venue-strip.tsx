const TORN_EDGE =
    'polygon(0 10px,8% 0,18% 8px,30% 1px,44% 10px,58% 0,70% 8px,84% 1px,100% 9px,100% 100%,0 100%)';

export function VenueStrip({ name }: { name: string }) {
    return (
        <div
            className="flex items-center justify-between bg-ggr-paper px-5 pb-6 pt-8 text-black"
            style={{ clipPath: TORN_EDGE }}
        >
            <div className="font-display text-lg font-black uppercase">{name}</div>
            <div className="font-mono text-[10px] font-semibold tracking-[.1em] text-ggr-red">HOME VENUE ↗</div>
        </div>
    );
}
