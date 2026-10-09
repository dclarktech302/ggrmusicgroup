'use client';

import Image from 'next/image';
import * as React from 'react';
import { Lightbox } from '@/components/home/lightbox';
import type { HomePhoto } from '@/lib/types';

/** 2-column photo grid (150/110/150 rows) with scanlines; tapping a tile opens the lightbox. */
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
            <div className="relative grid grid-cols-2 grid-rows-[150px_110px_150px] gap-1 px-1">
                {photos.map((photo, i) => (
                    <button
                        key={photo.id}
                        type="button"
                        aria-label={`Open photo: ${photo.alt}`}
                        onClick={(e) => open(i, e.currentTarget)}
                        className={`relative flex cursor-pointer items-end overflow-hidden p-2 text-left font-mono text-[9px] contrast-125 -outline-offset-2 outline-white focus-visible:outline-2 ${i === 0 ? 'row-span-2' : ''}`}
                        style={{ background: photo.gradient }}
                    >
                        {photo.thumbSrc && (
                            <Image
                                src={photo.thumbSrc}
                                alt=""
                                fill
                                sizes="215px"
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
