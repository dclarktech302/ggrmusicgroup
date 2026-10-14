'use client';

import Image from 'next/image';
import * as React from 'react';
import { Lightbox } from '@/components/home/lightbox';
import type { HomePhoto } from '@/lib/types';

/**
 * Per-tile layout, by photo index.
 *
 * `area` places the tile on the 12x10 collage grid used from md up (below md the grid is the original
 * 2-column phone layout and these classes do nothing).
 *
 * `sizes` tells next/image how wide the tile renders so it picks a sharp-enough source. The widths follow the
 * layout: the collage is 688px wide at md (a fixed-width column); from lg it is about 0.57 of the viewport,
 * capped at 830px once the 1456px container stops growing. A tile's share of that width is its column span
 * (5/12 for the big tiles, 7/12 for the wide one, 3/12 and 4/12 for the narrow ones). Below md every tile is
 * about 215px, as before.
 */
const TILES = [
    // crowd: big portrait, also the LCP candidate
    { area: 'md:col-[1/6] md:row-[1/8]', sizes: '(min-width: 1456px) 346px, (min-width: 1024px) 24vw, (min-width: 768px) 290px, 215px' },
    // stage: narrow tall
    { area: 'md:col-[6/9] md:row-[5/11]', sizes: '(min-width: 1456px) 208px, (min-width: 1024px) 15vw, (min-width: 768px) 175px, 215px' },
    // skate: wide landscape
    { area: 'md:col-[6/13] md:row-[1/5]', sizes: '(min-width: 1456px) 484px, (min-width: 1024px) 34vw, (min-width: 768px) 405px, 215px' },
    // mic: square-ish
    { area: 'md:col-[9/13] md:row-[5/11]', sizes: '(min-width: 1456px) 277px, (min-width: 1024px) 20vw, (min-width: 768px) 230px, 215px' },
    // dj: short and wide, under the crowd tile
    { area: 'md:col-[1/6] md:row-[8/11]', sizes: '(min-width: 1456px) 346px, (min-width: 1024px) 24vw, (min-width: 768px) 290px, 215px' },
];

/** Photo grid with scanlines: 2 columns (150/110/150 rows) on phones, an asymmetric collage from md up. Tapping a tile opens the lightbox. */
export function PhotoMosaic({ photos }: { photos: HomePhoto[] }) {
    const [openIndex, setOpenIndex] = React.useState(-1);
    const openerRef = React.useRef<HTMLElement | null>(null);

    const open = (i: number, el: HTMLElement) => {
        openerRef.current = el;
        setOpenIndex(i);
    };

    const close = React.useCallback(() => {
        setOpenIndex(-1);
        openerRef.current?.focus();
    }, []);

    return (
        <>
            <div className="relative grid grid-cols-2 grid-rows-[150px_110px_150px] gap-1 px-1 md:aspect-[51/40] md:grid-cols-12 md:grid-rows-10 md:gap-1.5 md:px-0">
                {photos.map((photo, i) => (
                    <button
                        key={photo.id}
                        type="button"
                        aria-label={`Open photo: ${photo.alt}`}
                        onClick={(e) => open(i, e.currentTarget)}
                        className={`relative flex cursor-pointer items-end overflow-hidden p-2 text-left font-mono text-[9px] contrast-125 -outline-offset-2 outline-white focus-visible:outline-2 md:p-3 md:text-[10px] ${i === 0 ? 'row-span-2' : ''} ${TILES[i]?.area ?? ''}`}
                        style={{ background: photo.gradient }}
                    >
                        {photo.thumbSrc && (
                            <Image
                                src={photo.thumbSrc}
                                alt=""
                                fill
                                sizes={TILES[i]?.sizes ?? '215px'}
                                className="object-cover"
                                style={{ objectPosition: photo.objectPosition }}
                                // Mosaic is above the fold; load eagerly, and the big tile first.
                                loading="eager"
                                fetchPriority={i === 0 ? 'high' : 'auto'}
                                placeholder={photo.blurDataURL ? 'blur' : 'empty'}
                                blurDataURL={photo.blurDataURL}
                            />
                        )}
                        <span className="relative">{photo.label}</span>
                    </button>
                ))}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 1px, transparent 1px 3px)',
                    }}
                />
            </div>

            {openIndex >= 0 && (
                <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
            )}
        </>
    );
}
