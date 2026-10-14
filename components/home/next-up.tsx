import { formatEventDate } from '@/lib/content';
import type { GgrEvent } from '@/lib/types';

export function NextUp({ event }: { event: GgrEvent }) {
    return (
        <section className="mx-5 pb-[30px] pt-[26px] md:mx-0 md:pb-12 md:pt-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:pb-16 lg:pt-14">
            <div className="lg:col-span-7">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[.14em] text-ggr-red md:text-xs">
                    Next up · {event.editionLabel} · {formatEventDate(event.date)}
                </div>
                {/* 60px on phones; sized so "GHOSTFEST 4" fits the 7-column area at every lg width. */}
                <h2 className="mb-4 mt-3 font-display text-[60px] font-black uppercase leading-[.9] tracking-[-.03em] font-stretch-[88%] md:text-[clamp(4.5rem,11vw,6.5rem)] lg:mb-0 lg:text-[clamp(4.5rem,7.6vw,7rem)]">
                    {event.title}
                </h2>
            </div>
            <div className="flex flex-col gap-1 font-display text-[13px] font-semibold uppercase leading-[1.3] tracking-[.04em] md:mt-6 md:text-[15px] lg:col-span-5 lg:mt-0 lg:items-end lg:pb-2 lg:text-lg lg:text-right">
                <div>{event.venueName}</div>
                <div className="opacity-70">
                    {event.city}, {event.state} · Doors {event.doorsTime}
                </div>
            </div>
        </section>
    );
}
