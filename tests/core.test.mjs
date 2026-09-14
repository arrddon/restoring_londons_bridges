import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bridges } from '../lib/bridge-config.ts';
import { completionKey, readCompletion, writeCompletion } from '../lib/completion-storage.ts';
import { mapLocations, mapStartingPoints } from '../lib/map-locations.ts';

test('all ten destinations resolve to their bridge and spot', () => {
  assert.equal(bridges.length, 2);
  const urls = new Set();
  for (const bridge of bridges) {
    assert.equal(bridge.spots.length, 5);
    for (const spot of bridge.spots) {
      assert.equal(spot.destination, `/${bridge.id}/${spot.pinId}`);
      assert.equal(spot.bridgeId, bridge.id);
      assert.ok(spot.position.x > 0 && spot.position.x < 1);
      assert.ok(spot.position.y > 0 && spot.position.y < 1);
      urls.add(spot.destination);
    }
  }
  assert.equal(urls.size, 10);
});

test('Albert Bridge uses surveyed pins and starts at A04', () => {
  assert.deepEqual(mapLocations.A01, { latitude: 51.483198, longitude: -0.167068 });
  assert.deepEqual(mapLocations.A02, { latitude: 51.482253, longitude: -0.166610 });
  assert.deepEqual(mapLocations.A03, { latitude: 51.481832, longitude: -0.166397 });
  assert.deepEqual(mapLocations.A04, { latitude: 51.481308, longitude: -0.166309 });
  assert.deepEqual(mapLocations.A05, { latitude: 51.482714, longitude: -0.166838 });
  assert.equal(mapStartingPoints.AlbertBridge, mapLocations.A04);
  const a04 = bridges.find(bridge => bridge.id === 'AlbertBridge').spots.find(spot => spot.pinId === 'A04');
  assert.equal(a04.assetType, '3d');
  assert.equal(a04.destination, '/AlbertBridge/A04');
  assert.equal(a04.modelPath, 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789370699/A04_new_jiqjrc.glb');
});

test('completion persists and never crosses bridges or spots', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-01'), false);
  assert.equal(writeCompletion(storage, 'bridge-a', 'spot-01'), true);
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-01'), true);
  assert.equal(readCompletion(storage, 'bridge-b', 'spot-01'), false);
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-02'), false);
  assert.notEqual(completionKey('bridge-a', 'spot-01'), completionKey('bridge-b', 'spot-01'));
});

test('blocked or corrupt storage does not crash the experience', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
  assert.equal(readCompletion(blocked, 'a', 's'), false);
  assert.equal(writeCompletion(blocked, 'a', 's'), false);
  assert.equal(readCompletion({ getItem: () => '{corrupted}' }, 'a', 's'), false);
});

