/** Animated film-grain overlay. Place inside a `relative` container; covers it without blocking pointer events. */
export function GrainOverlay() {
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden opacity-[.55] mix-blend-overlay"
        >
            <div className="ggr-grain absolute -inset-[10%]" />
        </div>
    );
}
