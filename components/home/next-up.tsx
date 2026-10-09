import { formatEventDate } from '@/lib/content';
import type { GgrEvent } from '@/lib/types';

export function NextUp({ event }: { event: GgrEvent }) {
    return (
        <section className="mx-5 pb-[30px] pt-[26px]">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-ggr-red">
                Next up · {event.editionLabel} · {formatEventDate(event.date)}
            </div>
            <h2 className="mb-4 mt-3 font-display text-[60px] font-black uppercase leading-[.9] tracking-[-.03em] font-stretch-[88%]">
                {event.title}
            </h2>
            <div className="flex flex-col gap-1 font-display text-[13px] font-semibold uppercase leading-[1.3] tracking-[.04em]">
                <div>{event.venueName}</div>
                <div className="opacity-70">
                    {event.city}, {event.state} · Doors {event.doorsTime}
                </div>
            </div>
        </section>
    );
}
