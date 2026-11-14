// Run with: pnpm test  (Node's built-in runner; needs Node >= 22.18 to import .ts directly)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { easternToday, getShowState, RECAP_WINDOW_DAYS } from './show-state.ts';

const show = (date) => ({ date });

test('an announced show is upcoming up to and including its own day', () => {
    assert.equal(getShowState('2026-10-23', show('2026-10-24')), 'upcoming');
    assert.equal(getShowState('2026-10-24', show('2026-10-24')), 'upcoming');
});

test('the day after the show it is no longer upcoming, so the recap takes over', () => {
    assert.equal(getShowState('2026-10-25', show('2026-10-24'), show('2026-10-24')), 'recent');
});

test('an upcoming show wins over a recent one', () => {
    assert.equal(getShowState('2026-11-01', show('2026-11-20'), show('2026-10-24')), 'upcoming');
});

test('the recap lasts 45 days and not 46', () => {
    assert.equal(RECAP_WINDOW_DAYS, 45);
    // 2026-10-24 + 45 days = 2026-12-08; this range crosses the end of October and November
    assert.equal(getShowState('2026-12-08', undefined, show('2026-10-24')), 'recent');
    assert.equal(getShowState('2026-12-09', undefined, show('2026-10-24')), 'tba');
});

test('the recap window counts calendar days across a month and a year end', () => {
    assert.equal(getShowState('2027-01-14', undefined, show('2026-12-01')), 'recent'); // 44 days
    assert.equal(getShowState('2027-01-15', undefined, show('2026-12-01')), 'recent'); // 45 days
    assert.equal(getShowState('2027-01-16', undefined, show('2026-12-01')), 'tba'); // 46 days
});

test('a last show dated today (no next show announced) still gets the recap', () => {
    assert.equal(getShowState('2026-11-06', undefined, show('2026-11-06')), 'recent');
});

test('with no events it is tba', () => {
    assert.equal(getShowState('2026-11-06'), 'tba');
});

test('a past announced show with no recent last show is tba', () => {
    assert.equal(getShowState('2026-11-06', show('2026-10-01')), 'tba');
});

test('easternToday follows Eastern midnight (EDT is UTC-4, EST is UTC-5)', () => {
    // EDT: midnight in New York is 04:00 UTC
    assert.equal(easternToday(new Date('2026-10-24T03:59:59Z')), '2026-10-23');
    assert.equal(easternToday(new Date('2026-10-24T04:00:00Z')), '2026-10-24');
    // EST (clocks changed on 2026-11-01): midnight is 05:00 UTC
    assert.equal(easternToday(new Date('2026-11-07T04:59:59Z')), '2026-11-06');
    assert.equal(easternToday(new Date('2026-11-07T05:00:00Z')), '2026-11-07');
});

test('the event day stays upcoming until Eastern midnight, then flips to the recap', () => {
    const next = show('2026-10-24');
    const last = show('2026-10-24');
    const at = (iso) => getShowState(easternToday(new Date(iso)), next, last);
    assert.equal(at('2026-10-25T03:59:59Z'), 'upcoming'); // 23:59:59 EDT on the 24th
    assert.equal(at('2026-10-25T04:00:00Z'), 'recent'); // 00:00:00 EDT on the 25th
});
