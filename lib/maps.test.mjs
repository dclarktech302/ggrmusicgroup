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

test('a suite or floor in the address ("FL 2") stays inside the one encoded query', () => {
    const links = buildMapLinks('The Smokey Heifer', '3 Ninth St FL 2, Ocean City, MD 21842', 'other');
    const q = 'The%20Smokey%20Heifer%2C%203%20Ninth%20St%20FL%202%2C%20Ocean%20City%2C%20MD%2021842';
    assert.equal(links.find((l) => l.id === 'google').href, `https://www.google.com/maps/search/?api=1&query=${q}`);
    assert.equal(links.find((l) => l.id === 'apple').href, `https://maps.apple.com/?q=${q}`);
    assert.equal(links.find((l) => l.id === 'waze').href, `https://waze.com/ul?q=${q}&navigate=yes`);
});
