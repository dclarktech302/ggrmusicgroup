import { StampTag } from '@/components/home/stamp-tag';

/**
 * Logo + location-tag header from the v3 design. Not currently rendered: the hero uses the
 * site-wide HeroHeader for navigation. Kept so it (or just StampTag) can be reused.
 */
export function HomeHeader({ tag = 'SALISBURY MD' }: { tag?: string }) {
    return (
        <header className="flex items-center justify-between px-5 pb-3.5 pt-[22px]">
            <div className="font-display text-[26px] font-black leading-none tracking-[-.03em]">GGR</div>
            <StampTag>{tag}</StampTag>
        </header>
    );
}
