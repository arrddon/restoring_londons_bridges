import test from 'node:test';
import assert from 'node:assert/strict';
import { qrAccessKey, readQRAccess, writeQRAccess } from '../lib/qr-access-storage.ts';

test('a scanned point remains unlocked independently from other points', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(readQRAccess(storage, 'AlbertBridge', 'spot-01'), false);
  assert.equal(writeQRAccess(storage, 'AlbertBridge', 'spot-01'), true);
  assert.equal(readQRAccess(storage, 'AlbertBridge', 'spot-01'), true);
  assert.equal(readQRAccess(storage, 'AlbertBridge', 'spot-02'), false);
  assert.notEqual(qrAccessKey('AlbertBridge', 'spot-01'), qrAccessKey('HammersmithBridge', 'spot-01'));
});

test('blocked QR access storage fails safely', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(readQRAccess(blocked, 'AlbertBridge', 'spot-01'), false);
  assert.equal(writeQRAccess(blocked, 'AlbertBridge', 'spot-01'), false);
});
