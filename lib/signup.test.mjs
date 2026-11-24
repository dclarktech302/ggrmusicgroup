// Run with: pnpm test  (Node's built-in runner; needs Node >= 22.18 to import .ts directly)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { SIGNUP_URL } from './signup.ts';

test('the signup URL is the komi.io form', () => {
    assert.equal(SIGNUP_URL, 'https://ggr.komi.io/form/b907b906-9048-4e77-95cc-212808858389');
});

// lib/content.ts can't be imported here (it uses the '@/' alias and the image manifest), so check its source.
test('the hero CTA points at the komi.io form, not the old /subscribe page', () => {
    const content = readFileSync(new URL('./content.ts', import.meta.url), 'utf8');
    assert.match(content, /ctaHref: SIGNUP_URL,/);
});
