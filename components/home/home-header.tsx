/** Logo-only header for the GGR home hero. Standalone so it can be swapped for another header in the page. */
export function HomeHeader() {
    return (
        <header className="flex items-center justify-between px-5 pb-3.5 pt-[22px]">
            <div className="font-display text-[26px] font-black leading-none tracking-[-.03em]">GGR</div>
            <div className="rotate-3 border-[1.5px] border-ggr-red px-[7px] py-1 font-mono text-[10px] font-semibold tracking-[.12em] text-ggr-red">
                SALISBURY MD
            </div>
        </header>
    );
}
