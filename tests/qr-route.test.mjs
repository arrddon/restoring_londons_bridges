import test from 'node:test';
import assert from 'node:assert/strict';
import { pointPathFromQR } from '../lib/qr-route.ts';

test('compact field QR identifiers open their bridge point URL', () => {
  assert.equal(pointPathFromQR('A01', 'https://restoring-londons-bridges.vercel.app'), '/AlbertBridge/A01');
  assert.equal(pointPathFromQR(' a05 ', 'https://restoring-londons-bridges.vercel.app'), '/AlbertBridge/A05');
});

test('full point URLs remain compatible and unrelated QR codes are rejected', () => {
  assert.equal(pointPathFromQR('https://restoring-londons-bridges.vercel.app/AlbertBridge/A04', 'https://example.com'), '/AlbertBridge/A04');
  assert.equal(pointPathFromQR('NOT-A-BRIDGE-POINT', 'https://example.com'), null);
});

