/**
 * Rotated red "stamp" label, e.g. "SALISBURY MD". Reusable for featured events or
 * other hero content; position it with `className` (e.g. `absolute right-5 top-24`).
 */
export function StampTag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={`rotate-3 border-[1.5px] border-ggr-red px-[7px] py-1 font-mono text-[10px] font-semibold tracking-[.12em] text-ggr-red ${className}`}
        >
            {children}
        </div>
    );
}
