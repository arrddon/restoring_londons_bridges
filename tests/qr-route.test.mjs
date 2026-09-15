import test from 'node:test';
import assert from 'node:assert/strict';
import { bridges } from '../lib/bridge-config.ts';
import { pointPathFromQR, publicPointUrl } from '../lib/qr-route.ts';

test('printable field QR codes contain a directly openable public URL', () => {
  assert.equal(publicPointUrl('/AlbertBridge/A01'), 'https://restoring-londons-bridges.vercel.app/AlbertBridge/A01');
});

test('compact field QR identifiers open their bridge point URL', () => {
  assert.equal(pointPathFromQR('A01', 'https://restoring-londons-bridges.vercel.app'), '/AlbertBridge/A01');
  assert.equal(pointPathFromQR(' a05 ', 'https://restoring-londons-bridges.vercel.app'), '/AlbertBridge/A05');
  assert.equal(pointPathFromQR('H03', 'https://restoring-londons-bridges.vercel.app'), '/HammersmithBridge/H03');
});

test('full point URLs remain compatible and unrelated QR codes are rejected', () => {
  assert.equal(pointPathFromQR('https://restoring-londons-bridges.vercel.app/AlbertBridge/A04', 'https://example.com'), '/AlbertBridge/A04');
  assert.equal(pointPathFromQR('NOT-A-BRIDGE-POINT', 'https://example.com'), null);
});

test('every printable QR URL resolves to the same numbered map pin', () => {
  for (const bridge of bridges) {
    for (const spot of bridge.spots) {
      const url = publicPointUrl(spot.destination);
      assert.equal(pointPathFromQR(url, 'https://example.com'), spot.destination);
      assert.equal(new URL(url).pathname, `/${bridge.id}/${spot.pinId}`);
    }
  }
});
