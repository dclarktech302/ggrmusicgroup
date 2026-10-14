import Link from 'next/link';

export function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <div className="px-5 pb-[30px] pt-3.5 md:px-0 md:pb-0 md:pt-8 lg:pt-10">
            <Link
                href={href}
                className="flex items-center justify-center bg-white p-[17px] font-display text-[13px] font-extrabold uppercase tracking-[.1em] text-black transition-colors hover:bg-ggr-red hover:text-white focus-visible:bg-ggr-red focus-visible:text-white md:inline-flex md:min-w-80 md:px-10"
            >
                {children}
            </Link>
        </div>
    );
}
