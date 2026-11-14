// Pure and dependency-free (erasable TypeScript only) so Node can run it directly in tests.
import type { GgrEvent } from '@/lib/types';

export type ShowState = 'upcoming' | 'recent' | 'tba';

/** How long after a show the home page keeps showing its recap. */
export const RECAP_WINDOW_DAYS = 45;

/** The Shore's calendar date as YYYY-MM-DD, whatever time zone the server runs in. */
export function easternToday(now: Date = new Date()): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now);
}

/** Whole days since 1970-01-01, read from the date's parts so no time zone can shift it. */
function dayNumber(isoDate: string): number {
    const [year, month, day] = isoDate.split('-').map(Number);
    return Date.UTC(year, month - 1, day) / 86_400_000;
}

/**
 * Which state the home hero's show stub is in. `today` and the event dates are YYYY-MM-DD strings, so
 * plain string comparison orders them. The event day itself still counts as upcoming.
 */
export function getShowState(
    today: string,
    nextEvent?: Pick<GgrEvent, 'date'>,
    lastEvent?: Pick<GgrEvent, 'date'>,
): ShowState {
    if (nextEvent && nextEvent.date >= today) return 'upcoming';
    if (lastEvent) {
        const daysAgo = dayNumber(today) - dayNumber(lastEvent.date);
        if (daysAgo >= 0 && daysAgo <= RECAP_WINDOW_DAYS) return 'recent';
    }
    return 'tba';
}
