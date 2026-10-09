// Run with: pnpm test  (Node's built-in runner; needs Node >= 22.18 to import .ts directly)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { detectPlatform } from './platform.ts';

const UA = {
    iphoneSafari:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    iphoneChrome:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1',
    // iPadOS 13+ Safari requests the desktop site by default and reports a Mac UA.
    ipadSafariDesktop:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    androidChrome:
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
    androidFirefox: 'Mozilla/5.0 (Android 14; Mobile; rv:127.0) Gecko/127.0 Firefox/127.0',
    macSafari:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    macChrome:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    windowsChrome:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    linuxFirefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0',
};

test('iPhone Safari is ios', () => {
    assert.equal(detectPlatform({ userAgent: UA.iphoneSafari, platform: 'iPhone', maxTouchPoints: 5 }), 'ios');
});

test('iPhone Chrome (CriOS) is ios', () => {
    assert.equal(detectPlatform({ userAgent: UA.iphoneChrome, platform: 'iPhone', maxTouchPoints: 5 }), 'ios');
});

test('iPad Safari in desktop mode (Mac UA, multi-touch) is ios', () => {
    assert.equal(detectPlatform({ userAgent: UA.ipadSafariDesktop, platform: 'MacIntel', maxTouchPoints: 5 }), 'ios');
});

test('a real Mac (no multi-touch) is other', () => {
    assert.equal(detectPlatform({ userAgent: UA.macSafari, platform: 'MacIntel', maxTouchPoints: 0 }), 'other');
    assert.equal(
        detectPlatform({ userAgent: UA.macChrome, platform: 'MacIntel', maxTouchPoints: 0, userAgentData: { platform: 'macOS' } }),
        'other',
    );
});

test('Android Chrome is android, via userAgentData or the UA string alone', () => {
    assert.equal(
        detectPlatform({ userAgent: UA.androidChrome, platform: 'Linux armv81', maxTouchPoints: 5, userAgentData: { platform: 'Android' } }),
        'android',
    );
    assert.equal(detectPlatform({ userAgent: UA.androidChrome, platform: 'Linux armv81', maxTouchPoints: 5 }), 'android');
});

test('Android Firefox (no userAgentData) is android', () => {
    assert.equal(detectPlatform({ userAgent: UA.androidFirefox, platform: 'Linux armv81', maxTouchPoints: 5 }), 'android');
});

test('desktop Chrome on Windows is other, even with a touchscreen', () => {
    assert.equal(
        detectPlatform({ userAgent: UA.windowsChrome, platform: 'Win32', maxTouchPoints: 0, userAgentData: { platform: 'Windows' } }),
        'other',
    );
    assert.equal(detectPlatform({ userAgent: UA.windowsChrome, platform: 'Win32', maxTouchPoints: 10 }), 'other');
});

test('desktop Firefox on Linux is other', () => {
    assert.equal(detectPlatform({ userAgent: UA.linuxFirefox, platform: 'Linux x86_64', maxTouchPoints: 0 }), 'other');
});

test('no navigator (server) is other', () => {
    assert.equal(detectPlatform(undefined), 'other');
});
