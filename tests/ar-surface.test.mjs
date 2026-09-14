import test from 'node:test';
import assert from 'node:assert/strict';
import { stableSurfaceAnchor } from '../lib/ar-surface.ts';

test('surface anchor waits for enough Android feature-point samples', () => {
  assert.equal(stableSurfaceAnchor([{ x: 1, y: 0, z: -1 }, { x: 1.1, y: .02, z: -1.1 }]), null);
});

test('surface anchor rejects a jumping height and uses robust coordinates', () => {
  const anchor = stableSurfaceAnchor([
    { x: 1, y: .01, z: -1.2 },
    { x: 1.04, y: -.02, z: -1.18 },
    { x: 9, y: 1.1, z: 7 },
    { x: .98, y: 0, z: -1.22 },
  ]);
  assert.deepEqual(anchor, { x: 1, y: 0, z: -1.2 });
});

test('surface anchor rejects horizontally jumping feature points', () => {
  assert.equal(stableSurfaceAnchor([
    { x: 0, y: 0, z: -1 },
    { x: 1, y: .01, z: -1 },
    { x: 2, y: -.01, z: -1 },
  ]), null);
});

