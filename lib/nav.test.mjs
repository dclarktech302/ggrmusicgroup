// Run with: pnpm test  (Node's built-in runner; needs Node >= 22.18 to import .ts directly)
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { NAV_LINKS } from './nav.ts';

const pageFor = (href) => new URL(`../app${href === '/' ? '' : href}/page.tsx`, import.meta.url);

test('every nav link points at a page that exists', () => {
    for (const { href } of NAV_LINKS) {
        assert.ok(existsSync(pageFor(href)), `no app page for ${href}`);
    }
});

test('the gallery is in the nav at /gallery', () => {
    assert.ok(NAV_LINKS.some((l) => l.label === 'Gallery' && l.href === '/gallery'));
});
