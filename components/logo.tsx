import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-[2rem] w-auto rounded-full overflow-hidden', className)}
            style={{ '--logo-height': '1.5rem' } as React.CSSProperties}
        >
            <image
                href="/images/logo.png"
                width="78"
                height="18"
                className="h-[var(--logo-height)] w-auto"
                preserveAspectRatio="xMidYMid meet"
            />
        </svg>
    )
}
