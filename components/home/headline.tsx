export function Headline() {
    return (
        <div className="px-5 pb-2 pt-8 md:px-0 md:pb-0 md:pt-10 lg:pt-0">
            {/* 52px on phones; md scales with the viewport; lg is sized so "MOVEMENT." always fits the 5-column copy area. */}
            <h1 className="ggr-glitch font-display text-[52px] font-black uppercase leading-[.9] tracking-[-.03em] font-stretch-[84%] md:text-[clamp(4rem,10.5vw,6.5rem)] lg:text-[clamp(3.5rem,6vw,5.9rem)]">
                Eastern Shore
                <br />
                Music
                <br />
                Movement.
            </h1>
        </div>
    );
}
