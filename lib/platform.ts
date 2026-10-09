// Pure and dependency-free (erasable TypeScript only) so Node can run it directly in tests.

export type Platform = 'ios' | 'android' | 'other';

/** The slice of `navigator` that detection reads; the real `navigator` satisfies it. */
export interface PlatformNavigator {
    userAgent: string;
    platform?: string;
    maxTouchPoints?: number;
    userAgentData?: { platform?: string };
}

/**
 * Best-effort device platform, used only to order map apps. Call it from an event handler or
 * effect, never during render, so server and client markup match.
 *
 * Prefers `navigator.userAgentData.platform` (Chromium) and falls back to the user agent string.
 * iPadOS in desktop mode reports a Mac UA, so a Mac platform with multi-touch counts as iOS.
 */
export function detectPlatform(
    nav: PlatformNavigator | undefined = typeof navigator === 'undefined' ? undefined : navigator,
): Platform {
    if (!nav) return 'other';

    const hint = nav.userAgentData?.platform ?? '';
    const ua = nav.userAgent ?? '';

    if (/android/i.test(hint) || /android/i.test(ua)) return 'android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';

    const isMac = /mac/i.test(hint) || /mac/i.test(nav.platform ?? '') || /macintosh/i.test(ua);
    if (isMac && (nav.maxTouchPoints ?? 0) > 1) return 'ios';

    return 'other';
}
