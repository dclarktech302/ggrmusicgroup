'use client';

import Image from 'next/image';
import * as React from 'react';
import type { HomePhoto } from '@/lib/types';

const SWIPE_THRESHOLD = 40;
const FOCUSABLE = 'button, [href], [tabindex]:not([tabindex="-1"])';

interface LightboxProps {
    photos: HomePhoto[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);
    const touchStart = React.useRef<{ x: number; y: number } | null>(null);
    const count = photos.length;
    const photo = photos[index];

    const go = React.useCallback(
        (i: number) => onIndexChange((i + count) % count),
        [count, onIndexChange],
    );

    // Initial focus + body scroll lock.
    React.useEffect(() => {
        closeRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Keyboard: Esc closes, arrows navigate (wrapping), Tab is trapped inside the dialog.
    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                go(index + 1);
            } else if (e.key === 'ArrowLeft') {
                go(index - 1);
            } else if (e.key === 'Tab') {
                const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
                if (!focusable?.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement;
                if (!dialogRef.current?.contains(active)) {
                    e.preventDefault();
                    first.focus();
                } else if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [go, index, onClose]);

    const onTouchStart = (e: React.TouchEvent) => {
        const t = e.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            go(index + (dx < 0 ? 1 : -1));
        }
    };

    const stop = (e: React.SyntheticEvent) => e.stopPropagation();
    const src = photo.fullSrc ?? photo.thumbSrc;

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            className="ggr-lightbox-in fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 bg-black/[.94]"
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[11px] font-semibold tracking-[.14em]">
                <span className="text-ggr-red" aria-live="polite">
                    {pad(index + 1)} / {pad(count)}
                </span>
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer text-white hover:text-ggr-red focus-visible:text-ggr-red"
                >
                    CLOSE ✕
                </button>
            </div>

            <div
                role="img"
                aria-label={photo.alt}
                onClick={stop}
                className="relative flex h-[min(70vh,520px)] w-[min(86vw,380px)] items-end border border-ggr-line p-3 font-mono text-[10px] contrast-125"
                style={{ background: photo.gradient }}
            >
                {src ? (
                    <Image src={src} alt="" fill sizes="380px" className="object-cover" priority />
                ) : (
                    <span className="relative">{photo.label} · swap in real photo</span>
                )}
            </div>

            <div onClick={stop} className="flex w-[min(86vw,380px)] gap-3">
                <button
                    type="button"
                    onClick={() => go(index - 1)}
                    className="flex-1 cursor-pointer border-2 border-white p-[13px] text-center font-display text-xs font-extrabold tracking-[.1em] hover:border-ggr-red hover:bg-ggr-red focus-visible:border-ggr-red focus-visible:bg-ggr-red"
                >
                    ← PREV
                </button>
                <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="flex-1 cursor-pointer border-2 border-white p-[13px] text-center font-display text-xs font-extrabold tracking-[.1em] hover:border-ggr-red hover:bg-ggr-red focus-visible:border-ggr-red focus-visible:bg-ggr-red"
                >
                    NEXT →
                </button>
            </div>
        </div>
    );
}
