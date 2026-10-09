import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildMapLinks } from './maps.ts';

const NAME = 'Lurking Class Skate Shop';
const ADDRESS = '213 W Main St, Salisbury, MD 21801';
const Q = 'Lurking%20Class%20Skate%20Shop%2C%20213%20W%20Main%20St%2C%20Salisbury%2C%20MD%2021801';
const ids = (platform) => buildMapLinks(NAME, ADDRESS, platform).map((l) => l.id);

test('ordering per platform; Apple hidden on Android; Google and Waze always present', () => {
    assert.deepEqual(ids('ios'), ['apple', 'google', 'waze']);
    assert.deepEqual(ids('android'), ['google', 'waze']);
    assert.deepEqual(ids('other'), ['google', 'apple', 'waze']);
    assert.deepEqual(buildMapLinks(NAME, ADDRESS).map((l) => l.id), ['google', 'apple', 'waze']);
});

test('urls use one encoded "name, address" query', () => {
    const byId = Object.fromEntries(buildMapLinks(NAME, ADDRESS, 'other').map((l) => [l.id, l.href]));
    assert.equal(byId.google, `https://www.google.com/maps/search/?api=1&query=${Q}`);
    assert.equal(byId.apple, `https://maps.apple.com/?q=${Q}`);
    assert.equal(byId.waze, `https://waze.com/ul?q=${Q}&navigate=yes`);
});

test('special characters in the query are escaped', () => {
    const [google] = buildMapLinks('Joe & Sons #1', '5th Ave', 'other');
    assert.ok(google.href.endsWith('query=Joe%20%26%20Sons%20%231%2C%205th%20Ave'));
});
