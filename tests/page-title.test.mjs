import test from 'node:test';
import assert from 'node:assert/strict';
import { bridges } from '../lib/bridge-config.ts';
import { pageTitle } from '../lib/page-title.ts';

test('Hammersmith routes receive specific browser titles', () => {
  assert.equal(pageTitle(['HammersmithBridge'], bridges), 'Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'Guide'], bridges), 'Hammersmith Bridge — Audience Guide');
  assert.equal(pageTitle(['HammersmithBridge', 'QRCodes'], bridges), 'Hammersmith Bridge — QR Codes');
  assert.equal(pageTitle(['HammersmithBridge', 'Guide-H01'], bridges), 'Silvertown Tunnel — Print QR Guide');
  assert.equal(pageTitle(['HammersmithBridge', 'H01'], bridges), 'Silvertown Tunnel — Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'H01', 'ar'], bridges), 'Silvertown Tunnel AR — Hammersmith Bridge');
});
